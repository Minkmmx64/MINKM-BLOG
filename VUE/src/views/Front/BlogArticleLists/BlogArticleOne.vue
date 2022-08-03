<template>
  <div class="MAIN" id="MAIN">
    <CommentBack @top="top" />
    <c-scrollbar style="width: 100%; height: 100vh;" >
      <div class="BlogHead" v-if="dataSource">
        <div class="title">
          {{ dataSource.document.title }}
        </div>
        <div class="other">
          <div class="label">
            <span>标签:{{ dataSource.document.label.toString() }}</span>
          </div>
          <div class="categorie">
            <span>分类:{{ dataSource.document.categorie }}</span>
          </div>
          <div class="author">
            <span>作者署名:{{ dataSource.document.signature }}</span>
          </div>
          <div class="create_at">
            <span>创建时间:{{ dataSource.document.create_at }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;<span
              >修改时间:{{ dataSource.document.update_at }}</span
            >
          </div>
        </div>
        <div class="describe">描述:{{ dataSource.document.describe }}</div>
        <div class="content line-numbers" v-html="content"></div>
        <span v-if="dataSource">
          <span>浏览次数{{ dataSource.doc.browse }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span
            >收藏次数{{
              dataSource.doc.collections
            }}&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
          <span
            >评论次数{{ dataSource.doc.comment }}&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
          <span>点赞次数{{ dataSource.doc.praise }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </span>
      </div>
      <div class="hidden" v-else>
        <a-skeleton active />
        <a-skeleton active />
        <a-skeleton active />
        <a-skeleton active />
        <a-skeleton active />
      </div>
    <BlogArticleComment :article_id="article_id" />
    </c-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import BlogArticleComment from "@/views/Front/BlogArticleLists/BlogArticleComment.vue";
import { useRoute, useRouter } from "vue-router";
import store from "@/store";
import Prismjs from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/themes/prism.css";
import BlogArticleApi from "@/api/Modules/BlogArticleModule";
import CommentBack from "@/components/CommonBack.vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    BlogArticleComment,
    CommentBack,
  },
  setup() {
    const dataSource = ref();
    const route = useRoute();
    const router = useRouter();
    const article_id = route.params.id; //文章id
    const details = ref();
    const content = ref("");
    nextTick(() => {
      Prismjs.highlightAll(); //数据渲染完成后执行一次
    });

    function top() {
      let s = document.getElementById("MAIN");
      console.log(document.body.scrollTop);
    }

    onMounted(() => {
      setTimeout(() => {
        BlogArticleApi.loadHotArticle(
          JSON.stringify({
            article_id: article_id,
            uname:
              store.state.UserStatus === null
                ? null
                : store.getters.getUserName,
          })
        ).then((data) => {
          if (data.data.state === 200) {
            setTimeout(() => {
              dataSource.value = data.data.data;
              details.value = data.data.details;
              content.value = dataSource.value.document.content;
              setTimeout(() => {
                Prismjs.highlightAll(); // 这里加定时器让它后执行，不然没效果
              }, 0);
            }, 500);
          } else {
            ElMessage.error(data.data.msg + "\n[即将返回上一页]");
            setTimeout(() => {
              router.go(-1);
            }, 500);
          }
        });
      }, 500);
    });

    return {
      dataSource,
      article_id,
      details,
      content,
      top,
      router,
    };
  },
});
</script>

<style scoped lang="less">
.MAIN {
  background-color: rgb(245, 245, 245);
}
@keyframes sha {
  0% {
    box-shadow: 1px 1px 9px 1px #ade8f4;
  }
  50% {
    box-shadow: 1px 1px 9px 1px #005380;
  }
  100% {
    box-shadow: 1px 1px 9px 1px #ade8f4;
  }
}
.BlogHead {
  white-space: wrap;
  word-break: break-all;
  transition: 500ms all ease;
  &:hover {
    animation: sha infinite 1500ms linear;
  }
  @media screen and (max-width: 900px) {
    width: 100%;
    margin: 0 auto;
  }
  width: 60%;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  padding-left: 20px;
  padding-right: 20px;
  .title {
    width: 100%;
    height: 60px;
    font-size: 20px;
    text-align: center;
    line-height: 60px;
    color: #000;
    font-weight: bolder;
    border-bottom: 1px dashed gray;
  }
  .content {
    background-color: rgba(255, 255, 255, 1);
    margin-bottom: 100px;
  }
  .other {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    line-height: 25px;
    .create_at {
      color: red;
    }
  }
  .describe {
    font-size: 24px;
    border-bottom: 1px solid rgba(124, 124, 124, 0.3);
  }
}
.hidden {
  width: 50%;
  margin: 0 auto;
}
</style>