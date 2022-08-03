<template>
  <div
    class="BlogMain">
    <GlobalLoading v-if="isStep" ref="GlobalLoadings" />
    <div class="BlogTitle" id="BlogTitle">
      <div class="logo" @click="logo">
        <img src="@/static/logo.png" alt="" srcset="" />
      </div>
      <div
        class="item"
        @click="goTo(index)"
        v-for="(item, index) in titleList"
        :key="index"
        ref="item">
        {{ item }}
        <div class="line"></div>
      </div>
    </div>
    <div class="mobile-left-action">
      <img v-if="leftAction" src="@/static/list.png" @click="leftAction = !leftAction" alt="">
      <img v-else src="@/static/list-ac.png" @click="leftAction = !leftAction" alt="">
    </div>
    <div class="mobile-left-dialog" :style="`${leftAction ? 'width:50%;opacity: 0;left: -50%;' : 'width:50%;opacity: 1;left: 0%;'}`">
      <div class="logo" @click="logo">
        <img src="@/static/logo.png" alt="" srcset="" />
      </div>
      <div
        class="mobile-left-item"
        @click="goTo(index)"
        v-for="(item, index) in titleList"
        :key="index">
        {{ item }}
        <div class="line"></div>
      </div>
    </div>
    <div class="mobile-right-dialog" @click="leftAction = true" :style="`${leftAction ? 'opacity:0;width:0%;' : 'opacity:1;width:50%;'}`"></div>

    <a-carousel class="BlogCxt" ref="Swiper" effect="fade" :dots="false">
      <!--effect="fade"-->
      <div class="item1">
        <BlogHomePage/>
      </div>
      <div class="item2">
        <ArticleList />
      </div>
      <div class="item3">
        <BlogWebShare />
      </div>
      <div class="item4">
        <BlogLeaveMsg />
      </div>
      <div class="item5">
        <BlogFile/>
      </div>
      <div class="item6">
        <SortAlgorithmDemo  />
      </div>
      <div class="item7">
        <BlogFriendChain />
      </div>
    </a-carousel>
  </div>
</template>

<script lang="ts">
import BlogLeaveMsg from "@/views/Front/BlogLeaveMsg/BlogLeaveMsg.vue";
import BlogHomePage from "@/views/Front/BlogHomePages/BlogHomePage.vue";
import BlogWebShare from "@/views/Front/BlogWebShares/BlogWebShare.vue";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import ArticleList from "@/views/Front/BlogArticleLists/BlogArticleList.vue";
import SortAlgorithmDemo from "@/views/Front/BlogCanvasAnim/SortAlgorithmDemo.vue";
import BlogFile from "@/views/Front/BlogFile/BlogFile.vue";
import GlobalLoading from "@/components/GlobalLoading.vue";
import BlogFriendChain from "../BlogFriendChain/BlogFriendChain.vue";
export default defineComponent({
  components: {
    ArticleList,
    SortAlgorithmDemo,
    BlogWebShare,
    BlogHomePage,
    BlogFile,
    BlogLeaveMsg,
    GlobalLoading,
    BlogFriendChain,
  },
  setup() {
    const GlobalLoadings = ref(null);
    const Swiper = ref(null);
    const leftAction = ref(true);
    const titleList = [
      "首页",
      "文章列表",
      "网站分享",
      "留言板",
      "归档",
      "(待完善)",
      "友链"
    ];
    const isStep = ref(false);

    function goTo(param: number) {
      isStep.value = true;
      leftAction.value = true;
      setTimeout(() => {
        if (GlobalLoadings.value) {
          (GlobalLoadings.value.$el as HTMLElement).style.opacity = "0";
          Swiper.value.goTo(param);
          setTimeout(() => {
            isStep.value = false;
          }, 100);
        }
      }, Math.random() * 1500);
    }

    function logo() {
      window.location.reload();
    }

    nextTick(() => {
      let item = document.getElementsByClassName(
        "item"
      ) as unknown as HTMLElement[];
      let line = document.getElementsByClassName(
        "line"
      ) as unknown as HTMLElement[];
      let f = 0;
      line[0].style.width = "100%";
      for (let i = 0; i < item.length; i++) {
        item[i].addEventListener("mouseout", () => {
          if (f !== i) line[i].style.width = "0%";
        });
        item[i].addEventListener("mousemove", () => {
          line[i].style.width = "100%";
        });
        item[i].addEventListener("click", () => {
          for (let j = 0; j < item.length; j++) {
            line[j].style.width = "0%";
          }
          line[i].style.width = "100%";
          f = i;
        });
      }
    });

    onMounted(() => {});

    return {
      goTo,
      Swiper,
      titleList,
      isStep,
      GlobalLoadings,
      logo,
      leftAction
    };
  },
});
</script>

