<template>
  <c-scrollbar style="width: 100%; height: calc(100vh - 60px);" direction="y">
    <div class="IndexPage" v-if="banners.length">
      <div class="content">
        <div class="banners">
          <img
            @click="goto(bannerList[current])"
            :src="bannerList[(current + 1) % bannerList.length].avatar"
            class="banner-item-flex"
            :style="`right:0%`"
          />
          <div class="left-action">
            <img
              src="@/static/left.png"
              style="width: 100%; height: 40px; margin-top: 10px"
            />
          </div>
          <div class="right-action">
            <img
              src="@/static/left.png"
              style="
                width: 100%;
                height: 40px;
                margin-top: 10px;
                transform: rotate(180deg);"/>
          </div>
          <div class="radio">
            <li
              class="radio-item"
              v-for="(item, index) in bannerLists"
              :key="index"
              :style="
                current === index ? 'background-color: rgba(0, 0, 0,.7);' : ''
              "
            ></li>
          </div>
          <div class="banner-items">
            <span
              v-for="(item, index) in bannerList"
              :key="index"
              :style="`right:-${index * 100}%`"
            >
              <img :src="item.avatar" class="banner-item" />
              <div class="title">{{ item.title }}</div>
            </span>
          </div>
        </div>
        <ShowArticleList />
      </div>
      <div class="other">
        <div class="bgc">
          <AboutMine />
          <FrontNotice />
          <ArticleClientDetail />
        </div>
      </div>
    </div>
  </c-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogBannersApi from "@/api/Modules/BlogBannersModle";
import { ElMessage } from "element-plus";
import AboutMine from "@/components/AboutMine.vue";
import { randomColorList } from "@/common/Utils";
import FrontNotice from "@/components/FrontNotice.vue";
import ArticleClientDetail from "@/components/ArticleClientDetail.vue";
import ShowArticleList from "./ShowArticleList.vue";
export default defineComponent({
  components: { AboutMine, FrontNotice, ArticleClientDetail, ShowArticleList },
  setup() {
    const current = ref(0);
    const banners = ref([]);
    const bannerList = ref([]);
    const bannerLists = ref([]);
    async function loadBanners() {
      try {
        let d = await BlogBannersApi.getBlogBanners();
        if (d.data.state >= 400) throw new Error(d.data.msg);
        if (d.data.state === 200) {
          banners.value = d.data.data as unknown as any[];
          bannerList.value = JSON.parse(
            JSON.stringify(d.data.data)
          ) as unknown as any[];
          bannerList.value.push(bannerList.value[0]);
          bannerLists.value = d.data.data as unknown as any[];
        }
      } catch (error) {
        ElMessage.error(error);
      }
    }

    function goto(value: Record<string, any>) {
      window.open(value.url);
    }

    onMounted(() => {
      loadBanners();

      setTimeout(() => {
        if (banners.value.length) {
          let T = 4000;
          let banner = document.getElementsByClassName(
            "banners"
          )[0] as HTMLElement;
          let bannerItems = banner.getElementsByClassName(
            "banner-items"
          )[0] as HTMLElement;
          let leftAction = banner.getElementsByClassName(
            "left-action"
          )[0] as HTMLElement;
          let rightAction = banner.getElementsByClassName(
            "right-action"
          )[0] as HTMLElement;
          let left = 0;
          //bannerItems.style.transition = "none";
          //bannerItems.style.transition = "2s all ease";
          let actionl = null;
          let actionr = null;
          async function IleftAction() {
            if(actionl)return;
            else{
              actionl = 1;
              setTimeout(() => {
                actionl = null;
              }, 2000);
            }
            left -= 100;
            bannerItems.style.transition = "2s all ease-in-out";
            bannerItems.style.left = `${left}%`;
            current.value++;
            if(current.value === bannerLists.value.length){
              current.value = 0;
              setTimeout(() => {
                bannerItems.style.transition = "none";
                left = 0;
                bannerItems.style.left = `${left}%`;
              }, 2000);
            }
          }

          async function IrightAction() {
            if(actionr)return;
            else{
              actionr = 1;
              setTimeout(() => {
                actionr = null;
              }, 2000);
            }
            if(current.value === 0){
              current.value = bannerLists.value.length - 1;
              bannerItems.style.transition = "none";
              left = -(bannerLists.value.length) * 100;
              bannerItems.style.left = `${left}%`;
              setTimeout(() => {
                left += 100;
                bannerItems.style.transition = "2s all ease-in-out";
                bannerItems.style.left = `${left}%`;
              }, 0);
            }else{
              current.value--;
              left += 100;
              bannerItems.style.transition = "2s all ease-in-out";
              bannerItems.style.left = `${left}%`;
            }
          }

          leftAction.addEventListener("click", IleftAction);
          rightAction.addEventListener("click", IrightAction);
          let AutoBanner = setInterval(IrightAction, T);
          banner.onmousemove = () => {
            clearInterval(AutoBanner);
            AutoBanner = null;
          };
          banner.onmouseout = () => {
            if(!AutoBanner){
              AutoBanner = setInterval(IrightAction, T);
            }
          };
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
              document.title = "哦 ~ 你在这 _(:зゝ∠)_";
              if(AutoBanner === null){
                AutoBanner = setInterval(IrightAction, T);
              }
            } else {
              document.title = "你去哪了 ?? !! ｜д•´)!!";
              clearInterval(AutoBanner);
              AutoBanner = null;
            }
          });
        }
      }, 800);
    });

    return {
      goto,
      bannerList,
      current,
      bannerLists,
      loadBanners,
      banners,
      randomColorList,
    };
  },
});
</script>

