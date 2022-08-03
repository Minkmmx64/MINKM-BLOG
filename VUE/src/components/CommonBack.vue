<template>
  <div class="back" @click="back">
    <img src="@/static/article_back.png" alt="" />
  </div>
  <!-- <div class="top" @click="top">
    <img src="@/static/top.png" alt="">
  </div> -->
  <el-backtop :right="100" :bottom="100" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  emits: ["top"],
  setup(prop, { emit }) {
    const router = useRouter();

    function back() {
      router.go(-1);
    }

    function top() {
      emit("top");
    }

    return {
      back,
      top,
    };
  },
});
</script>

<style lang="less" scoped>
.back {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: 500ms all ease;
  z-index: 9999;
  img {
    width: 30px;
    height: 30px;
  }
  &:hover {
    opacity: 0.5;
  }
  cursor: pointer;
}
.top {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: 500ms all ease;
  img {
    width: 30px;
    height: 30px;
  }
  &:hover {
    opacity: 0.5;
  }
  cursor: pointer;
}
</style>