<style scoped lang="less">
@keyframes trasition {
  from {
    opacity: 0;
    transform: translateY(-70px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
.BlogMain {
  //background: radial-gradient(rgb(192, 192, 192),rgb(219, 219, 219));
  background-color: rgb(245, 245, 245);
  background: url('http://cdn.minkm.top/base/16515617240501l6H0o6e5l1l4r5W2o0d175AMQNEJNINF.webp');
  background-size: 100% 100%;
  position: relative;
  width: 100%;
  // min-width: 980px;
  height: 100vh;
  overflow: hidden;
  z-index: 100;
  box-sizing: border-box;
  transition: 500ms all ease;
  .BlogTitle {
    opacity: 0;
    @media screen and (max-width: 1000px) {
      display: none;
    }
    transform: translateY(-70px);
    animation: trasition 400ms linear;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: row;
    position: fixed;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: rgba(248, 248, 248, 0.6);
    text-align: center;
    border-bottom: 1px solid #ccc;
    z-index: 100;
    .item {
      height: 42px;
      width: 100px;
      color: rgb(0, 0, 0);
      //background-color: rgba(0, 0, 0, 1);
      transition: 1s all;
      position: relative;
      cursor: pointer;
      line-height: calc(42px);
      margin-left: 5px;
      border-radius: 5px;
      .line {
        width: 0%;
        position: absolute;
        margin: 0 auto;
        margin-top: 5px;
        background-color: rgba(163, 218, 255, 1);
        height: 2px;
        transition: 1s all;
      }
      &:hover {
        background-color: rgb(214, 214, 214);
        color: #000;
      }
    }
  }
  .BlogCxt {
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    opacity: 1;
    .item1,
    .item2,
    .item3,
    .item4,
    .item5,
    .item6,
    .item7 {
      color: rgb(0, 0, 0);
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0);
      box-sizing: border-box;
      padding-top: 60px;
    }
  }
}
.logo {
  color: #000;
  width: 100px;
  height: 60px;
  line-height: 60px;
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  &::before{
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    width: 20px;
    height: 20px;
    border: none;
    border-style: solid;
    border-color: transparent;
    border-left-color: rgba(187,222,214,1);
    border-top-color: rgba(30,227,207,1);
    border-width: 1px;
    animation: border 2000ms ease infinite;
   
  }
  &::after{
    content: "";
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 20px;
    height:20px;
    border: none;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: rgba(245,78,162,1);
    border-right-color: rgba(254,95,85,1);
    border-width: 1px;
    animation: border 2000ms ease infinite;
  }
}

.mobile-left-dialog{
  .logo{
    margin: 0 auto;
    margin-bottom: 30px;
    margin-top: 10px;
  }
  .mobile-left-item{
    // border-bottom: 1px solid rgba(217,217,243,1);
    box-shadow: 1px 1px 0px rgba(217,217,243,1),
    1px 1px 0px rgba(217,217,243,1),
    1px 1px 0px rgba(217,217,243,1),
    1px 1px 10px rgba(217,217,243,1);
    width: 80%;
    margin: 0 auto;
    height: 40px;
    background-color: rgba(185,237,248,.1);
    text-align: center;
    color: rgba(242,49,127,1);
    line-height: 40px;
    margin-top: 20px;
    border-radius: 10px;
  }
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
  position: fixed;
  height: 100%;
  left: -50%;
  background-color: #fff;
  z-index: 9999;
  transition: 500ms all ease-in-out;
}
.mobile-left-action{
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
    transform: translateY(-70px);
    animation: trasition 400ms linear;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
  }
  transition: 500ms all ease-in-out;
  z-index: 9999;
  width: 100%;
  height: 60px;
  position: absolute;
  background-color: #fff;
  img{
    margin-top: 15px;
    margin-left: 10px;
    width: 30px;
    line-height: 30px;
  }
}
.mobile-right-dialog{
  @media screen and (max-width: 1000px) {
    display: block;
  }
  position: fixed;
  right: 0px;
  height: 100%;
  background-color: rgba(0, 0, 0,.5);
  display: none;
  transition-property: all;
  transition-duration: 500ms;
  transition-timing-function: ease-in-out;
  z-index:9999;
}

</style>