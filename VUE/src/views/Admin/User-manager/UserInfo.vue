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
      >
        <template #imgUrl="{ record }">
          <el-image
            style="width: 45px; height: 45px"
            :src="record.imgUrl"
          ></el-image>
        </template>
        <template #sex="{ record }">
          <a-badge :status="record.sex ? 'success' : 'processing'" />{{
            record.sex ? "男" : "女"
          }}
        </template>
        <template #admission="{ record }">
          <a-badge :status="record.admission ? 'success' : 'processing'" />{{
            record.admission ? "是" : "否"
          }}
        </template>
        <template #action="{ record }">
          <a @click="handleAction(record)">操作</a>
        </template>
      </a-table>
    </EleTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import UserInfoApi from "@/api/Modules/UserInfoModule";
export default defineComponent({
  components: {},
  setup() {
    const columns = [
      {
        title: "用户名",
        dataIndex: "username",
        align: "center"
      },
      {
        title: "昵称",
        dataIndex: "nickname",
        align: "center"
      },
      {
        title: "性别",
        slots: { customRender: "sex" },
        align: "center",
        dataIndex: "sex",
      },
      {
        title: "头像",
        slots: { customRender: "imgUrl" },
        align: "center",
        dataIndex: "username",
      },
      {
        title: "电话号码",
        dataIndex: "userphone",
        align: "center"
      },
      {
        title: "注册日期",
        dataIndex: "create_time",
        align: "center"
      },
      {
        title: "管理员",
        slots: { customRender: "admission" },
        align: "center"
      },
      {
        title: "上次登录",
        dataIndex: "update_time",
        align: "center"
      },
      {
        title: "操作",
        slots: { customRender: "action" },
        align: "center"
      },
    ];

    const current = ref(1);
    const limit = ref(10);
    const total = ref();
    const dataSource = ref();
    const loading = ref(false);

    function handleAction(record: Record<string, any>) {}
    //请求数据
    function loadTableData() {
      loading.value = true;
      UserInfoApi.userInfo(limit.value, current.value)
        .then((data) => {
          setTimeout(() => {
            dataSource.value = data.data.data;
            total.value = data.data.meta.count;
            loading.value = false;
          }, 500);
        })
        .catch((error) => {
          /** */
        });
    }

    onMounted(() => {
      loadTableData();
    });

    return {
      columns,
      current,
      limit,
      total,
      dataSource,
      loading,
      loadTableData,
      handleAction,
    };
  },
});
</script>

<style scoped lang="less">
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>