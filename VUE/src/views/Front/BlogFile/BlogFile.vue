<template>
  <div class="m-bg-leave">
    <!-- <LeaveBackGround mtitle="归档" /> -->
    <div class="BlogFile">
      <div class="content">
        <el-timeline>
          <el-timeline-item
            color="#fff"
            :hollow="true"
            size="large"
            :timestamp="item._id"
            placement="top"
            :type="lineType[Math.floor(Math.random() * lineType.length)]"
            v-for="(item, index) in blogFile"
            :key="index"
          >
            <template v-if="item.document">
              <li
                @click="goToArticle(list.article_id)"
                class="list"
                v-for="(list, index) in item.document"
                :key="index"
              >
                <span style="line-height: 50px">{{ list.title }}</span>
                <span
                  :style="`position: absolute;right:10px;bottom:0px;color:rgb(${Math.floor(
                    Math.random() * 255
                  )},${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                  )})`"
                >
                  {{ list.update_at }}
                </span>
              </li>
            </template>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogFrontArticleApi from "@/api/Modules/BlogFrontArticle";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const lineType = ["primary", "success", "warning", "danger", "info"];
    const blogFile = ref();
    const router = useRouter();

    async function loadBlogFile() {
      try {
        let document = await BlogFrontArticleApi.searchBlogFile();
        if (document.data.state === 200) {
          blogFile.value = document.data.data;
        } else throw new Error(document.data.msg);
      } catch (error) {
        ElMessage.error(error);
      }
    }

    function goToArticle(id: string) {
      router.push({
        name: "blogArticle",
        params: { id },
      });
    }

    onMounted(() => {
      loadBlogFile();
    });

    return {
      blogFile,
      lineType,
      goToArticle,
    };
  },
});
</script>

<style lang="less" scoped>
.BlogFile {
  margin-top: 50px;
  padding-bottom: 20px;
}
.content {
  @media screen and (max-width: 1200px) {
    width: 70%;
  }
  @media screen and (max-width: 1000px) {
    width: 80%;
  }
  @media screen and (max-width: 800px) {
    width: 95%;
  }
  width: 50%;
  margin: 0 auto;
}
.line-date {
  font-size: 25px;
}
.list {
  margin-left: 50px;
  background-color: #fff;
  height: 50px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 15px 0 rgba(0, 0, 0, 0.3),
      0 20px 15px 0 rgb(255, 255, 255);
  }
  padding-left: 20px;
  position: relative;
  transition: 700ms all ease;
}
</style>