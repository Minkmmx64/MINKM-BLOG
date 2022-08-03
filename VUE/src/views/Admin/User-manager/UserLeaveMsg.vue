<template>
  <div>
    <a-button type="primary" ghost @click="step = 0">已读留言</a-button>
    <a-divider type="vertical" />
    <a-button danger ghost @click="step = 1">未读留言</a-button>
    <UserLeaveMsgNOTRead v-if="step === 1" />
    <UserLeaveMsgISRead v-if="step === 0" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import UserLeaveMsgNOTRead from "./components/UserLeaveMsgNOTRead.vue";
import UserLeaveMsgISRead from "./components/UserLeaveMsgISRead.vue";
export default defineComponent({
  components: { UserLeaveMsgNOTRead, UserLeaveMsgISRead },
  setup() {
    const step = ref(0);

    onMounted(() => {});
    return {
      step,
    };
  },
});
</script>

<style scoped lang="less">
</style>