<template>
  <div class="FriendChain">
    <a-row>
      <a-button type="primary" @click="handleEdit('Add')">+添加链接</a-button>
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
        <template #image="{ record }">
          <div class="demo-image__preview">
            <el-image
              style="width: 40px; height: 40px"
              :src="record.chain_avatar"
              :preview-src-list="[record.chain_avatar]"
              :initial-index="0"
              fit="cover">
            </el-image>
          </div>
        </template>
        <template #url="{ record }">
          <a :href="record.chain_side" target="_blank">访问</a>
        </template>
        <template #action="{ record }">
          <a @click="handleEdit('Edit', record)">编辑</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a-popconfirm
            title="是否删除"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record._id)"
          >
            <a style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :title=" options + '友链'"
      @cancel="handleCancel" 
      @ok="handleOk"
      :confirm-loading="confirmLoading"
      :visible="isEditing">
      <a-form :model="EditSource">
        <a-form-item label="图片地址">
          <a-input v-model:value="EditSource.avatar" />
          <a-image
            :width="100"
            style="margin-top: 10px;"
            :height="100"
            :src="EditSource.avatar"
            fallback="data:image/png;base64,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"/>
        </a-form-item>
        <a-form-item label="站点标题">
          <a-input v-model:value="EditSource.title" />
        </a-form-item>
        <a-form-item label="站点链接">
          <a-input v-model:value="EditSource.side" />
        </a-form-item>
        <a-form-item label="站点描述">
          <a-input v-model:value="EditSource.describe" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogFriendChainApi from '@/api/Modules/BlogFriendChainModule';
import { ElMessage } from "element-plus";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
export default defineComponent({
  setup() {
    const columns = [
      {
        title: "标题",
        dataIndex: "chain_title",
        width: 100,
        ellipsis: true,
        align: "center"
      },
      {
        title: "描述",
        dataIndex: "chain_describe",
        width: 100,
        ellipsis: true,
        align: "center"
      },
      {
        title: "图片",
        slots: { customRender: "image" },
        width: 50,
        align: "center"
      },
      {
        title: "链接",
        slots: { customRender: "url" },
        width: 100,
        align: "center"
      },
      {
        title: "创建时间",
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
        slots: { customRender: "action" },
        width: 100,
        align: "center"
      },
    ];
      
    const isEditing = ref(false);
    const EditSource = ref({
      avatar: "",
      side: "",
      title: "",
      describe: "",
      id: ""
    });
    
    const options = ref<"编辑" | "添加">("添加");
    const confirmLoading = ref(false);

    const {
      loadTableData,
      loading,
      dataSource,
      pagingParam,
      total,
    } = useCommonDataSource(BlogFriendChainApi.getFriendChain,{ currentPags: 1, limits: 10 },null,null);

    function handleEdit(option: "Add" | "Edit",source?:Record<string,string>){
      if(option === "Add"){
        options.value = "添加";
      }else{
        options.value = "编辑";
        EditSource.value.avatar = source.chain_avatar;
        EditSource.value.side = source.chain_side;
        EditSource.value.title = source.chain_title;
        EditSource.value.describe = source.chain_describe;
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
        BlogFriendChainApi.addFriendChain(EditSource.value).then(data => {
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
        BlogFriendChainApi.updateFriendChain(EditSource.value).then(data => {
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
      BlogFriendChainApi.deleteFriendChain(id).then(data => {
          setTimeout(() => {
            if(data.data.state === 200){
              ElMessage.success(data.data.msg);
              loadTableData();
            }else ElMessage.error(data.data.msg);
          }, 100);
        }).catch( error => ElMessage.error(error));
    }

    onMounted(() => loadTableData());

    return {
      isEditing,
      handleEdit,
      handleCancel,
      handleOk,
      EditSource,
      options,
      confirmLoading,
      loadTableData,
      loading,
      dataSource,
      pagingParam,
      total,
      columns,
      handleDelete
    };
  },
});
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload,
.upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100px;
  height: 100px;
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>