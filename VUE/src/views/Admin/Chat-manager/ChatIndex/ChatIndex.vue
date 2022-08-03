<template>
  <div class="fx" v-if="store.state.UserStatus">
    <div class="myChat mjw-flex-row">
      <div class="user mjw-flex-column">
        <!-- 列表菜单 -->
        <img
          :src="
            store.state.UserStatus.imgUrl == ''
              ? 'src/static/wx.png'
              : store.state.UserStatus.imgUrl
          "
          @click="goToChat('ChatIndex')"
        />
        <el-badge
          :value="
            store.state.userApply.length == 0
              ? ''
              : store.state.userApply.length
          "
          class="item"
          ><img src="@/static/ChatMain/qq.png" @click="goToChat('ChatApply')"
        /></el-badge>
        <img
          src="@/static/ChatMain/mobile.png"
          @click="goToChat('ChatUserInfo')"
        />
      </div>
      <router-view></router-view>
    </div>
    <ChatUserOnLine />
    <ChatWorldMsg />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import store from "@/store";
import ChatWorldMsg from "../components/ChatWorldMsg.vue";
import ChatUserOnLine from "../components/ChatUserOnLine.vue";
export default defineComponent({
  components: {
    ChatWorldMsg,
    ChatUserOnLine,
  },
  setup() {
    function goToChat(param: string) {
      router.push(param);
    }
    return {
      goToChat,
      store,
    };
  },
});
</script>

<style scoped lang="less">
.fx {
  height: 100%;
  align-items: center;
  position: relative;
  .myChat {
    width: 880px;
    height: 780px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.8);
    .user {
      width: 50px;
      box-sizing: border-box;
      background-color: rgb(37, 41, 44);
      justify-content: space-between;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
  }
}
.item {
  z-index: 2000;
}
</style>