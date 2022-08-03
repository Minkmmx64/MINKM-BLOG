<template>
  <div class="article">
    <a-form layout="inline" :model="SearchFrom">
      <a-form-item label="用户名">
        <a-input v-model:value="SearchFrom.user" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item label="文章内容">
        <a-input v-model:value="SearchFrom.content" placeholder="content">
          <template #prefix
            ><FontColorsOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item label="文章标题">
        <a-input v-model:value="SearchFrom.title" placeholder="content">
          <template #prefix
            ><FontColorsOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item label="文章分类">
        <el-select
          style="width: 100%"
          v-model="SearchFrom.categorie"
          class="m-2"
          placeholder="选择分类"
          size="large"
        >
          <el-option
            v-for="item in SelectOptions"
            :key="item.categorie"
            :label="item.categorie"
            :value="item.categorie"
          >
          </el-option>
        </el-select>
      </a-form-item>
      <a-form-item>
        <a-button @click="SearchData" type="primary" html-type="submit">
          搜索
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="cancleSearchFrom" html-type="submit">
          清空
        </a-button>
      </a-form-item>
    </a-form>
    <EleTable @load="loadTableData(current, pageSize)">
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
        <template #image="{ record }">
          <div class="demo-image__preview">
            <el-image
              style="width: 30px; height: 30px"
              :src="record.picture"
              :preview-src-list="[record.picture]"
              :initial-index="0"
              fit="cover"
            >
            </el-image>
          </div>
        </template>
        <template #content="{ record }">
          <a @click="handleView(record)">查看</a>
        </template>
        <template #operation="{ record }">
          <a @click="handleEdit(record)">编辑</a>
          <a-popconfirm
            title="删除文章?可以在回收站找回"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record.article_id,0)"
          >
            <a style="color: red">&nbsp;删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :confirm-loading="confirmLoading"
      :visible="isEditing"
      title="编辑文章"
      @ok="handleOk('update')"
      @cancel="handleCancel"
      width="80%"
    >
      <a-form :model="handleEditorOption" v-if="handleEditorOption">
        <a-form-item label="标题" name="title">
          <a-input v-model:value="handleEditorOption.title"></a-input>
        </a-form-item>
        <a-form-item label="作者署名" name="author">
          <a-input v-model:value="handleEditorOption.signature"></a-input>
        </a-form-item>
        <a-form-item label="分类" name="categorie">
          <el-select
            style="width: 100%"
            v-model="handleEditorOption.categorie"
            class="m-2"
            placeholder="选择分类"
            size="large"
          >
            <el-option
              v-for="item in SelectOptions"
              :key="item.categorie"
              :label="item.categorie"
              :value="item.categorie"
            >
            </el-option>
          </el-select>
        </a-form-item>
        <a-form-item label="描述" name="describe">
          <a-input v-model:value="handleEditorOption.describe"></a-input>
        </a-form-item>
        <a-form-item label="标签" name="label">
          <el-select
            style="width: 100%"
            multiple
            :multiple-limit="5"
            v-model="handleEditorOption.label"
            class="m-2"
            placeholder="选择分类"
            size="large"
          >
            <el-option
              v-for="item in SelectLabelOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </a-form-item>
        <a-form-item label="图片地址" name="picture">
          <a-input v-model:value="handleEditorOption.picture"></a-input>
        </a-form-item>
        <a-form-item label="内容" name="content">
          <TinymceEditor v-model="handleEditorOption.content"></TinymceEditor>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :visible="isshowing"
      title="查看文章"
      @cancel="showCancel"
      @ok="showCancel"
      width="100%"
      wrapClassName="full-modal"
    >
      <c-scrollbar style="height: 600px; width: 100%">
        <div v-html="content"></div>
      </c-scrollbar>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { UserOutlined, FontColorsOutlined } from "@ant-design/icons-vue";
