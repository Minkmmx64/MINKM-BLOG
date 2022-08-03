<template>
  <div class="algorithm">
    <a-select
      v-model:value="selectValue"
      size="default"
      style="position: absolute; width: 200px"
      :options="options"
      @change="handleChange"
    ></a-select>
    <canvas v-show="step1" id="algorithm"></canvas>
    <div v-show="step2" class="canvasGroups">
      <canvas id="canvas"></canvas>
      <canvas id="canvas2"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick, ref } from "vue";
import { getCanvas } from "@/common/canvas/CanvasSortAlgorithm";
import { mandelbrotSet } from "@/common/canvas/CanvasAnimation";
import main from "@/common/canvas/canvas_main";
export default defineComponent({
  setup() {
    let canvas1 = undefined as HTMLCanvasElement;
    let canvas2 = undefined as HTMLCanvasElement;

    nextTick(() => {
      canvas1 = document.getElementById("algorithm") as HTMLCanvasElement;
      canvas2 = document.getElementById("canvas") as HTMLCanvasElement;
      mandelbrotSet(canvas2);
      getCanvas(canvas1);
      main();
    });

    const options = ref([
      {
        value: "冒泡排序",
      },
      {
        value: "canvas动画",
      },
    ]);
    const step1 = ref(true);
    const step2 = ref(false);
    const selectValue = ref("冒泡排序");

    function handleChange(e: string) {
      if (e === "canvas动画") {
        step1.value = false;
        step2.value = true;
      } else if (e === "冒泡排序") {
        step1.value = true;
        step2.value = false;
      }
    }

    onMounted(() => {});

    return {
      step1,
      step2,
      options,
      selectValue,
      handleChange,
    };
  },
});
</script>

<style lang="less" scoped >
@import "@/common/less/base.less";
.algorithm {
  width: 100%;
  height: calc(100vh - 60px);
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 1),
    rgb(240, 240, 240)
  );
  position: relative;
}
#canvas {
  position: absolute;
  left: 0px;
  top: 60px;
}
#canvas2 {
  top: 360px;
  position: absolute;
  left: 0px;
  background: linear-gradient(45deg, rgb(0, 0, 0), rgb(240, 240, 240));
}
</style>