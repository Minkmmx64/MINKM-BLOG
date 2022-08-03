<template>
  <div class="comment">
    <div class="inpu">
      <a-textarea
        v-model:value="textareaValue"
        placeholder="Basic usage"
        :rows="4"
      />
      <div class="b">
        <a-button type="primary" size="large" @click="sendArticleComment">
          发表评论
        </a-button>
      </div>
    </div>
    <ul v-if="$store.state">
      <li v-for="(item, index) in commentList" :key="index">
        <a-timeline-item>
          <CommentList
            :data="item"
            :icomment="true"
            :article_id="article_id"
            :user_id="item._id"
          >
            <template v-if="item.children">
              <li v-for="(item1, index1) in item.children" :key="index1">
                <CommentList
                  :data="item1"
                  :article_id="article_id"
                  :user_id="item1._id"
                />
              </li>
            </template>
          </CommentList>
        </a-timeline-item>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  getCurrentInstance,
} from "vue";
import BlogCommentApi, {
  BlogCommentModule,
} from "@/api/Modules/BlogCommentModule";
import CommentList from "@/views/Front/BlogArticleLists/components/CommentList.vue";
import store from "@/store";
import { ElMessage } from "element-plus";
import { converComment, IconverComment } from "@/common/common";
export default defineComponent({
  components: {
    CommentList,
  },
  props: {
    article_id: {
      //文章id
      type: String,
      default: "1",
    },
  },
  setup(props) {
    const { article_id } = toRefs(props);
    const textareaValue = ref<string>();
    const commentList = ref();

    const internalInstance = getCurrentInstance(); //当前组件实例
    const $bus = internalInstance.appContext.config.globalProperties.$bus;

    $bus.on("childrenComment", () => {
      loadArticleComment(article_id.value);
    });

    function sendArticleComment() {
      if (store.state.UserStatus === null) {
        ElMessage.error("未登录");
        return;
      }
      if (
        textareaValue.value === "" ||
        textareaValue.value === undefined ||
        textareaValue.value === null
      )
        return;
      let data: BlogCommentModule = {
        username: store.getters.getUserName,
        comment: textareaValue.value,
        article_id: article_id.value,
        parent_id: "root",
        avatar: store.getters.getUserImgurl,
      };

      BlogCommentApi.sendComment(data)
        .then((d) => {
          if (d.data.state === 200) {
            textareaValue.value = "";
            ElMessage.success(d.data.msg);
            loadArticleComment(article_id.value);
          }
        })
        .catch((err) => {
          /** */
        });
    }

    function loadArticleComment(id: string) {
      BlogCommentApi.selectCommentByArticleId(id)
        .then((d) => {
          let conver = d.data.data as unknown as IconverComment[];
          commentList.value = converComment(conver);
        })
        .catch((err) => {
          /** */
        });
    }

    onMounted(() => {
      loadArticleComment(article_id.value);
    });

    return {
      commentList,
      textareaValue,
      sendArticleComment,
    };
  },
});
</script>

<style lang="less" scoped>
.comment {
  width: 60%;
  @media screen and (max-width: 900px) {
    width: 100%;
    margin: 0 auto;
  }
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  .inpu {
    .b {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>