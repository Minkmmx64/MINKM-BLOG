<template>
  <div class="notice">
    <div class="title">
      <img src="@/static/notice.png" alt="" />
      <span>公告</span>
    </div>
    <div class="content">暂无内容</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
});
</script>

<style lang="less" scoped>
.notice {
  width: 100%;
  height: 160px;
  border: 2px solid rgba(242,244,246,1);
  box-shadow: 5px 5px 10px rgba(145, 145, 145, 0.5),
        -5px -5px 10px rgba(190, 190, 190, 0.5);
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    height: 40px;
    padding-left: 10px;
    border-bottom: 2px solid rgba(255, 103, 104, 1);
    align-items: center;
    span {
      margin-left: 10px;
      padding-left: 20px;
      border-left: 2px solid rgba(255, 103, 104, 1);
      color: rgba(255, 103, 104, 1);
    }
  }
  img {
    width: 25px;
    height: 25px;
  }
  .content {
    color: rgba(51, 66, 82, 1);
  }
}
</style>