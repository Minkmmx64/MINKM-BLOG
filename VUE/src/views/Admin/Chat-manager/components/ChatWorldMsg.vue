<template>
  <div class="worldMsg">
    <div class="box">
      <div class="title">
        公开聊天
        <span style="font-size: 15px; color: #000"
          >当前在线人数{{ $store.getters.getGolbalOnlineCount }}</span
        >
      </div>
      <div id="worldMsgScrollbar" class="ChatSendMsg">
        <ChatMsgContent :dataList="$store.getters.getGolbalUserMessage" />
      </div>
      <div class="send">
        <c-scrollbar
          class="ChatInput mjw-relative"
          style="width: 100%; height: 100%"
        >
          <el-input
            v-model="InputandSendMsg"
            :rows="4"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="success"
            class="mjw-absolute"
            style="bottom: 0; right: 0"
            @click="sendInputMsg"
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
            v-if="isShowEmoji"
            :emojiList="EMOJI"
            @sendEmoji="EmojiMsg"
          />
        </c-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import { handleDate, EMOJI } from "@/common/common";
import store from "@/store";
import ChatMsgContent from "./ChatMsgContent.vue";
import ChatEmoji from "./ChatEmoji.vue";
import { ElMessage } from "element-plus";
import { useQiniuUpload, qiNiuCdn } from "@/composable/Upload";
export default defineComponent({
  components: {
    ChatMsgContent,
    ChatEmoji,
  },
  setup() {
    type msgType = "imgUrl" | "name" | "content" | "date";

    type AcceptMsgData = {
      [K in msgType]: string;
    };

    const dataList = ref() as unknown as AcceptMsgData;

    const isShowEmoji = ref(false);

    const InputandSendMsg = ref("");

    const onLineNumber = ref(0);

    function showEmoji() {
      isShowEmoji.value = !isShowEmoji.value;
    }

    function EmojiMsg(EVENT) {
      if (
        InputandSendMsg.value === "" ||
        InputandSendMsg.value === undefined ||
        InputandSendMsg.value === null
      ) {
        InputandSendMsg.value = EVENT;
      } else {
        InputandSendMsg.value += EVENT;
      }
      isShowEmoji.value = false;
    }

    function sendInputMsg() {
      let WebSocketData = {
        username: store.getters.getUserName,
        avatar: store.getters.getUserImgurl,
        content: InputandSendMsg.value,
        created_at: handleDate(),
        types: "text",
        emit: "GOLBALMESSAGE",
      };
      store.state.webSocket.send(JSON.stringify(WebSocketData));
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
            let data = {
              username: store.getters.getUserName,
              avatar: store.getters.getUserImgurl,
              content: url,
              created_at: handleDate(),
              emit: "GOLBALMESSAGE",
              types: "images",
            };
            store.state.webSocket.send(JSON.stringify(data)); //向websocket发送消息
          },
          "chat/"
        );
      }
    }
    onMounted(() => {});

    return {
      dataList,
      EMOJI,
      isShowEmoji,
      InputandSendMsg,
      onLineNumber,
      showEmoji,
      EmojiMsg,
      sendInputMsg,
      MyUpLoadImg,
    };
  },
});
</script>

<style lang="less" scoped>
.worldMsg {
  box-shadow: 1px 1px 9px 1px #ade8f4;
  position: absolute;
  right: 100px;
  width: 500px;
  height: 800px;
  background-color: rgb(255, 255, 255);
  .box {
    position: relative;
    width: 100%;
    height: 650px;
    .title {
      width: 500px;
      height: 60px;
      text-align: center;
      background-color: #ffffff;
      line-height: 60px;
      font-size: 25px;
      color: #caf0f8;
      position: fixed;
      z-index: 1000;
    }
    .ChatSendMsg {
      box-sizing: border-box;
      width: 500px;
      height: 650px;
      overflow: scroll;
      word-break: break-all;
      padding: 0 20px;
      padding-top: 70px;
    }
    .send {
      width: 100%;
      height: 150px;
    }
  }
}
</style>