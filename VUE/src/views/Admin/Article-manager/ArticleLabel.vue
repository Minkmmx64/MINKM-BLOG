<template>
  <div class="article">
    <a-row>
      <a-button type="primary" @click="handleEdit('Add')">+新增标签</a-button>
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
        :pagination="true"
      >
        <template #operation="{ record }">
          <a @click="handleEdit(record.label)">编辑</a>
          <a-popconfirm
            title="删除标签?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record.label)"
          >
            <a style="color: red">&nbsp;删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :visible="isEditing"
      :title="`${editTitle}标签`"
      @ok="handleOk"
      @cancel="handleCancel"
      width="80%"
    >
      <a-form
        :model="handleEditorOption"
        :rules="Fromrules"
        v-if="handleEditorOption"
      >
        <a-form-item label="标签名称" name="EditLabel">
          <a-input v-model:value="handleEditorOption.EditLabel" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogLabelApi from "@/api/Modules/BlogLabelModule";
import { ElMessage } from "element-plus";
import { RemoveSpaces } from "@/common/common";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
export default defineComponent({
  components: {},
  setup() {
    const columns = [
      {
        title: "文章标签",
        dataIndex: "label",
        width: 350,
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
        align: "center"
      },
    ];
    const Fromrules = {
      EditLabel: [
        { required: true, message: "请输入标签", trigger: "blur" },
        {
          min: 1,
          max: 20,
          message: "标签必须小于20个字符",
          trigger: "blur",
        },
      ],
    };

    const editTitle = ref();
    const backEditLabel = ref();
    const handleEditorOption = ref({
      EditLabel: "",
    });
    const { loading, isEditing, loadTableData, dataSource, handleCancel } =
      useCommonDataSource(
        BlogLabelApi.getLabelOptions,
        { currentPags: 1, limits: 10 },
        null
      );

    function handleEdit(operation: string) {
      isEditing.value = true;
      if (operation === "Add") {
        editTitle.value = "添加";
      } else {
        editTitle.value = "编辑";
        backEditLabel.value = operation;
        handleEditorOption.value.EditLabel = operation;
      }
    }

    function handleDelete(param: string) {
      BlogLabelApi.deleteBlogLabel(param)
        .then((data) => {
          if (data.data.state === 200) {
            ElMessage.success(data.data.msg);
            loadTableData();
          }
        })
        .catch((error) => {
          /** */
        });
    }

    function handleOk() {
      let query = RemoveSpaces(handleEditorOption.value.EditLabel);

      if (query === "" || query === undefined || query === null) return;

      if (editTitle.value === "添加") {
        BlogLabelApi.addBlogLabel(query)
          .then((data) => {
            if (data.data.state === 200) {
              ElMessage.success(data.data.msg);
              loadTableData();
            }
          })
          .catch((error) => {
            /** */
          });
      } else {
        BlogLabelApi.updateBlogLabel(query, backEditLabel.value)
          .then((data) => {
            if (data.data.state === 200) {
              ElMessage.success(data.data.msg);
              loadTableData();
            }
          })
          .catch((error) => {
            /** */
          });
      }
      handleEditorOption.value.EditLabel = "";
      isEditing.value = false;
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      columns,
      dataSource,
      isEditing,
      loading,
      editTitle,
      Fromrules,
      handleEditorOption,
      handleOk,
      handleCancel,
      handleEdit,
      handleDelete,
      loadTableData,
    };
  },
});
</script>

<style lang="less" scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>