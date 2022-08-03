<template>
  <div class="table">
    <slot></slot>
    <a-button type="dashed" class="loadData" @click="EmitLoadData">
      刷新数据
    </a-button>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, toRefs, onMounted } from "vue";
export default defineComponent({
  props: {
    count: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    function EmitLoadData() {
      emit("load");
    }

    onMounted(() => {});

    return {
      EmitLoadData,
    };
  },
});
</script>


<style scoped lang="less">
.table {
  margin-top: 15px;
  position: relative;
  border: 1px solid rgba(177, 177, 177,0.6);
  box-shadow: 3px 3px 12px rgba(177, 177, 177,0.8);
  .loadData {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.load {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
</style>