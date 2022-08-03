<template>
  <div class="mjw-flex-row">
    <div class="ChatMsg mjw-flex-column">
      <!-- 搜索 -->
      <div class="ChatSearch mjw-flex-row">
        <div class="SearchBox">
          <el-row :gutter="20">
            <el-input
              v-model="ChatSearchInput"
              placeholder="添加好友"
              :prefix-icon="Search"
            />
          </el-row>
        </div>
        <div class="ChatAddUser" @click="searchUser">+</div>
      </div>
      <!-- 好友消息列表 -->
      <c-scrollbar class="ChatMsgList">
        <div
          class="userMain mjw-flex-row"
          v-for="(item, index) in store.state.userMsgList"
          :key="index"
          @click="routerGo(index, item.imgUrl, item.name)"
        >
          <img :src="item.imgUrl" alt="" />
          <div class="l_main">
            <div class="t_u">{{ item.name }}</div>
            <div class="b_u">{{ item.lastMsg }}</div>
          </div>
        </div>
      </c-scrollbar>
    </div>
    <div v-if="route.name == 'ChatRoom'">目前还没有好友和你聊天</div>
    <!-- 聊天内容区 -->
    <router-view></router-view>
  </div>
</template>

<script  lang="ts">
import UserLogin from "@/api/Modules/UserModules";
import { Search } from "@element-plus/icons-vue";
import { defineComponent, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import { socketData } from "@/api/common/ChatBase";
export default defineComponent({
  setup() {
    const ChatSearchInput = ref<string>(); //搜索框
    const router = useRouter();
    const route = useRoute();

    function searchUser() {
      //向用户发起好友申请
      if (ChatSearchInput.value === "" || ChatSearchInput.value === undefined) {
        alert("用户名无效");
        return;
      }
      if (ChatSearchInput.value === store.getters.getUserName) {
        alert("你不能向自己添加好友");
        return;
      }
      UserLogin.postVerifyUserName(ChatSearchInput.value)
        .then((doc) => {
          let data: socketData = {
            username: store.getters.getUserName, //发送方
            send_username: ChatSearchInput.value, //接收方
            send_time: "", //发送时间
            emit: "CHATSENDAPPLY",
          };
          store.state.webSocket.send(JSON.stringify(data)); //向socket发送数据
          ElMessage.success("申请成功");
        })
        .catch((err) => {
          ElMessage.error("用户名不存在");
        });
    }
    function routerGo(index: number, imgUrl: string, name: string) {
      //聊天的对象
      router.push({
        path: `ChatSendMessage`,
        query: {
          id: index,
          name: name,
          imgUrl: imgUrl,
        },
      });
    }

    onMounted(() => {});

    return {
      searchUser,
      Search,
      ChatSearchInput,
      routerGo,
      store,
      route,
    };
  },
  components: {},
});
</script>

<style scoped lang="less">
.ChatMsg {
  width: 250px;
  .ChatSearch {
    flex: 0.1;
    align-items: center;
    justify-content: center;
    background-color: rgb(237, 234, 232);
    .SearchBox {
      width: 160px;
      box-sizing: border-box;
    }
    .ChatAddUser {
      width: 25px;
      height: 25px;
      background-color: rgb(220, 217, 216);
      text-align: center;
      line-height: 25px;
      margin-left: 20px;
      border-radius: 5px;
      font-size: 18px;
      color: rgb(88, 88, 88);
      cursor: pointer;
      &:hover {
        background-color: rgb(209, 209, 209);
        color: black;
      }
    }
  }
  .ChatMsgList {
    flex: auto;
    background-color: rgb(223, 222, 222);
    .userMain {
      width: 100%;
      height: 60px;
      box-sizing: border-box;
      padding: 10px 0px 10px 10px;
      .l_main {
        .t_u {
          height: 20px;
          font-size: 18px;
          line-height: 20px;
        }
        .b_u {
          height: 20px;
          font-size: 8px;
          color: rgb(153, 153, 153);
        }
        margin-left: 10px;
      }
      img {
        height: 100%;
        background-color: #fff;
        border-radius: 5px;
      }
      &:hover {
        background-color: rgb(207, 208, 209);
      }
    }
  }
}
</style>