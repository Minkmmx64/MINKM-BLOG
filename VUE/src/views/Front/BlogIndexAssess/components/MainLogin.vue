<template>
  <div>
    <div class="main">
      <div style="position: absolute; left: -60px; top: -6px">
        <a-button type="primary" danger @click="show(false, true)"
          >注册</a-button
        >
      </div>
      <div style="position: absolute; left: -140px; top: -6px">
        <a-button type="primary" @click="show(true, false)">登录</a-button>
      </div>
    </div>
    <div class="bg" v-if="config.isshow">
      <div class="login" v-if="config.isshowLogin">
        <el-button
          size="mini"
          @click="(config.isshow = false), (verifyOk = false)"
          style="margin-left: 222px"
          >关闭</el-button
        >
        <br /><br />
        <div class="loginMain">
          <el-input v-model="userLogin.uname" placeholder="User Name" />
          <!-- 登录 -->
          <br /><br />
          <el-input
            v-model="userLogin.psd"
            show-password
            placeholder="User Password"
          />
          <PuzzLeVcode @vcodeOk="verifyOk = true" />
          <el-button
            type="primary"
            v-if="verifyOk"
            class="b"
            @click="openFullScreenAndLogin(1)"
            >登录</el-button
          >
        </div>
      </div>
      <div class="register" v-if="config.isshowRegister">
        <el-button
          size="mini"
          @click="config.isshow = false"
          style="margin-left: 222px"
          >关闭</el-button
        >
        <br /><br />

        <div class="RegisterMain">
          <!-- 注册 -->
          <el-input
            v-model="userRegist.uname"
            placeholder="用户名中英文数字下划线(6-20个字符)"
          />
          <br /><br />

          <el-input
            v-model="userRegist.nickname"
            placeholder="昵称中英文下划线(6-20个字符)"
          />
          <br /><br />

          <el-input
            v-model="userRegist.psd"
            show-password
            placeholder="密码 （6-20位英文数字）"
          />
          <br /><br />

          <el-input
            v-model="userRegist.bpsd"
            show-password
            placeholder="再次确认密码"
          />
          <br /><br />

          <el-input v-model="userRegist.phone" placeholder="手机号" />
          <el-button type="primary" class="b" @click="openFullScreenAndLogin(0)"
            >注册</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElLoading } from "element-plus";
import { defineComponent, onMounted, ref } from "vue";
import UserLogin from "@/api/Modules/UserModules";
import { IUserLogin, IUserRegist } from "@/api/common/ChatBase";
import router from "@/router";
import PuzzLeVcode from "@/components/PuzzLeVcode.vue";
export default defineComponent({
  components: { PuzzLeVcode },
  setup() {
    onMounted(() => {});

    const config = ref({
      isshow: false,
      isshowLogin: false,
      isshowRegister: false,
    });
    const verifyOk = ref(false);
    const userLogin = ref<IUserLogin>({
      uname: "", //登录用户名
      psd: "", //登录密码
    });

    const userRegist = ref<IUserRegist>({
      uname: "",
      psd: "",
      bpsd: "",
      phone: "",
      nickname: "",
    });

    function show(v1: boolean, v2: boolean) {
      config.value.isshow = true;
      config.value.isshowLogin = v1;
      config.value.isshowRegister = v2;
    }

    const openFullScreenAndLogin = (type: number) => {
      //进行登录
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        if (type) {
          //登录验证
          UserLogin.postLogin(userLogin.value)
            .then((data: { data }) => {
              UserLogin.setUserInfoStorageSync(data.data);
              setTimeout(() => {
                router.replace("admin");
              }, 300);
            })
            .catch(() => {
              verifyOk.value = false;
            });
        } else {
          //注册验证
          UserLogin.postRegist(userRegist.value);
        }
        config.value.isshowLogin = false;
        config.value.isshow = false;
        loading.close();
      }, 500);
    };

    return {
      show,
      userRegist,
      openFullScreenAndLogin,
      config,
      userLogin,
      verifyOk,
    };
  },
});
</script>

<style scoped lang="less">
.main {
  position: absolute;
  z-index: 3000;
  right: 20px;
  top: 20px;
}
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  animation: show 0.5s linear;
  .login,
  .register {
    @media screen and (max-width: 1000px) {
      width: 100%;
    }
    width: 500px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
  }
}
.loginMain,
.RegisterMain {
  .b {
    position: absolute;
    left: 50%;
    top: 85%;
    transform: translate(-50%, -50%);
  }
}
@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
}
</style>