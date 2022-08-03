<template>
  <div class="article">
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
      </a-table>
    </EleTable>

    <a-modal
      v-if="isShowCommentF"
      :visible="isShowComment"
      @ok="cancel"
      @cancel="cancel"
      title="查看评论"
      width="80%"
    >
      <c-scrollbar style="height: 500px; width: 100%">
        <ShowComment :id="articleId" />
      </c-scrollbar>
    </a-modal>

    <a-modal
      :visible="isShowCollection"
      @ok="isShowCollection = false"
      @cancel="isShowCollection = false"
      title="查看收藏"
      width="80%"
    >
      <ShowCollection :id="articleId" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogDetailApi from "@/api/Modules/BlogArticleDetails";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import ShowCollection from "./compoments/ShowCollection.vue";
import ShowComment from "./compoments/ShowComment.vue";
export default defineComponent({
  components: {
    ShowCollection,
    ShowComment,
  },
  setup() {
    const columns = [
      {
        title: "文章Id",
        dataIndex: "article_id",
        width: 100,
        align: "center"
      },
      {
        title: "标题",
        dataIndex: "title",
        width: 200,
        align: "center"
      },
      {
        title: "浏览数",
        dataIndex: "browse",
        width: 100,
        align: "center"
      },
      {
        title: "文章收藏数",
        slots: { customRender: "collections" },
        width: 100,
        align: "center"
      },
      {
        title: "评论数",
        slots: { customRender: "comment" },
        width: 100,
        align: "center"
      },
    ];

    function cancel() {
      isShowComment.value = false;
      setTimeout(() => {
        isShowCommentF.value = false;
      }, 500);
    }

    const {
      total,
      pageSize,
      dataSource,
      loading,
      current,
      pagingParam,
      loadTableData,
    } = useCommonDataSource(
      BlogDetailApi.selectArticleDetails,
      { currentPags: 1, limits: 10 },
      null
    );
    const isShowCommentF = ref(false);
    const isShowComment = ref(false);
    const isShowCollection = ref(false);
    const articleId = ref();

    function show(action: "comment" | "collections", id: string) {
      articleId.value = id;
      switch (action) {
        case "comment": {
          isShowComment.value = true;
          isShowCollection.value = false;
          isShowCommentF.value = true;
          break;
        }
        case "collections": {
          isShowComment.value = false;
          isShowCommentF.value = false;
          isShowCollection.value = true;
          break;
        }
      }
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      isShowComment,
      articleId,
      columns,
      pageSize,
      cancel,
      current,
      loading,
      dataSource,
      isShowCollection,
      isShowCommentF,
      loadTableData,
      pagingParam,
      total,
      show,
    };
  },
});
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>