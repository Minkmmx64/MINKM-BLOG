<template>
  <div>
    <el-row>
      <el-button type="primary" size="small" @click="handleEdit('Add')"
        >+新增分类</el-button
      >
    </el-row>
    <EleTable @load="loadTableData">
      <el-table
        v-loading="loading"
        class="categorie"
        :data="dataSource"
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" label="序号" width="200" />
        <el-table-column prop="categorie" label="分类名称" width="300" />
        <el-table-column prop="create_at" label="创建时间" width="300" />
        <el-table-column prop="update_at" label="修改时间" width="300" />
        <el-table-column label="操作">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit('Edit', scope.row.categorie)"
                >编辑</el-button
              >
              <el-popconfirm
                confirm-button-text="是的"
                cancel-button-text="不"
                :icon="InfoFilled"
                icon-color="red"
                @confirm="hanleDelete(scope.row.categorie)"
                title="是否删除这条分类?"
              >
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </EleTable>

    <el-dialog v-model="dialogVisible" :title="EditTitle" width="50%">
      <el-form label-width="120px" :rules="Fromrules" :model="EditFrom">
        <el-form-item label="分类名称" prop="EditorCategorie">
          <el-input v-model="EditFrom.EditorCategorie"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="HandleSaveEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import { Star } from "@element-plus/icons-vue";
import BlogCategotiesApi from "@/api/Modules/BlogCategotiesModule";
import { ElMessage } from "element-plus";
import { useCommonDataSource } from "@/composable/useCommonDataSource";
import { RemoveSpaces } from "@/common/common";
export default defineComponent({
  components: {},
  setup() {
    const Fromrules = {
      EditorCategorie: [
        { required: true, message: "请输入博客分类", trigger: "blur" },
        {
          min: 1,
          max: 20,
          message: "博客分类必须小于20个字符",
          trigger: "blur",
        },
      ],
    };

    const EditFrom = ref({
      EditorCategorie: "",
    });
    const backEditorCategorie = ref(); //编辑前的分类名称
    const EditTitle = ref<string>();
    const dialogVisible = ref(false);

    function handleEdit(operation: string, categorie: string = "") {
      EditFrom.value.EditorCategorie = "";
      dialogVisible.value = true;
      if (operation === "Add") {
        EditTitle.value = "添加分类";
      } else {
        EditFrom.value.EditorCategorie = categorie;
        backEditorCategorie.value = categorie;
        EditTitle.value = "编辑分类";
      }
    }

    function hanleDelete(categorie: string) {
      BlogCategotiesApi.deleteBlogCategoties(categorie).then((data) => {
        if (data.data.state === 200) {
          ElMessage({
            message: "删除",
            type: "success",
          });
          loadTableData();
        }
      });
    }

    function HandleSaveEdit() {
      //去除多余空格
      let query = RemoveSpaces(EditFrom.value.EditorCategorie);
      if (query === "" || query === undefined || query === null) return;
      if (EditTitle.value === "编辑分类") {
        BlogCategotiesApi.updateBlogCategoties(
          query,
          backEditorCategorie.value
        ).then((data) => {
          if (data.data.state === 200) {
            ElMessage({
              message: "编辑成功",
              type: "success",
            });
            loadTableData();
          }
        });
      } else {
        BlogCategotiesApi.addBlogCategoties(query).then((data) => {
          if (data.data.state === 200) {
            ElMessage({
              message: "添加成功",
              type: "success",
            });
            loadTableData();
          }
        });
      }
      dialogVisible.value = false;
    }

    //请求数据
    const { loadTableData, dataSource, loading } = useCommonDataSource(
      BlogCategotiesApi.getBlogCategoties,
      null,
      null
    );

    onMounted(() => {
      loadTableData();
    });

    return {
      Star,
      dataSource,
      handleEdit,
      EditFrom,
      hanleDelete,
      InfoFilled,
      HandleSaveEdit,
      dialogVisible,
      EditTitle,
      Fromrules,
      loadTableData,
      loading,
    };
  },
});
</script>

<style scoped lang="less">
.categorie {
  padding-bottom: 30px;
}
</style>