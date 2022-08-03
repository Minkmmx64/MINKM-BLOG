<template>
  <div>
    <EleTable @load="loadTableData">
      <a-table
        class="ant-table-striped"
        size="middle"
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :rowClassName="
          (record, index) => (index % 2 === 1 ? 'table-striped' : null)
        "
        :pagination="{ total: total }"
        @change="pagingParam"
      >
        <template #collections="{ record }">
          {{ record.collections }} <a-divider type="vertical" />
          <a @click="show('collections', record.article_id)">查看</a>
        </template>
        <template #comment="{ record }">
          {{ record.comment }} <a-divider type="vertical" />
          <a @click="show('comment', record.article_id)">查看</a>
        </template>
        <template #action="{ record }">
          <a style="color: green" @click="editComment(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="showChildComments(record._id)">查看子评论</a>
        </template>
      </a-table>
    </EleTable>
  </div>

  <a-modal
    :visible="isEdit"
    title="编辑评论"
    @cancel="isEdit = false"
    @ok="handleOk"
    :confirm-loading="confirmLoading"
  >
    <a-form-item label="评论">
      <a-textarea
        v-model:value="editOptions.comment"
        placeholder="Basic usage"
        :rows="4"
      />
    </a-form-item>
  </a-modal>

  <a-modal
    v-if="isShowCommentF"
    :visible="isShowComment"
    @ok="cancel"
    @cancel="cancel"
    title="查看收藏"
    width="80%"
  >
    <show-child-comment :id="id" :pid="parentId" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref } from "vue";
import BlogDetailApi from "@/api/Modules/BlogArticleDetails";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import { ElMessage } from "element-plus";
import ShowChildComment from "./ShowChildComment.vue";
export default defineComponent({
  props: {
    id: String,
    pid: {
      type: String,
      default: "root",
    },
  },
  components: {
    ShowChildComment,
  },
  setup(props) {
    const { id, pid } = toRefs(props);
    const parentId = ref();
    const isShowComment = ref(false);
    const isShowCommentF = ref(false);
    const columns = [
      {
        title: "文章id",
        dataIndex: "article_id",
        width: 100,
      },
      {
        title: "评论用户",
        dataIndex: "username",
        width: 100,
      },
      {
        title: "评论内容",
        dataIndex: "comment",
        width: 100,
      },
      {
        title: "评论时间",
        dataIndex: "created_at",
        width: 100,
      },
      {
        title: "点赞数",
        dataIndex: "comment_like",
        width: 100,
      },
      {
        title: "不点赞数",
        dataIndex: "comment_dislike",
        width: 100,
      },
      {
        title: "操作",
        slots: { customRender: "action" },
        width: 100,
      },
    ];

    const isEdit = ref(false);
    const editOptions = ref({
      comment: "",
      id: "",
    });
    const confirmLoading = ref(false);
    const { loading, dataSource, loadTableData, pagingParam, total } =
      useCommonDataSource(
        BlogDetailApi.selectArticleCommentFromId,
        { currentPags: 1, limits: 10 },
        null,
        () => {
          return {
            articleId: id.value,
            pid: pid.value,
          };
        }
      );

    function showChildComments(id: string) {
      isShowComment.value = true;
      parentId.value = id;
      isShowCommentF.value = true;
    }

    function editComment(record: Record<string, any>) {
      isEdit.value = true;
      editOptions.value.comment = record.comment;
      editOptions.value.id = record._id;
    }

    function cancel() {
      isShowComment.value = false;
      setTimeout(() => {
        isShowCommentF.value = false;
      }, 500);
    }

    function handleOk() {
      confirmLoading.value = true;
      BlogDetailApi.updateCommentFromId(
        editOptions.value.id,
        editOptions.value.comment
      )
        .then((d) => {
          if (d.data.state === 200) {
            setTimeout(() => {
              confirmLoading.value = false;
              loadTableData();
              ElMessage.success(d.data.msg);
              isEdit.value = false;
              editOptions.value.comment = "";
            }, 500);
          } else if (d.data.state >= 400) {
            ElMessage.error(d.data.msg);
            isEdit.value = false;
            confirmLoading.value = false;
          }
        })
        .catch((e) => {});
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      confirmLoading,
      columns,
      editComment,
      loading,
      handleOk,
      cancel,
      isEdit,
      dataSource,
      loadTableData,
      showChildComments,
      pagingParam,
      total,
      editOptions,
      isShowComment,
      parentId,
      isShowCommentF,
    };
  },
});
</script>

<style lang="less" scoped>
</style>