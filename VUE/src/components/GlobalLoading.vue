<template>
  <div class="fixed" :style="`background-color: ${bgstyle};`">
    <div class="loading" ref="loading">
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
      <div class="load"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, Ref } from "vue";

export default defineComponent({
  props: {
    bgstyle: {
      type: String,
      default: "rgb(255, 255, 255,.8)",
    },
  },
  setup() {
    const loading = ref(null) as Ref<HTMLElement>;
    nextTick(() => {});

    onMounted(() => {});

    return {
      loading,
    };
  },
});
</script>

<style lang="less" scoped>
.loop(@count) when (@count > 0) {
  &:nth-child(@{count}) {
    transform: rotate((@count * 30deg));
    &::before {
      content: "";
      border-radius: 50%;
      width: 25px;
      display: block;
      height: 25px;
      background-color: transparent;
      animation: loadItem1 1200ms infinite ease-in-out;
      animation-delay: 80ms * (@count - 1);
    }
  }
  .loop((@count - 1));
}
@keyframes loadItem1 {
  0% {
    transform: scale(0.3);
    background: rgb(94, 94, 94);
  }
  50% {
    transform: scale(1);
    background: rgb(94, 94, 94);
  }
  100% {
    transform: scale(0.3);
    background: rgb(94, 94, 94);
  }
}
.fixed {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  opacity: 1;
}
.loading {
  width: 150px;
  height: 150px;
  background-color: transparent;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .load {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: transparent;
    .loop(12);
  }
}
</style>