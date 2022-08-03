<template>
  <div class="m-bg-leave">
    <div
      class="bg"
      ref="leaveFixed"
      :style="`background:url(${bgImg});background-repeat: ${
        repeat ? 'repeat' : 'no-repeat'
      };background-size: ${
        repeat ? '' : '100% 100vh'
      };background-color: rgba(0, 0, 0, 1);`"
    >
      <div class="title">{{ mtitle }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, Ref, toRefs } from "vue";
export default defineComponent({
  props: {
    mtitle: {
      type: String,
      default: "TITLE",
    },
    bgImg: {
      type: String,
      default:
        "https://img2.baidu.com/it/u=1304775450,325843103&fm=253&fmt=auto&app=138&f=JPEG?w=658&h=408",
    },
    repeat: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const leaveFixed = ref(null) as Ref<HTMLElement>;

    nextTick(() => {
      leaveFixed.value.addEventListener("click", () => {
        (leaveFixed.value.querySelector(".title") as HTMLElement).style.height =
          "0px";
        (leaveFixed.value.querySelector(".title") as HTMLElement).innerHTML =
          "";
        leaveFixed.value.style.height = "0vh";
      });
    });

    onMounted(() => {});

    return {
      leaveFixed,
    };
  },
});
</script>

<style lang="less" scoped>
.bg {
  cursor: pointer;
  width: 100%;
  height: 100vh;
  transition: 1000ms all ease-out;
  .title {
    width: 100%;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgb(255, 255, 255);
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 0%;
    text-align: center;
    line-height: 50px;
  }
}
</style>