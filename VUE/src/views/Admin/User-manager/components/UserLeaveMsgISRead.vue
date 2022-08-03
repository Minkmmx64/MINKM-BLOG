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
        :expandRowByClick="true"
      >
        <template #avatar="{ record }">
          <el-image
            style="width: 45px; height: 45px"
            :src="record.avatar"
            :preview-src-list="[record.avatar]"
            :initial-index="0"
            fit="cover"
          >
          </el-image>
        </template>
        <template #login="{ record }">
          <a-badge :status="record.islogin ? 'success' : 'processing'" />{{
            record.islogin ? "是" : "否"
          }}
        </template>
        <template #isread="{ record }">
          <a-badge :status="record.isread ? 'success' : 'processing'" />{{
            record.isread ? "是" : "否"
          }}
        </template>
        <template #action="{ record }">
          <a @click="handleEdit(record)" >修改</a>
        </template>
        <template #content="{ record }">
          <a-divider type="vertical" />
          <a @click="handleView(record.content)">查看</a>
          <a-divider type="vertical" />
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :visible="showModal"
      centered
      :confirm-loading="confirmLoading"
      :title="isView ? '查看留言' : '编辑留言'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div v-if="isView">
        <p v-html="leaveMsg"></p>
      </div>
      <div v-else>
        <a-form-item label="留言">
          <a-textarea
            v-model:value="textarea"
            placeholder="Basic usage"
            :rows="4"
          />
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import LeaveMsgApi from "@/api/Modules/LeaveMsgModule";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import { ElMessage } from "element-plus";
import store from "@/store";
export default defineComponent({
  setup() {
    const columns = [
      {
        title: "用户名",
        dataIndex: "username",
        width: 100,
        key: "username",
        align: "center"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        width: 100,
        key: "email",
        align: "center"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        width: 100,
        key: "phone",
        align: "center"
      },
      {
        title: "站点",
        dataIndex: "side",
        width: 100,
        key: "side",
        align: "center"
      },
      {
        title: "用户头像",
        slots: { customRender: "avatar" },
        //dataIndex: 'avatar',
        width: 100,
        key: "avatar",
        align: "center"
      },
      {
        title: "qq账号",
        dataIndex: "qqnumber",
        width: 100,
        key: "qqnumber",
        align: "center"
      },
      {
        title: "是否登录留言",
        slots: { customRender: "login" },
        //dataIndex: 'islogin',
        width: 100,
        key: "login",
        align: "center"
      },
      {
        title: "留言内容",
        slots: { customRender: "content" },
        //dataIndex: 'content',
        width: 100,
        key: "content",
        align: "center"
      },
      {
        title: "是否回复",
        slots: { customRender: "isread" },
        //dataIndex: 'isread',
        width: 100,
        key: "isread",
        align: "center"
      },
      {
        title: "留言日期",
        dataIndex: "create_at",
        width: 100,
        key: "create_at",
        align: "center"
      },
      {
        title: "操作",
        slots: { customRender: "action" },
        width: 100,
        key: "action",
        align: "center"
      },
    ];

    const { loadTableData, loading, total, pagingParam, dataSource } =
      useCommonDataSource(
        LeaveMsgApi.loadLeaveMsg,
        { currentPags: 1, limits: 10 },
        null,
        () => {
          return {
            isRead: true,
          };
        }
      );
    const showModal = ref(false);
    const leaveMsg = ref();
    const isView = ref(false);
    const editOptions = ref({
      content: "",
      id: "",
      email: "",
      username: "",
    });
    const textarea = ref();
    const confirmLoading = ref(false);

    function handleReply(record: Record<string, any>) {
      editOptions.value.id = record._id;
      editOptions.value.email = record.email;
      editOptions.value.username = record.username;
      showModal.value = true;
      isView.value = false;
    }

    function handleCancel() {
      showModal.value = false;
      textarea.value = "";
    }

    function handleOk() {
      if (isView.value) return (showModal.value = false), (leaveMsg.value = "");
       textarea.value
        .trim()
        .split("\n")
        .map((item) => {
          editOptions.value.content += `<p>${item}</p>`;
        });
      if (
        editOptions.value.content === "" ||
        editOptions.value.content === undefined ||
        editOptions.value.content === null
      )
        return ElMessage.error("留言不能为空");
      confirmLoading.value = true;
      LeaveMsgApi.updateLeaveMsg(editOptions.value.content,editOptions.value.id).then( data => {
        if(data.data.state === 200){
          setTimeout(() => {
            confirmLoading.value = false;
            showModal.value = false;
            ElMessage.success(data.data.msg);
            loadTableData();
          }, 500);
        }else ElMessage.error(data.data.msg);
      }).catch(error => ElMessage.error(error));
    }

    function handleView(content: string) {
      showModal.value = true;
      leaveMsg.value = content;
      isView.value = true;
    }

    function handleEdit(record:Record<string,string>){
      isView.value = false;
      textarea.value = record.content.replace(/(<p>|<\/p>)/g,"");
      editOptions.value.id = record._id;
      showModal.value = true;
    }

    onMounted(() => {
      loadTableData();
    });
    return {
      loading,
      total,
      pagingParam,
      dataSource,
      loadTableData,
      columns,
      handleView,
      handleReply,
      showModal,
      leaveMsg,
      isView,
      handleOk,
      editOptions,
      confirmLoading,
      textarea,
      handleCancel,
      handleEdit
    };
  },
});
</script>

<style scoped lang="less">
</style>