<template>
  <div class="detail">
    <div class="title">标签</div>
    <li class="label" v-for="(item, index) in label" :key="index">
      <div class="name">
        {{ item._id }}
      </div>
      <div class="number">[{{ item.count }}]</div>
    </li>
    <div class="title">分类</div>
    <li class="categories" v-for="(item, index) in categories" :key="index">
      <div class="name">
        {{ item._id }}
      </div>
      <div class="number">[{{ item.count }}]</div>
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogFrontArticleApi from "@/api/Modules/BlogFrontArticle";
import { ElMessage } from "element-plus";
import { randomColorList } from "@/common/Utils";
export default defineComponent({
  setup() {
    const label = ref();
    const categories = ref();
    function loadLabelCategories() {
      BlogFrontArticleApi.clientLabelandCategories()
        .then((data) => {
          if (data.data.state === 200) {
            label.value = data.data.data.label;
            categories.value = data.data.data.categories;
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    onMounted(() => {
      loadLabelCategories();
    });

    return {
      loadLabelCategories,
      label,
      categories,
      randomColorList,
    };
  },
});
</script>

<style lang="less" scoped>
@keyframes aaa {
  0%{
    margin-top: -10px;
  }
  20%{
    margin-top: 8px;
  }
  40%{
    margin-top: -6px;
  }
  60%{
    margin-top: 4px;
  }
  80%{
    margin-top: -2px;
  }
  100%{
    margin-top: 0px;
  }
}
.detail {
  margin-top: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border: 2px solid rgba(242,244,246,1);
  box-shadow: 5px 5px 10px rgba(145, 145, 145, 0.5),
        -5px -5px 10px rgba(190, 190, 190, 0.5);
  border-radius: 10px;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  .label,
  .categories {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    margin-top: 15px;
    box-sizing: border-box;
    .number {
      text-align: center;
      line-height: 45px;
      width: 45px;
      height: 45px;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
      opacity: 1;
      margin-top: 0px;
      transition: 600ms all ease;
      background-color: rgb(144, 208, 233);
      box-shadow: 5px 5px 30px rgba(116, 188, 216, 0.5),
        -5px -5px 30px rgba(116, 188, 216, 0.5);
      &:hover {
        border-radius: 10px;
        animation: aaa 500ms ease-in-out;
        animation-fill-mode: forwards;
        background-color: rgba(255, 255, 255, 0.5);
        color: rgba(247, 23, 53, 1);
      }
    }
    .name {
      height: 45px;
      width: 70%;
      line-height: 45px;
      padding-left: 25px;
      border-radius: 5px;
      color: rgba(247, 23, 53, 1);
      background-color: rgba(255, 255, 255, 0);
      cursor: pointer;
      &:hover {
        border: 1px solid rgba(92, 242, 232, 0.2);
        background-color: rgba(255, 255, 255, 0.9);
        box-shadow: 5px 5px 30px rgba(119, 243, 235, 0.2),
          -5px -5px 30px rgba(119, 243, 235, 0.2);
      }
      transition: 200ms all ease;
      border: 1px solid rgba(246,82,109, 1);
      box-shadow: 0px 0px 1px rgba(92, 242, 232, 1),
        0px 0px 1px rgba(92, 242, 232, 1);
    }
  }
  .title {
    width: 120px;
    color: #fff;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: rgb(255, 97, 118);
    border-radius: 10px;
    margin: 0 auto;
    margin-top: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>