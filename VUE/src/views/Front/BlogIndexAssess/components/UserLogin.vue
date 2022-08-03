<template>
  <div class="UserLogin">
    <el-dropdown>
      <div class="login">
        <img :src="store.getters.getUserImgurl" />
        <div>
          <span>{{ store.getters.getUserName }}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu size="small">
          <el-dropdown-item @click="logOut(0)">进入后台</el-dropdown-item>
          <el-dropdown-item @click="logOut(1)">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
          
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
export default defineComponent({
  setup() {
    const router = useRouter();

    function logOut(type: number) {
      if (type === 0) {
        router.push("admin");
      } else if (type === 1) {
        //发送下线通知
        let data = {
          emit: "USEROFFLINE",
          userName: store.getters.getUserName,
        };
        store.state.webSocket.send(JSON.stringify(data));
        store.dispatch("AuthRemoveSync");
        window.location.reload();
      }
    }

    return {
      store,
      logOut,
    };
  },
});
</script>

<style scoped lang="less">
.UserLogin {
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 3000;
  height: 40px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: rgba(187,222,214,1);
  transition: 500ms all ease;
  &:hover{
    background-color: rgba(206,239,228,1);
  }
  border-radius: 5px;
  cursor: pointer;
  img {
    width: 30px;
    height: 30px;
  }
  span {
    margin-left: 15px;
    color: rgb(255, 255, 255);
  }
}
.login{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    border-radius: 50%;
  }
}
</style>