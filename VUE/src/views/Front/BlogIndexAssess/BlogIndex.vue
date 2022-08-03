<template>
  <c-scrollbar style="height: 100vh">
    <div class="mainbg">
      <UserLogin v-if="store.state.UserStatus" />
      <MainLogin v-else />
      <BlogMain />
    </div>
  </c-scrollbar>
</template>

<script lang="ts">
import MainLogin from "@/views/Front/BlogIndexAssess/components/MainLogin.vue";
import UserLogin from "@/views/Front/BlogIndexAssess/components/UserLogin.vue";
import BlogMain from "@/views/Front/BlogIndexAssess/BlogMain.vue";
import { defineComponent } from "vue";
import store from "@/store";
export default defineComponent({
  components: {
    MainLogin,
    UserLogin,
    BlogMain,
  },
  setup() {
    return {
      store,
    };
  },
});
</script>

<style scoped lang="less">
.mainbg {
  width: 100%;
  height: 100vh;
  z-index: 1000;
}
</style>