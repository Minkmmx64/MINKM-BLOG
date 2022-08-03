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
        <template #image="{ record }">
          <el-image
            style="width: 45px; height: 45px"
            :src="record.picture"
          ></el-image>
        </template>
        <template #content="{ record }">
          <a :href="`blogArticle/${record.article_id}`" target="_blank">访问</a>
        </template>
        <template #operation="{ record }">
          <a @click="handleEdit(record)">编辑</a>
          <a-popconfirm
            title="删除文章?此操作不可恢复"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record.article_id)"
          >
            <a style="color: red">&nbsp;删除</a>
          </a-popconfirm>
          <a @click="handleRecovery(record.article_id)" style="color: #70e000"
            >恢复</a
          >
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :visible="isEditing"
      title="编辑文章"
      @ok="handleOk('update')"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      width="80%"
    >
      <a-form :model="handleEditorOption" v-if="handleEditorOption">
        <a-form-item label="标题" name="title">
          <a-input v-model:value="handleEditorOption.title"></a-input>
        </a-form-item>
        <a-form-item label="作者" name="author">
          <a-input v-model:value="handleEditorOption.author"></a-input>
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
            ></el-option>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { UserOutlined, FontColorsOutlined } from "@ant-design/icons-vue";
import TinymceEditor from "@/components/TinymceEditor.vue";
import BlogArticleApi from "@/api/Modules/BlogArticleModule";
import { deepClone } from "@/common/common";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import { ElMessage } from "element-plus";
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
        title: "文章作者",
        dataIndex: "author",
        width: 100,
        align: "center"
      },
      {
        title: "文章分类",
        dataIndex: "categorie",
        width: 100,
        align: "center"
      },
      {
        title: "文章图片",
        dataIndex: "picture",
        slots: { customRender: "image" },
        width: 100,
        align: "center"
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
    const SelectOptions = ref();
    const SearchFrom = ref<Record<string, any>>({
      user: "",
      content: "",
      title: "",
      categorie: "",
    });

    const {
      dataSource,
      loading,
      handleCancel,
      pagingParam,
      cancleSearchFrom,
      SearchData,
      tableFunction
    } = useCommonDataSource(
      BlogArticleApi.LoadArticleRecovery,
      { currentPags: 1, limits: 10 },
      SearchFrom
    );

    const { total ,loadTableData ,current ,isEditing ,confirmLoading } = tableFunction();

    const {
      handleOk,
      handleEdit
    } = useCommonEditOprions(BlogArticleApi,handleEditorOption,tableFunction);

    //恢复
    function handleRecovery(id: string) {
      BlogArticleApi.delete(id, 1)
        .then((data) => {
          if (data.data.state === 200) {
            ElMessage.success(data.data.msg);
            if ((total.value - 1) % 10 === 0 && total.value !== 1) {
              current.value = current.value - 1;
            }
            loadTableData();
          }
        })
        .catch((error) => ElMessage.error(error));
    }

    //删除
    function handleDelete(record: string) {
      BlogArticleApi.deleteArticle(record)
        .then((data) => {
          if (data.data.state === 200) {
            ElMessage.success(data.data.msg);
            if ((total.value - 1) % 10 === 0 && total.value !== 1) {
              current.value = current.value - 1;
            }
            loadTableData();
          }
        })
        .catch((error) => ElMessage.error(error));
    }

    //加载标签
    function loadSeletOption() {
      BlogArticleApi.loadSelectOptions().then((data) => {
        SelectOptions.value = data.data.data;
      });
      BlogArticleApi.loadLabelOptions().then((data) => {
        SelectLabelOptions.value = data.data.data;
      });
    }

    onMounted(() => {
      loadTableData();
      loadSeletOption();
    });

    return {
      columns,
      current,
      total,
      handleEditorOption,
      isEditing,
      SelectOptions,
      loading,
      SelectLabelOptions,
      dataSource,
      handleOk,
      pagingParam,
      handleDelete,
      handleEdit,
      handleCancel,
      handleRecovery,
      loadTableData,
      SearchFrom,
      cancleSearchFrom,
      SearchData,
      confirmLoading
    };
  },
});
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>