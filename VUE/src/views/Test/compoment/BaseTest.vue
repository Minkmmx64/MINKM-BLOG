<template>
  <div>
    <slot :name="name" :data="data" :a="[1, 2, 3]"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["data", "name"],
  setup() {},
});
</script>

<style lang="less" scoped>
</style>