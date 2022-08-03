<template>
  <div>
    <a-row>
      <a-button type="primary" @click="handleEdit('Add', null)"
        >+添加图片</a-button
      >
    </a-row>

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
      >
        <template #image="{ record }">
          <div class="demo-image__preview">
            <el-image
              style="width: 40px; height: 40px"
              :src="record.avatar"
              :preview-src-list="[record.avatar]"
              :initial-index="0"
              fit="cover"
            >
            </el-image>
          </div>
        </template>
        <template #url="{ record }">
          <a :href="record.url" target="_blank">访问</a>
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
      :visible="isEditing"
      :title="`${editTitle}轮播图`"
      @cancel="handCancel"
      @ok="handleOk"
      :confirm-loading="confirmLoading"
    >
      <a-form :model="handleEditorOption" v-if="handleEditorOption">
        <a-form-item label="上传轮播图" name="avatar">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <img
              class="upload"
              v-if="handleEditorOption.avatar"
              :src="handleEditorOption.avatar"
              alt="avatar"
            />
            <div v-else>
              <plus-outlined></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="图片标题">
          <a-input v-model:value="handleEditorOption.title" />
        </a-form-item>
        <a-form-item label="图片链接">
          <a-input v-model:value="handleEditorOption.url" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useQiniuUpload, qiNiuCdn } from "@/composable/Upload";
import { PlusOutlined } from "@ant-design/icons-vue";
import { ElMessage } from "element-plus";
import BlogBannersApi from "@/api/Modules/BlogBannersModle";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    const columns = [
      {
        title: "标题",
        dataIndex: "title",
        width: 100,
        align: "center"
      },
      {
        title: "图片",
        slots: { customRender: "image" },
        width: 100,
        align: "center"
      },
      {
        title: "图片链接",
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
    const editTitle = ref<"添加" | "编辑">();
    const handleEditorOption = ref({
      avatar: "",
      title: "",
      url: "",
    });
    const confirmLoading = ref(false);
    const editId = ref();
    const { loadTableData, dataSource, loading } = useCommonDataSource(
      BlogBannersApi.getBlogBanners,
      null,
      null
    );

    function handleEdit(action: "Add" | "Edit", data?: Record<string, any>) {
      if (action === "Add") {
        editTitle.value = "添加";
      } else {
        editTitle.value = "编辑";
        editId.value = data._id;
        handleEditorOption.value.avatar = data.avatar;
        handleEditorOption.value.url = data.url;
        handleEditorOption.value.title = data.title;
      }
      isEditing.value = true;
    }

    function handCancel() {
      isEditing.value = false;
    }

    function handleDelete(id: string) {
      BlogBannersApi.deleteBlogBanners(id)
        .then((d) => {
          if (d.data.state === 200) {
            ElMessage.success(d.data.msg);
            loadTableData();
          } else if (d.data.state >= 400) {
            ElMessage.error(d.data.msg);
          }
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    function handleOk() {
      const checkUrl =
        /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g; // 匹配网址
      if (!checkUrl.test(handleEditorOption.value.url)) {
        ElMessage.error("网址不符合");
        return;
      } else if (
        handleEditorOption.value.title === "" ||
        handleEditorOption.value.title === undefined ||
        handleEditorOption.value.title === null
      ) {
        ElMessage.error("标题不能为空");
        return;
      }
      confirmLoading.value = true;
      if (editTitle.value === "添加") {
        BlogBannersApi.addBlogBanners(handleEditorOption.value)
          .then((d) => {
            if (d.data.state === 200) {
              setTimeout(() => {
                loadTableData();
                confirmLoading.value = false;
                isEditing.value = false;
                ElMessage.success(d.data.msg);
                for (let k in handleEditorOption.value) {
                  handleEditorOption.value[k] = "";
                }
              }, 800);
            } else if (d.data.state >= 400) {
              ElMessage.error(d.data.msg);
              confirmLoading.value = false;
              isEditing.value = false;
            }
          })
          .catch((error) => {
            ElMessage.error(error);
          });
      } else if (editTitle.value === "编辑") {
        BlogBannersApi.updateBlogBanners(editId.value, handleEditorOption.value)
          .then((d) => {
            if (d.data.state === 200) {
              setTimeout(() => {
                loadTableData();
                confirmLoading.value = false;
                isEditing.value = false;
                ElMessage.success(d.data.msg);
                for (let k in handleEditorOption.value) {
                  handleEditorOption.value[k] = "";
                }
              }, 800);
            } else if (d.data.state >= 400) {
              ElMessage.error(d.data.msg);
              confirmLoading.value = false;
              isEditing.value = false;
            }
          })
          .catch((error) => {
            ElMessage.error(error);
          });
      }
    }

    function beforeUpload(file) {
      const name = file.name;
      useQiniuUpload(
        file,
        name,
        (res) => {
          let url = `${qiNiuCdn}/${res.key}`;
          handleEditorOption.value.avatar = url;
        },
        "base/"
      );
      return false;
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      handleEdit,
      isEditing,
      handleOk,
      editTitle,
      handCancel,
      handleEditorOption,
      beforeUpload,
      confirmLoading,
      loadTableData,
      dataSource,
      loading,
      columns,
      editId,
      handleDelete,
    };
  },
});
</script>

<style scoped lang="less">
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