<style lang="less" scoped>
@media (max-width: 1000px) {
  .other {
    display: none;
  }
}

@keyframes trasition1 {
  0% {
    opacity: 0;
    transform: translateY(70px) rotateY(30deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) rotateY(0deg);
  }
}
.Itrasition(@time) {
  opacity: 0;
  animation-delay: @time;
  animation-fill-mode: forwards;
}
.IndexPage {
  width: 70%;
  @media screen and (max-width: 1000px) {
    width: 100vw;
  }
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  color: #000;
  .content {
    transform: translateY(70px) rotateY(30deg);
    animation: trasition1 1000ms ease;
    .Itrasition(0.4s);
    width: 65%;
    @media screen and (max-width: 1000px) {
      width: 100%;
      border-radius: 0px;
      padding-left: 5px;
    }
    // min-width: 500px;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    box-shadow: 2px 2px 10px rgba(202, 202, 202,.8);
    flex-direction: column;
    align-items: center;
    .banners {
      width: 100%;
      &:hover > .radio {
        top: 95%;
      }
      transition: 0.5s all;
      @media screen and (max-width: 1000px) {
        border-radius: 0px;
      }
      border-radius: 10px;
      cursor: pointer;
      .radio {
        box-sizing: border-box;
        transition: 0.5s all;
        position: absolute;
        width: 100%;
        top: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        opacity: 1;
        .radio-item {
          width: 10px;
          height: 10px;
          transition: 0.5s all;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          margin: 0px 10px;
          z-index: 99999;
          &:hover {
            background-color: rgba(255, 255, 255, 0.8);
          }
        }
      }
      .banner-items {
        span {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .title {
          position: absolute;
          line-height: 0px;
          top: 0;
          width: 100%;
          height: 0px;
          overflow: hidden;
          color: rgba(65, 182, 230, 1);
          background-color: rgb(255, 255, 255);
          transition: 0.5s all;
          text-align: center;
        }
        position: absolute;
        left: 0%;
        top: 0%;
        width: 100%;
        height: 100%;
      }
      .banner-item {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0%;
        right: 0%;
      }
      .banner-item-flex {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0%;
        right: 0%;
        z-index: 9999;
        opacity: 0;
        transition: 0.5s all;
      }
      &:hover > .banner-item-flex {
        opacity: 0.2;
      }
      &:hover > .left-action {
        opacity: 1;
        left: 20px;
      }
      &:hover > .banner-items .title {
        height: 50px;
        line-height: 50px;
        background-color: rgba(0, 0, 0, 0.7);
      }
      &:hover > .right-action {
        opacity: 1;
        right: 20px;
        z-index: 99999;
      }
      width: 100%;
      height: 400px;
      @media screen and (max-width: 500px) {
        height: 200px;
      }
      overflow: hidden;
      position: relative;
      .left-action {
        position: absolute;
        line-height: 60px;
        text-align: center;
        left: 0px;
        width: 40px;
        height: 60px;
        top: calc(40%);
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 9999;
        opacity: 0;
      }
      .right-action {
        opacity: 0;
        line-height: 60px;
        text-align: center;
        top: calc(40%);
        right: 0px;
        width: 40px;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.4);
        position: absolute;
        z-index: 9999;
      }
      .left-action,
      .right-action {
        transition: 0.5s all ease;
        cursor: pointer;
        border-radius: 5px;
      }
    }
  }
  .other {
    transform: translateX(380px);
    animation: trasition2 300ms linear;
    transition: 0.5s all ease;
    .Itrasition(0.5s);
    width: 380px;
    height: auto;
    min-width: 380px;
    margin-left: 30px;
    box-sizing: border-box;
    .bgc {
      border-radius: 10px;
      padding-top: 20px;
      width: 90%;
      padding-left: 30px;
      padding-right: 30px;
      padding-bottom: 50px;
      height: 100%;
      //border: 1px solid rgba(235, 235, 235, 0.3);
      // box-shadow: 5px 5px 20px rgba(183, 231, 255, 0.2),
      // -5px -5px 10px rgba(183, 231, 255, 0.2);
      // background: linear-gradient(
      //   125deg,
      //   rgb(255, 255, 255),
      //   rgba(255, 255, 255, 0.9),
      //   rgb(255, 255, 255)
      // );
      background-size: 300%;
      background-position: 0% 50%;
      animation: bgs 15s linear infinite;
    }
  }
}
@keyframes bgs {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes trasition2 {
  from {
    transform: translateX(400px);
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>