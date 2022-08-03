<template>
  <div class="Editor">
    <el-form
      style="width: 100%"
      label-width="120px"
      :inline="true"
      :rules="Fromrules"
      label-position="top"
      :model="BlogEditor"
    >
      <el-form-item label="文章标题" prop="title" style="width: 40%">
        <el-input
          style="width: 100%"
          v-model="BlogEditor.title"
          placeholder="必须输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章标签" prop="label" style="width: 18%">
        <el-select
          style="width: 100%"
          multiple
          :multiple-limit="5"
          v-model="BlogEditor.label"
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
      </el-form-item>
      <el-form-item label="文章分类" prop="categorie" style="width: 18%">
        <el-select
          style="width: 100%"
          v-model="BlogEditor.categorie"
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
      </el-form-item>
      <el-form-item label="作者署名" prop="author" style="width: 18%">
        <el-input
          style="width: 100%"
          v-model="BlogEditor.signature"
          placeholder="默认为用户名"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-form :rules="Fromrules" label-position="top" :model="BlogEditor" style="width: 90%">
      <el-form-item label="文章描述" prop="describe" >
        <el-input
          resize="none"
          v-model="BlogEditor.describe"
          :rows="2"
          type="textarea"
          placeholder="必须输入描述"
        />
      </el-form-item>
    </el-form>

    <el-form>
      <el-form-item label="文章封面" prop="picture" style="width: 40%">
        <el-input
          style="width: 100%"
          v-model="BlogEditor.picture"
          placeholder="图片路径"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-form label-position="top">
      <el-form-item label="博客内容" prop="content">
        <TinymceEditor ref="editorRef" v-model="value" />
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="primary" :loading="loading" @click="HandleSaveEdit">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import TinymceEditor from "@/components/TinymceEditor.vue";
import BlogArticleApi, { Article } from "@/api/Modules/BlogArticleModule";
import { ElMessage } from "element-plus";
import store from "@/store";
export default defineComponent({
  components: {
    TinymceEditor,
  },
  setup() {
    const Fromrules = {
      title: [
        { required: true, message: "请输入文章标题", trigger: "blur" },
        {
          min: 1,
          max: 50,
          message: "文章标题必须小于50个字符",
          trigger: "blur",
        },
      ],
      describe: [
        { required: true, message: "请输入文章描述", trigger: "blur" },
        {
          min: 1,
          max: 200,
          message: "文章描述必须小于200个字符",
          trigger: "blur",
        },
      ],
    };

    const editorRef = ref(null);
    const value = ref("");
    const loading = ref(false);
    const BlogEditor = ref({
      content: "",
      title: "",
      label: "",
      author: "",
      signature: "",
      categorie: "",
      describe: "",
      picture: "",
    });
    const SelectOptions = ref();
    const SelectLabelOptions = ref();

    function HandleSaveEdit() {
      BlogEditor.value.content = value.value;
      if (
        BlogEditor.value.describe === "" ||
        BlogEditor.value.title === "" ||
        BlogEditor.value.content === ""
      ) {
        ElMessage({
          message: "您还有未输入的字段",
          type: "error",
        });
        return;
      }
      loading.value = true;
      let data: Article = {
        content: BlogEditor.value.content,
        title: BlogEditor.value.title,
        label: BlogEditor.value.label === "" ? "" : BlogEditor.value.label,
        author: store.getters.getUserName,
        signature:
          BlogEditor.value.author === ""
            ? store.getters.getUserName
            : BlogEditor.value.signature,
        categorie:
          BlogEditor.value.categorie === ""
            ? "默认分类"
            : BlogEditor.value.categorie,
        describe: BlogEditor.value.describe,
        picture: BlogEditor.value.picture,
      };
      BlogArticleApi.addBlogArticle(data).then((data) => {
        if (data.data.state === 200) {
          setTimeout(() => {
            loading.value = false;
            ElMessage({
              message: "发布成功",
              type: "success",
            });
            for (let o in BlogEditor.value) {
              BlogEditor.value[o] = "";
            }
            value.value = "";
          }, 800);
        } else {
          loading.value = false;
          ElMessage({
            message: data.data.msg,
            type: "error",
          });
        }
      });
    }

    onBeforeUnmount(() => {
      /**
       * 切换路由将创建文章信息保存起来
       */
      let data = {};
      BlogEditor.value.content = value.value;
      for (let k in BlogEditor.value) {
        data[k] = BlogEditor.value[k];
      }
      sessionStorage.setItem("TinymcData", JSON.stringify(data));
    });

    onMounted(() => {
      //加载分类列表
      BlogArticleApi.loadSelectOptions().then((data) => {
        SelectOptions.value = data.data.data;
      });
      BlogArticleApi.loadLabelOptions().then((data) => {
        SelectLabelOptions.value = data.data.data;
      });

      let data = sessionStorage.getItem("TinymcData") as any;
      if (data !== null) {
        data = JSON.parse(data);
        for (let k in data) {
          BlogEditor.value[k] = data[k];
        }
        value.value = data.content;
      }
    });

    return {
      editorRef,
      value,
      HandleSaveEdit,
      BlogEditor,
      Fromrules,
      SelectOptions,
      SelectLabelOptions,
      loading,
    };
  },
});
</script>

<style scoped lang="less">
.btn{
  position: absolute;
  right: 70px;
  bottom:46px;
}
</style>