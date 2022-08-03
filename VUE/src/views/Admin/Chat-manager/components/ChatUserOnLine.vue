<template>
  <c-scrollbar class="onLine" style="width: 150px; height: 700px">
    <p>在线用户</p>
    <li v-for="(item, index) in $store.getters.getGolbalUserInfo" :key="index">
      <img
        :src="item.avatar"
        alt=""
        srcset=""
        style="width: 30px; height: 30px"
      />
      <span>{{ item.USERNAME }}</span>
    </li>
  </c-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  components: {},
  setup() {
    onMounted(() => {});

    return {};
  },
});
</script>

<style lang="less" scoped>
.onLine {
  position: absolute;
  right: 620px;
  width: 150px;
  height: 700px;
  background-color: rgb(255, 255, 255);
  p {
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  li {
    width: 100%;
    padding-left: 10px;
    margin-top: 5px;
  }
}
</style>