import { defineComponent, onMounted, ref } from "vue";
import TinymceEditor from "@/components/TinymceEditor.vue";
import BlogArticleApi from "@/api/Modules/BlogArticleModule";
import { ElMessage } from "element-plus";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import { useCommonEditOprions } from "@/composable/useCommonEditOprions";
export default defineComponent({
  components: {
    TinymceEditor,
    UserOutlined,
    FontColorsOutlined,
  },
  setup() {
    const columns = [
      {
        title: "文章Id",
        dataIndex: "article_id",
        ellipsis: true,
        width: 100,
        align: "center"
      },
      {
        title: "文章标题",
        dataIndex: "title",
        ellipsis: true,
        width: 100,
        align: "center"
      },
      {
        title: "文章描述",
        dataIndex: "describe",
        ellipsis: true,
        width: 100,
        align: "center"
      },
      {
        title: "文章标签",
        dataIndex: "label",
        ellipsis: true,
        width: 100,
        align: "center"
      },
      {
        title: "创建用户",
        dataIndex: "author",
        width: 100,
        align: "center"
      },
      {
        title: "作者署名",
        dataIndex: "signature",
        width: 100,
        align: "center"
      },
      {
        title: "文章分类",
        dataIndex: "categorie",
        ellipsis: true,
        width: 100,
        align: "center"
      },
      {
        title: "文章图片",
        dataIndex: "picture",
        slots: { customRender: "image" },
        align: "center",
        width: 100,
      },
      {
        title: "文章内容",
        dataIndex: "content",
        slots: { customRender: "content" },
        width: 100,
        align: "center"
      },

      {
        title: "上传时间",
        dataIndex: "create_at",
        width: 100,
        align: "center"
      },
      {
        title: "修改时间",
        dataIndex: "update_at",
        width: 100,
        align: "center"
      },
      {
        title: "操作",
        slots: { customRender: "operation" },
        width: 100,
        align: "center"
      },
    ];

    const SelectLabelOptions = ref();
    const content = ref("");
    const SelectOptions = ref();
    const isshowing = ref(false);
    const SearchFrom = ref<Record<string, any>>({
      user: "",
      content: "",
      title: "",
      categorie: "",
    });

    const handleEditorOption = ref({
      title: null,
      signature: null,
      categorie: null,
      content: null,
      picture: null,
      label: null,
      describe: null,
      article_id: null,
    });

    const {
      dataSource,
      loading,
      handleCancel,
      pageSize,
      pagingParam,
      cancleSearchFrom,
      SearchData,
      tableFunction
    } = useCommonDataSource(
      BlogArticleApi.loadAllArticle,
      { currentPags: 1, limits: 10 },
      SearchFrom
    );

    const {isEditing,loadTableData,confirmLoading,total,current} = tableFunction();

    const {
      handleEdit,
      handleOk,
      handleDelete
    } = useCommonEditOprions(BlogArticleApi,handleEditorOption,tableFunction);

    function showCancel() {
      isshowing.value = false;
    }

    function handleView(record: Record<string, any>) {
      isshowing.value = true;
      content.value = record.content;
    }

    function loadSeletOption() {
      BlogArticleApi.loadSelectOptions().then((data) => {
        SelectOptions.value = data.data.data;
      });
    }

    onMounted(() => {
      loadTableData(1, 10);
      loadSeletOption();
      BlogArticleApi.loadLabelOptions().then((data) => {
        SelectLabelOptions.value = data.data.data;
      });
    });

    return {
      columns,
      handleEditorOption,
      isEditing,
      SelectOptions,
      loading,
      SearchData,
      content,
      cancleSearchFrom,
      dataSource,
      total,
      current,
      SearchFrom,
      handleView,
      isshowing,
      pageSize,
      SelectLabelOptions,
      handleOk,
      handleDelete,
      handleEdit,
      handleCancel,
      pagingParam,
      showCancel,
      loadTableData,
      confirmLoading
    };
  },
});
</script>

<style scoped lang="less">
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 50px;
  height: 50px;
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>