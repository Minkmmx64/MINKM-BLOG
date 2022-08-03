<template>
  <div class="Puzzle">
    <div v-if="imgUrl.length > 0 && imgPosition">
      <img
        @click="clickImage(1)"
        class="puzzle-item"
        :src="imgUrl[0].image"
        :style="`width:100px;height:100px;top:${imgPosition[0].top}px;left:${imgPosition[0].left}px;transition:  500ms all ease;`"
      />
      <img
        @click="clickImage(2)"
        class="puzzle-item"
        :src="imgUrl[1].image"
        :style="`width:100px;height:100px;top:${imgPosition[1].top}px;left:${imgPosition[1].left}px;transition:  500ms all ease;`"
      />
      <img
        @click="clickImage(3)"
        class="puzzle-item"
        :src="imgUrl[2].image"
        :style="`width:100px;height:100px;top:${imgPosition[2].top}px;left:${imgPosition[2].left}px;transition:  500ms all ease;`"
      />
      <img
        @click="clickImage(4)"
        class="puzzle-item"
        :src="imgUrl[3].image"
        :style="`width:100px;height:100px;top:${imgPosition[3].top}px;left:${imgPosition[3].left}px;transition:  500ms all ease;`"
      />
      <img
        @click="clickImage(5)"
        class="puzzle-item"
        :src="imgUrl[4].image"
        :style="`width:100px;height:100px;top:${imgPosition[4].top}px;left:${imgPosition[4].left}px;transition:  500ms all ease;`"
      />
      <img
        @click="clickImage(6)"
        class="puzzle-item"
        :src="imgUrl[5].image"
        :style="`width:100px;height:100px;top:${imgPosition[5].top}px;left:${imgPosition[5].left}px;transition:  500ms all ease;`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import UserApi from "@/api/Modules/UserModules";
import { ElMessage } from "element-plus";
export default defineComponent({
  setup(props, ctx) {
    const imgUrl = ref([]);
    const imgPosition = ref([]);
    const step = ref(0);
    const currentIndex = ref(0);
    const res = ref([]);
    const ID = ref();

    function clickImage(index: number) {
      if (step.value === 0) {
        currentIndex.value = index - 1;
        step.value++;
      } else if (step.value === 1) {
        if (currentIndex.value === index - 1) return;
        let k = imgPosition.value[currentIndex.value];
        imgPosition.value[currentIndex.value] = imgPosition.value[index - 1];
        imgPosition.value[index - 1] = k;
        step.value = 0;
        let t = res.value[currentIndex.value];
        res.value[currentIndex.value] = res.value[index - 1];
        res.value[index - 1] = t;
        let code = "";
        for (let i = 0; i < imgUrl.value.length; i++) {
          code += imgUrl.value[res.value[i]].code;
        }
        UserApi.postAuthVcodeImg(code, ID.value)
          .then((auth) => {
            setTimeout(() => {
              if (auth.data.state === 200) {
                ElMessage.success(auth.data.msg);
                step.value = 9999;
                ctx.emit("vcodeOk");
              } else {
                ElMessage.error(auth.data.msg);
                init();
                loadImage();
              }
            }, 600);
          })
          .catch((error) => {
            ElMessage.error(error);
          });
      }
    }

    function init() {
      for (let i = 0; i < 6; i++) {
        res.value[i] = i;
        imgPosition.value[i] = {
          top: Math.floor(i % 2) * 100,
          left: Math.floor(i / 2) * 100,
        };
      }
    }

    function loadImage() {
      UserApi.getAuthVcodeImg()
        .then((data) => {
          if (data.data.state === 200) {
            imgUrl.value = data.data.data.resObj as unknown as [];
            ID.value = data.data.data.ID;
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    onMounted(() => {
      loadImage();
      init();
    });

    return {
      imgUrl,
      init,
      clickImage,
      imgPosition,
    };
  },
});
</script>

<style lang="less" scoped>
.Puzzle {
  margin: 0 auto;
  margin-top: 20px;
  width: 300px;
  height: 200px;
  position: relative;
}
.puzzle-item {
  transition: 500ms all ease;
  cursor: pointer;
  display: block;
  position: absolute;
}
</style>