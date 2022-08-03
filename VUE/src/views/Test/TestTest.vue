<template>
  <div>
    <base-test :data="TEST" name="bbb">
      <template #bbb="{ data, a }">{{ data }},{{ a }}</template>
    </base-test>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseTest from "./compoment/BaseTest.vue";
export default defineComponent({
  components: { BaseTest },
  setup() {
    return {
      TEST: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
});
</script>

<style scoped lang="less">
</style>