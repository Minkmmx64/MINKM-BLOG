<template>
  <div class="article">
    <a-row>
      <a-button type="primary" @click="handleEdit('Add')">+新增分类</a-button>
    </a-row>
    <EleTable @load="loadTableData">
      <a-table
        class="ant-table-striped"
        size="middle"
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
        :pagination="{ total: total }"
        @change="pagingParam">
        <template #operation="{ record }">
          <a @click="handleEdit('Edit', record)">编辑</a>
          <a-popconfirm
            title="删除分类?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record._id)"
          >
            <a style="color: red">&nbsp;删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :title=" options + '分类'"
      @cancel="handleCancel" 
      @ok="handleOk"
      :confirm-loading="confirmLoading"
      :visible="isEditing">
      <a-form :model="EditSource">
        <a-form-item label="分类名称" name="EditLabel">
          <a-input v-model:value="EditSource.categories" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogWebCategoriesApi from "@/api/Modules/BlogWebCategoriesModule";
import { ElMessage } from "element-plus";
import { RemoveSpaces } from "@/common/common";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
export default defineComponent({
  components: {},
  setup() {
    const columns = [
      {
        title: "分类",
        dataIndex: "categories",
        width: 150,
        align: "center"
      },
      {
        title: "创建时间",
        dataIndex: "create_at",
        width: 350,
        align: "center"
      },
      {
        title: "修改时间",
        dataIndex: "update_at",
        width: 350,
        align: "center"
      },
      {
        title: "操作",
        slots: { customRender: "operation" },
        width: 100,
        align: "center"
      },
    ];
    
    const isEditing = ref(false);
    const EditSource = ref({
      categories: "",
      id: ""
    });
    const confirmLoading = ref(false);
    const options = ref<"编辑" | "添加">("添加");
    const {
      loadTableData,
      loading,
      dataSource,
      pagingParam,
      total,
    } = useCommonDataSource(BlogWebCategoriesApi.getWebCategories,{ currentPags: 1, limits: 10 },null,null);

    function handleEdit(option: "Add" | "Edit",source?:Record<string,string>){
      if(option === "Add"){
        options.value = "添加";
      }else{
        options.value = "编辑";
        EditSource.value.categories = source.categories;
        EditSource.value.id = source._id;
      }
      isEditing.value = true;
    }

    function handleCancel(){
      isEditing.value = false;
    }

    function handleOk(){
      confirmLoading.value = true;
      if(options.value === "添加"){
        BlogWebCategoriesApi.addWebCategories(EditSource.value).then(data => {
          setTimeout(() => {
            if(data.data.state === 200){
              ElMessage.success(data.data.msg);
              loadTableData();
            }else ElMessage.error(data.data.msg);
            confirmLoading.value = false;
            isEditing.value = false;
          }, 800);
        }).catch( error => ElMessage.error(error));
      }else{
        BlogWebCategoriesApi.updateWebCategories(EditSource.value).then(data => {
          setTimeout(() => {
            if(data.data.state === 200){
              ElMessage.success(data.data.msg);
              loadTableData();
            }else ElMessage.error(data.data.msg);
            confirmLoading.value = false;
            isEditing.value = false;
          }, 800);
        }).catch( error => ElMessage.error(error));
      }
    }

    function handleDelete(id:string){
      BlogWebCategoriesApi.deleteWebCategories(id).then(data => {
          setTimeout(() => {
            if(data.data.state === 200){
              ElMessage.success(data.data.msg);
              loadTableData();
            }else ElMessage.error(data.data.msg);
          }, 100);
        }).catch( error => ElMessage.error(error));
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      columns,
      loadTableData,
      loading,
      dataSource,
      pagingParam,
      total,
      handleEdit,
      options,
      isEditing,
      EditSource,
      handleCancel,
      handleOk,
      confirmLoading,
      handleDelete
    };
  },
});
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>