<template>
  <div class="tag">
    <div class="title">标签分类</div>
    <a-tag
      class="mitem"
      id="deviation"
      :color="randColors()"
      v-for="item in tagList"
      :key="item"
      @click="handleEmit(item._id)"
    >
      {{ item._id }}({{ item.count }})
    </a-tag>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, toRefs } from "vue";
export default defineComponent({
  props: ["tagList"],
  setup(props, ctx) {
    function handleEmit(item: Record<string, any>) {
      ctx.emit("TagClick", item);
    }

    nextTick(() => {});

    const colorList = [
      "#f50",
      "pink",
      "#87d068",
      "#108ee9",
      "#2db7f5",
      "orange",
      "cyan",
      "rgba(0,102,153,1)",
      "rgba(128,212,246,1)",
      "rgba(246,231,210,1)",
    ];
    const randColors = () => {
      return colorList[Math.floor(Math.random() * colorList.length)];
    };
    return {
      colorList,
      randColors,
      handleEmit,
    };
  },
});
</script>

<style scoped lang="less">

.tag {
  @media screen and (max-width: 1000px) {
    display: none;
  }
  background-color: #fff;
  position: absolute;
  left: 10px;
  top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 15px;
  padding-bottom: 25px;
  display: flex;
  width: 15%;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 2px;
  box-shadow: 0 2px 5px 0 rgb(75, 75, 75), 0 2px 10px 0 rgb(212, 212, 212);
  z-index: 9999;
  overflow: hidden;
  text-align: center;
  .title {
    width: 100%;
    color: rgba(34, 34, 34, 1);
    text-align: center;
  }
  .mitem {
    margin: 5px;
    height: 25px;
    line-height: 25px;
    cursor: pointer;
  }
  .mitems {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0;
    z-index: 99999;
  }
}
</style>