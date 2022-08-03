<template>
  <div class="Article">
    <div class="title" ref="title">
      <div class="line"></div>
      <div
        class="items"
        v-for="(item, index) in Str"
        :key="index"
        @click="step = index"
      >
        {{ item }}
      </div>
    </div>

    <ArticleList v-if="step === 0" :model="step" />
    <ArticleList v-if="step === 1" :model="step" />
    <ArticleList v-if="step === 2" :model="step" />
    <ArticleList v-if="step === 3" :model="step" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";
import ArticleList from "./components/ArticleList.vue";
export default defineComponent({
  components: {
    ArticleList,
  },
  setup() {
    const title = ref(null);
    const step = ref(0);
    const Str = ["最新文章", "最多浏览", "最近更新", "最多评论"];
    nextTick(() => {
      let item = title.value as HTMLElement;
      let arr = [...item.getElementsByClassName("items")] as HTMLElement[];
      let line = [...item.getElementsByClassName("line")] as HTMLElement[];
      let next = 0;
      arr.forEach((element, index) => {
        element.addEventListener("click", () => {
          next = index;
          line[0].style.left = next * 100 + "px";
        });
      });
    });

    return {
      title,
      Str,
      step,
    };
  },
});
</script>

<style scoped lang="less">
.Article {
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
  .title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    position: relative;
    .items {
      height: 30px;
      text-align: center;
      width: 100px;
      line-height: 30px;
      color: rgba(253, 95, 0, 1);
      cursor: pointer;
    }
    .line {
      display: block;
      @media screen and (max-width:1000px) {
        display: none;
      }
      transition: 500ms all ease-in-out;
      position: absolute;
      width: 100px;
      height: 2px;
      border-radius: 3px;
      background-color: rgba(253, 95, 0, 1);
      top: 40px;
      left: 0;
    }
  }
}
</style>