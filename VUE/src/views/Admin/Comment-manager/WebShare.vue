<template>
  <div>
    <a-row>
      <a-button type="primary" @click="handleEdit('Add', null)"
        >+添加网页</a-button
      >
    </a-row>

    <EleTable @load="loadTableData(pageSize, current)">
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
              style="width: 40px; height: 40px"
              :src="record.imgUrl"
              :preview-src-list="[record.imgUrl]"
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
            title="是否删除这个网页分享,该操作不可恢复"
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
      :title="`${editTitle}网页`"
      @ok="handleOk"
      @cancel="handleCancel"
      width="50%"
    >
      <a-form :model="handleEditorOption" v-if="handleEditorOption">
        <a-form-item label="网页标题" name="title">
          <a-input v-model:value="handleEditorOption.title" />
        </a-form-item>
        <a-form-item label="网页描述" name="describe">
          <a-input v-model:value="handleEditorOption.describe" />
        </a-form-item>
        <a-form-item label="网页路径" name="site">
          <a-input v-model:value="handleEditorOption.site" />
        </a-form-item>
        <a-form-item label="网页分类" name="classname">
          <a-select
            ref="select"
            v-model:value="handleEditorOption.classname"
            style="width: 120px"
          >
            <a-select-option v-for="(item,index) in categories" :key="index" :value="item.categories">{{item.categories}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传网页封面" name="fileList">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <img
              class="upload"
              v-if="handleEditorOption.imgUrl"
              :src="handleEditorOption.imgUrl"
              alt="avatar"
            />
            <div v-else>
              <plus-outlined></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useQiniuUpload, qiNiuCdn } from "@/composable/Upload";
import WebShareApi, { WebShare } from "@/api/Modules/BlogWebShareModule";
import BlogWebCategoriesApi from "@/api/Modules/BlogWebCategoriesModule";
import { ElMessage } from "element-plus";
import { deepClone } from "@/common/common";
export default defineComponent({
  components: {
    PlusOutlined,
  },
  setup() {
    const columns = [
      {
        title: "标题",
        dataIndex: "title",
        width: 200,
        align: "center"
      },
      {
        title: "网页描述",
        ellipsis: true,
        dataIndex: "describe",
        width: 200,
        align: "center"
      },
      {
        title: "网页分类",
        ellipsis: true,
        dataIndex: "classname",
        width: 100,
        align: "center"
      },
      {
        title: "网页封面",
        slots: { customRender: "image" },
        width: 100,
        align: "center"
      },
      {
        title: "网页路径",
        slots: { customRender: "url" },
        width: 70,
        align: "center"
      },
      {
        title: "创建时间",
        dataIndex: "create_at",
        width: 200,
        align: "center"
      },
      {
        title: "修改时间",
        dataIndex: "update_at",
        width: 200,
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
    const editTitle = ref();
    const categories = ref();
    const handleEditorOption = reactive({
      imgUrl: "",
      site: "",
      title: "",
      describe: "",
      id: "",
      classname: "",
    }) as unknown as WebShare;
    const dataSource = ref();
    const current = ref(); //分页参数
    const pageSize = ref();
    const total = ref();
    const loading = ref(false);
    function handleEdit(Action: string, data?: Record<string, any>) {
      if (Action === "Add") {
        isEditing.value = true;
        editTitle.value = "添加";
      } else {
        let edit = deepClone(data);
        handleEditorOption.imgUrl = edit.imgUrl;
        handleEditorOption.site = edit.url;
        handleEditorOption.title = edit.title;
        handleEditorOption.describe = edit.describe;
        handleEditorOption.id = edit._id;
        handleEditorOption.classname = edit.classname;
        isEditing.value = true;
        editTitle.value = "编辑";
      }
    }

    function pagingParam(e: { current: number; pageSize: number }) {
      current.value = e.current;
      pageSize.value = e.pageSize;
      loadTableData(current.value, pageSize.value);
    }

    function loadTableData(pageSize: number, current: number) {
      loading.value = true;
      WebShareApi.getBlogWebShare(pageSize, current)
        .then((data) => {
          loading.value = false;
          dataSource.value = data.data.data;
          total.value = data.data.meta.count;
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    function handleOk() {
      const checkUrl =
        /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g; // 匹配网址
      if (!checkUrl.test(handleEditorOption.site)) {
        ElMessage.error("网址不符合");
        return;
      }
      if (editTitle.value === "添加") {
        WebShareApi.addBlogWebShare(handleEditorOption)
          .then((d) => {
            if (d.data.state === 200) {
              setTimeout(() => {
                isEditing.value = false;
                ElMessage.success(d.data.msg);
                for (let k in handleEditorOption) {
                  handleEditorOption[k] = "";
                }
                loadTableData(pageSize.value, current.value);
              }, 500);
            } else if (d.data.state === 400) {
              ElMessage.error(d.data.msg);
            }
          })
          .catch((e) => {
            ElMessage.error(e);
          });
      } else {
        WebShareApi.updateBlogWebShare(handleEditorOption)
          .then((d) => {
            if (d.data.state === 200) {
              isEditing.value = false;
              setTimeout(() => {
                loadTableData(pageSize.value, current.value);
                ElMessage.success(d.data.msg);
                for (let k in handleEditorOption) {
                  handleEditorOption[k] = "";
                }
              }, 300);
            } else if (d.data.state === 400) {
              ElMessage.error(d.data.msg);
            }
          })
          .catch((e) => {
            ElMessage.error(e);
          });
      }
    }

    function handleCancel() {
      isEditing.value = false;
      for (let k in handleEditorOption) {
        handleEditorOption[k] = "";
      }
    }

    function beforeUpload(file) {
      const name = file.name;
      useQiniuUpload(
        file,
        name,
        (res) => {
          let url = `${qiNiuCdn}/${res.key}`;
          handleEditorOption.imgUrl = url;
        },
        "base/"
      );
      return false;
    }

    function handleDelete(id: string) {
      WebShareApi.deleteBlogWebShare(id)
        .then((d) => {
          if (d.data.state === 200) {
            setTimeout(() => {
              loadTableData(pageSize.value, current.value);
              ElMessage.success(d.data.msg);
            }, 300);
          } else if (d.data.state === 400) {
            ElMessage.error(d.data.msg);
          }
        })
        .catch((e) => {
          ElMessage.error(e);
        });
    }

    onMounted( async() => {
      loadTableData(10, 1);
      categories.value = (await BlogWebCategoriesApi.getWebCategories(1,9999)).data.data;
      console.log(categories.value);
      
    });
    return {
      handleEdit,
      isEditing,
      handleEditorOption,
      handleCancel,
      handleOk,
      editTitle,
      beforeUpload,
      loadTableData,
      pagingParam,
      columns,
      loading,
      total,
      dataSource,
      handleDelete,
      categories
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