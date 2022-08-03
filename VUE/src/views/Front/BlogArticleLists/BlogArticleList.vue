<template>
  <div class="m-bg-leave">
    <!-- <LeaveBackGround
      mtitle="文章列表"
      :repeat="true"
      bgImg="https://img1.baidu.com/it/u=1886116575,152184717&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
    /> -->
    <div class="box">
      <LabelOrCateTag :tagList="categorie" @TagClick="TagSearchLoad" />
      <div class="mainSearch">
        <div class="search">
          <div class="icon" @click="loadTableData">
            <SearchOutlined />
          </div>
          <input type="text" v-model="searchValue" placeholder="" />
        </div>
      </div>
      <c-scrollbar
        style="width: 100%; height: calc(90vh - 70px);"
        v-if="total"
      >
        <div class="article" v-if="tableData">
          <li
            class="ele"
            v-for="(item, index) in tableData"
            :key="index"
            @click="goToArticle(item.article_id)"
          >
            <div class="hover">{{ item.create_at }}</div>
            <el-image
              class="article-el-img"
              style="width: 100%; height: 150px"
              :src="item.picture"
            >
              <template #error>
                <el-image
                  class="article-el-img"
                  style="width: 100%; height: 150px; opacity: 0.7"
                  src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                />
              </template>
            </el-image>
            <div class="text">
              <li class="title">
                <span style="font-size: 20px"></span>{{ item.title }}
              </li>
              <li class="label">标签:{{ item.label.toString() }}</li>
              <li class="categorie">分类:{{ item.categorie }}</li>
              <!--<li class="create_at">创建时间:<span style="color:red">{{item.create_at}}</span></li>
                        <li class="update_at">修改时间<span style="color:red">{{item.update_at}}</span></li>-->
            </div>
          </li>
          <MyPagination
            :total="total"
            :pageSize="8"
            @pagesReduce="loadTableData"
            @pagesAdd="loadTableData"
          />
        </div>
        <div class="article" v-else></div>
      </c-scrollbar>
      <div v-else class="null">暂无文章</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import LabelOrCateTag from "@/components/LabelOrCateTag.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import BlogFrontArticleApi from "@/api/Modules/BlogFrontArticle";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import MyPagination from "@/views/Front/BlogArticleLists/components/MyPagination.vue";
export default defineComponent({
  components: {
    MyPagination,
    SearchOutlined,
    LabelOrCateTag,
  },
  setup() {
    const limit = ref(8); //每页大小
    const total = ref(0); //总数
    const tableData = ref();
    const fromSearch = ref({
      //搜索
      categorie: "",
    });
    const categorie = ref();
    const router = useRouter();
    const searchValue = ref("");

    function loadTableData(e) {
      tableData.value = null;
      if (typeof e !== "number") e = 1;
      BlogFrontArticleApi.blogArticle(
        limit.value,
        e,
        JSON.stringify({
          selectSearch: fromSearch.value,
          inputSearch: searchValue.value,
        })
      )
        .then((res) => {
          setTimeout(() => {
            if (res.data.data.length === 0) {
              ElMessage.error("没有文章");
              searchValue.value = "";
              loadTableData(1);
            } else {
              total.value = res.data.meta.count;
              tableData.value = res.data.data;
            }
          }, 800);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    async function loadOptions() {
      let data = await BlogFrontArticleApi.clientLabelandCategories();
      let { label, categories } = data.data.data as unknown as {
        label: [];
        categories: [];
      };
      categorie.value = label.concat(categories);
    }

    function TagSearchLoad(e: Record<string, string> & string) {
      fromSearch.value.categorie = e;
      loadTableData(1);
      fromSearch.value.categorie = "";
    }

    function goToArticle(id: string) {
      router.push({
        name: "blogArticle",
        params: { id },
      });
    }

    onMounted(() => {
      loadTableData(1); //默认第一页
      loadOptions();
    });

    return {
      total,
      tableData,
      searchValue,
      loadTableData,
      goToArticle,
      TagSearchLoad,
      categorie,
      loadOptions,
    };
  },
});
</script>

<style scoped lang="less">
.box {
  .search {
    position: relative;
    .icon {
      width: 20px;
      height: 20px;
      left: 10px;
      cursor: pointer;
      position: absolute;
    }
    caret-color: rgba(255, 255, 255, 0.1);
    width: 40px;
    height: 40px;
    background: rgba(173, 173, 173,0.5);
    margin: 0 auto;
    border-radius: 50%;
    transition: 0.6s all ease;
    line-height: 40px;
    text-align: center;
    &:hover {
      width: 20%;
      @media screen and (max-width: 1000px) {
        width: 60%;
      }
      border-radius: 50px;
    }
    &:hover > input {
      color: rgba(255, 255, 255, 1);
    }
    input {
      transition: 0.6s all ease;
      color: rgba(255, 255, 255, 0);
      outline: none;
      width: 60%;
      height: 30px;
      border: none;
      background-color: transparent;
      box-sizing: border-box;
    }
  }
  position: relative;
  .null {
    width: 100%;
    height: 200px;
    text-align: center;
    margin: 0 auto;
  }
  width: 100%;
  background-color: transparent;
  .article {
    @media screen and (max-width: 1000px) {
      width: 100%;
      padding-top: 5px;
    }
    width: 60%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    @media screen and (max-width: 560px) {
      justify-content:space-between;
    }
    padding-top: 40px;
    border-radius: 5px;
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 1);
    .ele {
      &:hover {
        cursor: pointer;
        opacity: 1;
        box-shadow: 0 40px 50px 0 rgba(0, 0, 0, 0.3),
          0 20px 15px 0 rgb(255, 255, 255);
        transform: scale(1.04);
      }
      &:hover > .hover {
        left: 0px;
      }
      margin: 40px;
      margin-top: 0px;
      width: 200px;
      @media screen and (max-width: 560px) {
        width: 45%;
        margin: 20px 2%;
      }
      height: 250px;
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      .hover {
        z-index: 999;
        background-color: rgba(222, 67, 7, 1);
        position: absolute;
        left: -100px;
        width: 100px;
        transition: 300ms all ease;
        height: 20px;
        text-align: center;
        line-height: 20px;
        color: rgb(255, 255, 255);
        border-radius: 20px;
      }
      opacity: 1;
      transition: 300ms all ease;
      background-color: #fff;
      box-shadow: 0 1px 5px 0 rgb(97, 97, 97), 0 2px 1px 0 rgb(255, 255, 255);
      .text {
        height: 100px;
        padding-left: 20px;
        padding-right: 20px;
        width: 100%;
        color: #000;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        .title,
        .label,
        .categorie,
        .update_at,
        .create_at {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          word-wrap: break-word;
          width: 100%;
        }
      }
    }
  }
}
.article-el-img {
  transition: 0.3s all ease;
  overflow: hidden;
  &:hover {
    opacity: 0.5;
    filter: blur(1px);
    transform: rotate(2deg) scale(1.1);
  }
}
.mainSearch{
  width: 100%;
  height: 40px;
  @media screen and (max-width: 1000px) {
    background-color: #fff;
    margin-bottom: 0px;
  }
  margin-bottom: 40px;
}
</style>