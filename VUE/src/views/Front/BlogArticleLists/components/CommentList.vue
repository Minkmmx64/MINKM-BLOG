<template>
  <a-comment>
    <template #actions>
      <span key="comment-basic-like" @click="handlelike(true)">
        <a-tooltip title="Like">
          <template v-if="PraiseData[0]">
            <LikeFilled />
          </template>
          <template v-else>
            <LikeOutlined />
          </template>
        </a-tooltip>
        <span style="padding-left: 8px; cursor: auto">
          {{ Data.comment_like }}
        </span>
      </span>
      <span key="comment-basic-dislike" @click="handlelike(false)">
        <a-tooltip title="Dislike">
          <template v-if="PraiseData[1]">
            <DislikeFilled />
          </template>
          <template v-else>
            <DislikeOutlined />
          </template>
        </a-tooltip>
        <span style="padding-left: 8px; cursor: auto">
          {{ Data.comment_dislike }}
        </span>
      </span>
      <span v-if="$store.state.UserStatus">
        <span key="comment-basic-reply-to"
          ><a
            type="danger"
            style="color: rgb(255, 120, 117)"
            v-if="Data.username === $store.state.UserStatus.username"
            >删除评论</a
          ></span
        >
      </span>
    </template>
    <template #author>
      <a>{{ Data.username }}</a>
    </template>
    <template #avatar>
      <a-avatar :src="Data.avatar" alt="Han Solo" />
    </template>
    <template #content>
      <p>{{ Data.comment }}</p>
    </template>
    <a-divider style="border-color: #eeeeee; margin: 0px" dashed />
    <slot></slot>
    <template #datetime>
      <a-tooltip :title="Data.created_at">
        <span>{{ moment(Data.created_at).fromNow() }}</span>
      </a-tooltip>
    </template>
    <template v-if="icomment">
      <a @click="showComment = !showComment">回复</a>
    </template>
  </a-comment>
  <a-modal
    centered
    v-model:visible="showComment"
    title="发布评论"
    @ok="sendComment"
    ok-text="发布评论"
  >
    <a-textarea
      placeholder="Basic usage"
      v-model:value="textareaValue"
      :rows="4"
    />
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  toRefs,
  getCurrentInstance,
} from "vue";
import moment from "moment";
import store from "@/store";
import BlogCommentApi, {
  BlogCommentModule,
} from "@/api/Modules/BlogCommentModule";
import { ElMessage } from "element-plus";
import {
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    LikeFilled,
    LikeOutlined,
    DislikeFilled,
    DislikeOutlined,
  },
  props: {
    article_id: {
      //文章id
      type: String,
      default: "1",
    },
    user_id: {
      type: String,
      default: "0",
    },
    data: {
      type: Object,
    },
    icomment: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, cxt) {
    //回复文章id下的用户评论id
    const { article_id, icomment, data, user_id } = toRefs(props);
    const Data = ref(data);
    const PraiseData = ref([0, 0]);
    const textareaValue = ref();
    const internalInstance = getCurrentInstance(); //当前组件实例
    const $bus = internalInstance.appContext.config.globalProperties.$bus;
    function handlelike(type: boolean) {
      if (type) {
        let data = {
          like: PraiseData.value[0] === 1 ? 0 : 1,
          like_count: PraiseData.value[0] === 1 ? -1 : 1,
          dislike: 0,
          dislike_count: PraiseData.value[1] === 1 ? -1 : 0,
          username: store.getters.getUserName,
          article_id: article_id.value,
        };
        PraiseData.value[0] = PraiseData.value[0] === 1 ? 0 : 1;
        Data.value.comment_like = PraiseData.value[0]
          ? Data.value.comment_like + 1
          : Data.value.comment_like - 1;
        if (PraiseData.value[1] === 1) {
          PraiseData.value[1] = 0;
          Data.value.comment_dislike = Data.value.comment_dislike - 1;
        } else PraiseData.value[1] = 0;
        BlogCommentApi.praiseComment(user_id.value, data)
          .then((d) => {
            if (d.data.state === 200) {
              ElMessage.success(d.data.msg);
            } else ElMessage.warning(d.data.msg);
          })
          .catch((err) => {
            ElMessage.warning(err);
          });
      } else {
        let data = {
          like: 0,
          like_count: PraiseData.value[0] === 1 ? -1 : 0,
          dislike: PraiseData.value[1] === 0 ? 1 : 0,
          dislike_count: PraiseData.value[1] === 1 ? -1 : 1,
          username: store.getters.getUserName,
          article_id: article_id.value,
        };
        PraiseData.value[1] = PraiseData.value[1] === 1 ? 0 : 1;
        Data.value.comment_dislike = PraiseData.value[1]
          ? Data.value.comment_dislike + 1
          : Data.value.comment_dislike - 1;
        if (PraiseData.value[0] === 1) {
          PraiseData.value[0] = 0;
          Data.value.comment_like = Data.value.comment_like - 1;
        } else PraiseData.value[0] = 0;
        BlogCommentApi.praiseComment(user_id.value, data)
          .then((d) => {
            if (d.data.state === 200) {
              ElMessage.success(d.data.msg);
            } else ElMessage.warning(d.data.msg);
          })
          .catch((err) => {
            ElMessage.warning(err);
          });
      }
    }

    function sendComment() {
      if (
        textareaValue.value === "" ||
        textareaValue.value === undefined ||
        textareaValue.value === null
      )
        return;
      let data = {
        username: store.getters.getUserName,
        comment: textareaValue.value,
        article_id: article_id.value,
        parent_id: user_id.value,
        avatar: store.getters.getUserImgurl,
      } as BlogCommentModule;
      BlogCommentApi.sendComment(data)
        .then((d) => {
          if (d.data.state === 200) {
            ElMessage.success(d.data.msg);
            showComment.value = false;
            textareaValue.value = "";
            $bus.emit("childrenComment");
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    }

    const showComment = ref(false);

    onMounted(() => {
      setTimeout(() => {
        if (store.state.UserStatus) {
          BlogCommentApi.selectPraiseComment(
            store.getters.getUserName,
            user_id.value
          ).then((d) => {
            if (d.data.data !== null) {
              PraiseData.value[0] = d.data.data.like;
              PraiseData.value[1] = d.data.data.dislike;
            }
          });
        }
      }, 500);
    });

    return {
      moment,
      Data,
      showComment,
      textareaValue,
      sendComment,
      handlelike,
      PraiseData,
    };
  },
});
</script>

<style lang="less" scoped>
/deep/ .ant-comment-inner {
  padding: 5px 0;
}
/deep/ .ant-comment-nested {
  margin-left: 20px;
}
</style>