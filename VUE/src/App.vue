<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { LoadUserBaseInfo } from "./common/LoadUserBaseInfo";
import store from "./store";
import { LoadSocketEvent } from "./common/LoadSocketEvent";
export default defineComponent({
  setup() {
    onMounted(() => {
      setInterval(() => {
        if (store.state.webSocket !== null) {
          let data = {
            emit: "USERISONLINE",
            userName: store.getters.getUserName,
          };
          store.state.webSocket.send(JSON.stringify(data));
        }
      }, 1000 * 60 * 10);

      //轮询判断有无登录
      let checkIsLogin = setInterval(() => {
        if (store.state.UserStatus !== null) {
          LoadUserBaseInfo(); //加载信息
          LoadSocketEvent(null, null); //在VUE界面接受socket事件
          let state = JSON.parse(sessionStorage.getItem("userMsg"));
          store.state.UserStatus = state.UserStatus;
          store.state.golbalOnlineCount = state.golbalOnlineCount;
          store.state.golbalUserInfo = state.golbalUserInfo;
          clearInterval(checkIsLogin);
        } else {
          if (sessionStorage.getItem("userMsg") !== null) {
            let state = JSON.parse(sessionStorage.getItem("userMsg"));
            store.state.UserStatus = state.UserStatus;
            store.state.golbalOnlineCount = state.golbalOnlineCount;
            store.state.golbalUserInfo = state.golbalUserInfo;
            LoadUserBaseInfo(); //加载信息
            LoadSocketEvent(null, null); //在VUE界面接受socket事件
            clearInterval(checkIsLogin);
          }
        }
      }, 400);

      window.addEventListener("beforeunload", () => {
        if (sessionStorage.getItem("userMsg") !== null) {
          sessionStorage.setItem("userMsg", JSON.stringify(store.state));
        }
      });

      window.addEventListener("unload", () => {
        if (store.state.webSocket !== null && !store.state.status) {
          let data = {
            emit: "USEROFFLINE",
            userName: store.getters.getUserName,
          };
          store.state.webSocket.send(JSON.stringify(data));
        }
      });

      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          document.title = "哦 ~ 你在这 _(:зゝ∠)_";
        } else {
          document.title = "你去哪了 ?? !! ｜д•´)!!";
        }
      });
    });
  },
});
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
html {
  height: 100%;
}

body {
  height: 100%;
  width: 100vw;
  overflow: hidden;
  
}

</style>