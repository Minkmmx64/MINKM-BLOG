<template>
  <div class="m-bg-leave">
    <!-- <LeaveBackGround mtitle="网页分享" /> -->
    <div class="WebShare">
      <LabelOrCateTag :tagList="TagQuery" @TagClick="TagSearchLoad" />
      <c-scrollbar
        @scroll="handleScroll"
        style="width: 100%; height: calc(100vh - 60px);"
      >
        <div class="content mjw-flex-row">
          <li
            class="web-share-item mjw-flex-row"
            @click="open(item.url)"
            v-for="(item, index) in BlogWebShare"
            :key="index"
            :style="`background-color: ${
              colorItems[Math.floor(Math.random() * colorItems.length)]
            };`"
          >
            <div
              class="bgim"
              :style="`
              width:120px;
              height:100%;
              background-image: url(${item.imgUrl});
              background-repeat: no-repeat;
              background-size: 100% 100%;`"
            ></div>
            <div class="describe">
              {{ item.describe }}
            </div>
            <div class="title">
              {{ item.title }}
            </div>
            <span class="class">{{ item.classname }}</span>
          </li>
        </div>
      </c-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
//import {BlogWebShare,WebShare} from '@/test/mock';
import LabelOrCateTag from "@/components/LabelOrCateTag.vue";
import BlogWebShareApi from "@/api/Modules/BlogWebShareModule";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    LabelOrCateTag,
  },
  setup() {
    const TagQuery = ref();
    const BlogWebShare = ref();
    const colorItems = [
      "rgba(249,188,221,.9)",
      "rgba(250,227,217,.9)",
      "rgba(217,217,243,.9)",
      "rgba(244,240,230,1)",
      "rgba(245,247,250,1)",
    ];
    const searchValue = ref({
      categorie: "",
    });

    function open(url: string) {
      window.open(url, "_blank");
    }

    function handleScroll(E) {
      console.log(E);
    }

    function TagSearchLoad(e: Record<string, any> & string) {
      if (searchValue.value.categorie === e) {
        searchValue.value.categorie = "";
      } else searchValue.value.categorie = e;
      load();
    }

    function load() {
      BlogWebShareApi.getClientWebShare(searchValue.value)
        .then((d) => {
          if (d.data.state === 200) {
            BlogWebShare.value = d.data.data;
            TagQuery.value = d.data.meta.query;
          } else ElMessage.error(d.data.msg);
        })
        .catch((e) => {
          ElMessage.error(e);
        });
    }

    onMounted(() => {
      load();
    });
    return {
      open,
      BlogWebShare,
      colorItems,
      TagSearchLoad,
      load,
      handleScroll,
      TagQuery,
    };
  },
});
</script>

<style scoped lang="less">
.WebShare {
  padding-bottom: 50px;
  position: relative;
}
.content {
  width: 70%;
  margin: 0 auto;
  height: calc(100vh - 60px);
  background-color: transparent;
  justify-content: center;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
}
.web-share-item {
  width: 270px;
  @media screen and (max-width: 700px) {
    width: 200px;
    margin-left: 10px;
  }
  @media screen and (max-width: 500px) {
    width: 180px;
    margin-left:10px;
  }
  @media screen and (max-width: 380px) {
    width: 90%;
    margin:10px auto;
  }
  overflow: hidden;
  margin-top: 10px;
  margin-left: 50px;
  height: 100px;
  border-radius: 10px;
  transition: 0.5s all;
  align-items: center;
  position: relative;
  color: #000000;
  margin-bottom: 20px;
  .describe {
    top: 0px;
    height: 0px;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    width: 270px;
    transition: 1s all;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
  }
  &:hover > .describe {
    height: 400px;
  }
  .title {
    text-align: center;
    width: 150px;
    transition: 0.5s all;
    opacity: 1;
    color: #000000;
  }
  .class {
    padding-left: 5px;
    padding-right: 5px;
    box-sizing: border-box;
    text-align: center;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    line-height: 30px;
    position: absolute;
    color: rgba(0, 0, 0, 0.7);
    bottom: 0px;
    right: 35px;
  }
  .bgim {
    transition: 0.5s all;
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
  &:hover > .bgim {
    filter: blur(1px);
    transform: scale(2);
  }
  &:hover > .title {
    opacity: 0;
  }
}
</style>