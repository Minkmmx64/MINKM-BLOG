<template>
  <div class="pagination">
    <div class="main">
      <div class="l" @click="pagesReduce">&lt;</div>
      <div class="btn">{{ nowPages }}</div>
      <div class="btn">{{ paginationNumber }}</div>
      <div class="r" @click="pagesAdd">&gt;</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs } from "vue";
import { usePagination } from "@/composable/usePagination";
export default defineComponent({
  props: {
    total: {
      //总数据
      type: Number,
    },
    pageSize: {
      //每一页数量
      type: Number,
      default: 10,
    },
  },
  setup(props, ctx) {
    const { total, pageSize } = toRefs(props);

    const { pagesReduce, pagesAdd, nowPages, paginationNumber } = usePagination(
      total,
      pageSize,
      ctx
    );

    onMounted(() => {});

    return {
      pagesReduce,
      pagesAdd,
      nowPages,
      paginationNumber,
    };
  },
});
</script>

<style scoped lang="less">
.pagination {
  width: 100%;
  z-index: 9999;
  box-shadow: 0 4px 5px 0 rgb(158, 158, 158), 0 2px 15px 0 rgb(255, 255, 255);
}
.main {
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgb(255, 255, 255);
  display: flex;
  text-align: center;
  line-height: 50px;
  justify-content: space-between;
  .l,
  .r,
  .btn {
    cursor: pointer;
    height: 100%;
    width: 50px;
    background-color: rgb(59, 59, 59);
    transition: 500ms all;
    &:hover {
      background-color: rgba(255, 255, 255, 1);
      color: rgb(0, 0, 0);
    }
  }
}
</style>