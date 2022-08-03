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
        <template #content="{ record }">
          <a-divider type="vertical" />
          <a @click="handleView(record.content)">查看</a>
          <a-divider type="vertical" />
        </template>
        <template #action="{ record }">
          <a-divider type="vertical" />
          <a @click="handleReply(record)">回复</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除这条留言,该操作不可恢复"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record._id, record.email, record.content)"
          >
            <a style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </EleTable>

    <a-modal
      :visible="showModal"
      centered
      :confirm-loading="confirmLoading"
      :title="
        isView === 'view'
          ? '查看留言'
          : isView === 'edit'
          ? '编辑留言'
          : '删除留言'
      "
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div v-if="isView === 'view'">
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
        align: "center"
      },
      {
        title: "邮箱",
        dataIndex: "email",
        width: 100,
        align: "center"
      },
      {
        title: "手机号",
        dataIndex: "phone",
        width: 100,
        align: "center"
      },
      {
        title: "站点",
        dataIndex: "side",
        width: 100,
        align: "center"
      },
      {
        title: "用户头像",
        slots: { customRender: "avatar" },
        //dataIndex: 'avatar',
        width: 100,
        align: "center"
      },
      {
        title: "qq账号",
        dataIndex: "qqnumber",
        width: 100,
        align: "center"
      },
      {
        title: "是否登录留言",
        slots: { customRender: "login" },
        //dataIndex: 'islogin',
        width: 100,
        align: "center"
      },
      {
        title: "留言内容",
        slots: { customRender: "content" },
        //dataIndex: 'content',
        width: 100,
        align: "center"
      },
      {
        title: "是否回复",
        slots: { customRender: "isread" },
        //dataIndex: 'isread',
        width: 100,
        align: "center"
      },
      {
        title: "留言日期",
        dataIndex: "create_at",
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

    const { loadTableData, loading, total, pagingParam, dataSource } =
      useCommonDataSource(
        LeaveMsgApi.loadLeaveMsg,
        { currentPags: 1, limits: 10 },
        null,
        () => {
          return {
            isRead: false,
          };
        }
      );

    const showModal = ref(false);
    const leaveMsg = ref();
    const isView = ref("view");
    const editOptions = ref({
      content: "",
      id: "",
      email: "",
      username: "",
      usercontent: "",
      admission: 1
    });
    const textarea = ref();
    const confirmLoading = ref(false);

    function handleDelete(id: string, email: string, content: string) {
      showModal.value = true;
      isView.value = "delete";
      editOptions.value.id = id;
      editOptions.value.email = email;
      editOptions.value.usercontent = content;
      // LeaveMsgApi.deleteLeaveMsg(id,email,content).then( data => {
      //   if(data.data.state === 200){
      //     ElMessage.success(data.data.msg);
      //     loadTableData();
      //   }else if(data.data.state === 201){
      //     ElMessage.info(data.data.msg);
      //     loadTableData();
      //   }else ElMessage.error(data.data.msg);
      // }).catch( error => {
      //   ElMessage.error(error);
      // });
    }

    function handleReply(record: Record<string, any>) {
      editOptions.value.id = record._id;
      editOptions.value.email = record.email;
      editOptions.value.username = record.username;
      editOptions.value.usercontent = record.content;
      showModal.value = true;
      isView.value = "edit";
    }

    function handleCancel() {
      showModal.value = false;
      textarea.value = "";
    }

    function handleOk() {
      if (textarea.value === "") return;
      if(store.state.UserStatus && store.state.UserStatus.admission === 0){
        ElMessage.error("你没有权限");
        return;
      }
      if(!store.state.UserStatus){
        ElMessage.error("你没有权限");
        return;
      }
      if (isView.value === "view")
        return (showModal.value = false), (leaveMsg.value = "");
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
      if (isView.value === "edit") {
        let data = {
          avatar: store.getters.getUserImgurl,
          user: store.getters.getUserName,
          pid: editOptions.value.id,
          content: editOptions.value.content,
          usercontent: editOptions.value.usercontent,
          email: editOptions.value.email,
          username: editOptions.value.username,
          admission: editOptions.value.admission
        };
        LeaveMsgApi.putLeaveMsgReply(JSON.stringify(data))
          .then((data) => {
            setTimeout(() => {
              textarea.value = "";
              if (data.data.state === 200) {
                editOptions.value.content = "";
                ElMessage.success(data.data.msg);
                loadTableData();
              } else ElMessage.error(data.data.msg);
              confirmLoading.value = false;
              showModal.value = false;
            }, 600);
          })
          .catch((error) => {
            ElMessage.error(error);
            confirmLoading.value = false;
            showModal.value = false;
          });
      } else {
        LeaveMsgApi.deleteLeaveMsg(
          editOptions.value.id,
          editOptions.value.email,
          editOptions.value.usercontent,
          editOptions.value.content
        )
          .then((data) => {
            textarea.value = "";
            setTimeout(() => {
              if (data.data.state === 200) {
                editOptions.value.content = "";
                ElMessage.success(data.data.msg);
                loadTableData();
              } else ElMessage.error(data.data.msg);
              confirmLoading.value = false;
              showModal.value = false;
            }, 600);
          })
          .catch((error) => {
            ElMessage.error(error);
            confirmLoading.value = false;
            showModal.value = false;
            textarea.value = "";
          });
      }
    }

    function handleView(content: string) {
      showModal.value = true;
      leaveMsg.value = content;
      isView.value = "view";
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
      handleDelete,
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
    };
  },
});
</script>

<style scoped lang="less">
</style>