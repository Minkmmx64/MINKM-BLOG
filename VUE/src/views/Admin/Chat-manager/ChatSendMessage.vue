<template>
  <div class="ChatContent mjw-flex-column" v-if="store.state.UserStatus">
    <div class="ChatHearder">
      <div class="namd">{{ username }}</div>
    </div>
    <div class="ChatIndex mjw-flex-column">
      <div
        id="contentScrollbar"
        class="ChatSendMsg"
        style="width: 100%; height: 0"
      >
        <ChatMsgContent :dataList="SendMsgData"></ChatMsgContent>
      </div>
      <c-scrollbar
        class="ChatInput mjw-relative"
        style="width: 100%; height: 100%"
      >
        <el-input
          v-model="InputandSendMsg"
          :rows="3"
          type="textarea"
          placeholder="Please input"
        />
        <el-button
          type="success"
          class="mjw-absolute"
          style="bottom: 0; right: 0"
          @click="sendUserMsg(InputandSendMsg)"
          >发送(S)</el-button
        >
        <el-button
          class="mjw-absolute"
          style="bottom: 0; left: 0"
          @click="showEmoji"
          >表情</el-button
        >
        <el-upload
          class="upload-demo"
          method="POST"
          name="img"
          action=""
          :show-file-list="false"
          :http-request="MyUpLoadImg"
        >
          <el-button class="mjw-absolute" style="bottom: 0; left: 100px">
            图片
          </el-button>
        </el-upload>

        <ChatEmoji
          v-if="isshowEmoji"
          :emojiList="EMOJI"
          @sendEmoji="EmojiMsg"
        />
      </c-scrollbar>
    </div>
  </div>
</template>

<script  lang="ts">
import ChatMsgContent from "./components/ChatMsgContent.vue";
import UserLogin from "@/api/Modules/UserModules";
import { defineComponent, ref, onMounted, watch } from "vue";
import { userSendMsgData, socketData } from "@/api/common/ChatBase";
import { useRoute } from "vue-router";
import store from "@/store";
import { handleDate, EMOJI } from "@/common/common";
import ChatEmoji from "@/views/Admin/Chat-manager/components/ChatEmoji.vue";
import { message } from "ant-design-vue";
import { LoadSocketEvent } from "@/common/LoadSocketEvent";
import { ElMessage } from "element-plus";
import { useQiniuUpload, qiNiuCdn } from "@/composable/Upload";
export default defineComponent({
  components: {
    ChatMsgContent,
    ChatEmoji,
  },
  setup() {
    const InputandSendMsg = ref<string>(); //输入消息
    const SendMsgData = ref<userSendMsgData[]>([]);
    const username = ref();
    const imgSrc = ref();
    const route = useRoute();
    const isshowEmoji = ref(false);

    function showEmoji() {
      isshowEmoji.value = !isshowEmoji.value;
    }

    if (store.state.UserStatus) {
      LoadSocketEvent(SendMsgData, username);
    }

    function EmojiMsg(e) {
      //console.log(e);
      if (InputandSendMsg.value !== undefined) {
        InputandSendMsg.value += e;
      } else InputandSendMsg.value = e;
      isshowEmoji.value = false;
    }

    function sendUserMsg(params: string) {
      if (InputandSendMsg.value === "" || InputandSendMsg.value === undefined) {
        message.error("不能输入空格或不输入");
        return;
      }

      let data: socketData = {
        emit: "CHATACCEPTMESSAGE",
        send_time: handleDate(),
        value: store.getters.getUserImgurl,
        uname: store.getters.getUserName, //发送方
        send_username: username.value, //接受方
        send_msg: params, //内容
        types: "text",
      };

      store.state.webSocket.send(JSON.stringify(data)); //向websocket发送消息

      SendMsgData.value.push({
        imgUrl: imgSrc.value,
        name: store.getters.getUserName,
        sned_name: username.value,
        content: params,
        date: handleDate(),
        types: "text",
      });
      InputandSendMsg.value = "";
    }

    /**
     * 上传图片之前
     */

    function MyUpLoadImg(param: any) {
      if (
        param.file.type !== "image/jpeg" &&
        param.file.type !== "image/png" &&
        param.file.type !== "image/jpg"
      ) {
        ElMessage.error("格式错误");
        return false;
      } else {
        const file = param.file;
        const key = param.filename;
        useQiniuUpload(
          file,
          key,
          (res) => {
            let url = `${qiNiuCdn}/${res.key}`;
            let data: socketData = {
              emit: "CHATACCEPTMESSAGE",
              send_time: handleDate(),
              value: store.getters.getUserImgurl,
              uname: store.getters.getUserName, //发送方
              send_username: username.value, //接受方
              send_msg: url, //内容
              types: "images",
            };
            store.state.webSocket.send(JSON.stringify(data)); //向websocket发送消息

            SendMsgData.value.push({
              imgUrl: imgSrc.value,
              name: store.getters.getUserName,
              sned_name: username.value,
              content: url,
              date: handleDate(),
              types: "images",
            });
          },
          "chat/"
        );
      }
    }

    onMounted(() => {
      username.value = route.query.name; //加载用户名
      imgSrc.value = route.query.imgUrl;
      UserLogin.getUserFriendMsg(
        store.getters.getUserName,
        username.value
      ).then((data: any[]) => {
        if (data.length === 0) {
          /** */
        } else {
          data.forEach((ele) => {
            SendMsgData.value.push({
              imgUrl: imgSrc.value,
              name:
                ele.state === 1 ? username.value : store.getters.getUserName,
              sned_name:
                ele.state === 0 ? username.value : store.getters.getUserName,
              content: ele.msg,
              date: ele.create_at,
              types: ele.types,
            });
          });
        }
      });
    });

    watch(route, (oldRoute, newRoute) => {
      //监听路由变化
      SendMsgData.value = [];
      username.value = newRoute.query.name;
      imgSrc.value = newRoute.query.imgUrl;
      UserLogin.getUserFriendMsg(
        store.getters.getUserName,
        username.value
      ).then((data: any[]) => {
        if (data.length) {
          data.forEach((ele) => {
            SendMsgData.value.push({
              imgUrl: imgSrc.value,
              name:
                ele.state === 1 ? username.value : store.getters.getUserName,
              sned_name:
                ele.state === 0 ? username.value : store.getters.getUserName,
              content: ele.msg,
              date: ele.create_at,
              types: ele.types,
            });
          });
        }
      });
    });
    return {
      username,
      store,
      imgSrc,
      route,
      EMOJI,
      InputandSendMsg,
      SendMsgData,
      sendUserMsg,
      isshowEmoji,
      showEmoji,
      EmojiMsg,
      MyUpLoadImg,
    };
  },
});
</script>

<style scoped lang="less">
.ChatContent {
  width: 580px;
  background-color: rgb(245, 245, 245);
  .ChatHearder {
    border-bottom: 1px rgba(144, 147, 153, 0.5) solid;
    flex: 0.1;
    .namd {
      margin-left: 20px;
      margin-top: 30px;
      font-size: 20px;
    }
  }
  .ChatIndex {
    flex: 0.9;
    .ChatSendMsg {
      box-sizing: border-box;
      flex: auto;
      height: 100%;
      overflow: scroll;
      word-break: break-all;
      padding: 0 20px;
    }
    .ChatInput {
      flex: 0.2;
      background-color: #fff;
    }
  }
}
</style>