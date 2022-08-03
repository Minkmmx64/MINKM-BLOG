<template>
  <div class="List" ref="main">
    <li
      class="Item"
      v-for="(item, index) in Resource"
      :key="index"
      @click="goto(item.article_id)"
    >
      <div class="timepos">
        <img :src="item.picture" />
        <span class="create">
          {{ item.create_at.split(" ")[0] }}
        </span>
      </div>
      <div class="title">
        <div class="a">
          {{ item.title }}
        </div>
        <div class="b">{{ item.describe }}</div>
        <div class="c">
          <img src="@/static/bq.png" />
          <span>{{ item.label.toString() }}</span>
        </div>
        <div class="d">
          <img src="@/static/fl.png" />
          <span>{{ item.categorie }}</span>
        </div>
      </div>
      <div class="detail">
        <div>
          <div class="up">{{ item.update_at.split(" ")[0] }}</div>
        </div>
        <div class="group">
          <div class="images">
            <img src="@/static/collection.png" />
            <span>{{ item.items[0].collections }}</span>
          </div>
          <div class="images">
            <img src="@/static/comment.png" />
            <span>{{ item.items[0].comment }}</span>
          </div>
          <div class="images">
            <img src="@/static/visited.png" />
            <span>{{ item.items[0].browse }}</span>
          </div>
        </div>
      </div>
    </li>
    <div class="load" @click="loadnext">{{ txt }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
import BlogFrontArticleApi from "@/api/Modules/BlogFrontArticle";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    model: {
      type: Number,
      default: 0,
    },
  },

  setup(props) {
    const query = ref(0);
    const { model } = toRefs(props);
    const fromSearch = ref({
      search: "",
    });
    const router = useRouter();
    const Resource = ref([]);
    const main = ref(null);
    const step = ref(0);
    const txt = ref("加载更多");
    function load() {
      BlogFrontArticleApi.HomeBlogArticle(
        6,
        step.value,
        query.value,
        JSON.stringify(fromSearch.value)
      )
        .then((document) => {
          if (document.data.state === 200) {
            if (document.data.data.length === 0) {
              txt.value = "没有数据了";
            } else {
              for (let i = 0; i < document.data.data.length; i++) {
                Resource.value.push(document.data.data[i]);
              }
            }
          } else ElMessage.error(document.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    function loadnext() {
      step.value++;
      load();
    }

    function goto(id: string) {
      router.push({
        name: "blogArticle",
        params: { id },
      });
    }

    watch(
      () => model.value,
      (n, o) => {
        query.value = n;
        load();
      }
    );

    onMounted(() => {
      query.value = model.value;
      load();
    });

    return {
      query,
      load,
      loadnext,
      Resource,
      main,
      txt,
      goto,
    };
  },
});
</script>

<style scoped lang="less">
@keyframes trasi {
  0% {
    transform: translateY(300px);
    opacity: 0.1;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
.List {
  margin-top: 20px;
  width: 100%;
  opacity: 0.1;
  transform: translateY(300px);
  animation: trasi 900ms ease-in-out;
  animation-fill-mode: forwards;
  padding-bottom: 40px;
  .Item {
    opacity: 1;
    border-radius: 5px;
    overflow: hidden;
    .timepos {
      width: 150px;
      position: relative;
      overflow: hidden;
      .create {
        position: absolute;
        left: -100px;
        width: 100px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        color: #fff;
        border-radius: 15px;
        top: 0px;
        background-color: rgba(253, 95, 0, 1);
        transition: 300ms all ease;
      }
    }
    &:hover > .timepos .create {
      left: 0px;
    }
    .up{
      position: absolute;
      bottom: 40px;
      right: -120px;
      height: 25px;
      width: 100px;
      background-color: rgb(46, 45, 45);
      line-height: 25px;
      color: #fff;
      text-align: center;
      transition: 300ms all ease;
      border-radius: 20px;
    }
    &:hover > .detail .up {
      right: 20px;
    }
    position: relative;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    height: 150px;
    border: 2px dashed rgba(235, 237, 236, 1);
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: 500ms all ease;
    img {
      width: 150px;
      height: 120px;
      border-radius: 10px;
    }
    .title {
      margin-left: 20px;
      width: calc(100% - 200px);
      .a {
        white-space: nowrap;
        /* 2.超出部分隐藏 */
        overflow: hidden;
        /* 3.文字用省略号替代超出的部分 */
        text-overflow: ellipsis;
        text-align: center;
        color: rgba(255, 114, 96, 1);
        font-size: 1rem;
      }
      .b {
        white-space: nowrap;
        /* 2.超出部分隐藏 */
        overflow: hidden;
        width: 50%;
        /* 3.文字用省略号替代超出的部分 */
        text-overflow: ellipsis;
        color: rgba(30, 192, 255, 1);
        font-size: 0.9rem;
      }
      .c,
      .d {
        display: flex;
        flex-direction: row;
        margin-top: 5px;
        span {
          margin-left: 5px;
          color: rgba(251, 102, 72, 1);
        }
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .detail {
      position: absolute;
      right: 10px;
      bottom: 0px;
      img {
        width: 20px;
        height: 20px;
      }
      .images {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 2px auto;
        span {
          margin-left: 5px;
          text-align: center;
          color: rgba(133, 133, 133, 0.6);
        }
      }
      .group {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 150px;
      }
    }
  }
  .load {
    width: 100%;
    text-align: center;
    width: 100px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    background-color: rgba(253, 95, 0, 0.5);
    border-radius: 5px;
    margin-top: 30px;
    color: #fff;
    cursor: pointer;
  }
}
</style>