<template>
  <div class="WelCome">
    <div class="details">
      <div
        class="list"
        @click="router.push({ name: 'ArticleCreated' })"
        :style="`background-color: rgba(217,217,243,1);`">
          <img src="@/static/write.png" alt="" />
        <div class="txt">写博客({{ resource.article }})</div>
      </div>
      <div
        class="list"
        @click="router.push({ name: 'ArticleCategories' })"
        :style="`background-color: rgba(255,182,185,1);`">
          <img src="@/static/category.png" alt="" />
        <div class="txt">博客分类({{ resource.category }})</div>
      </div>
      <div
        class="list"
        @click="router.push({ name: 'ArticleLabel' })"
        :style="`background-color: rgba(221,119,119,1);`">
          <img src="@/static/label.png" alt="" />
        <div class="txt">博客标签({{ resource.article }})</div>
      </div>
      <div class="list" :style="`background-color: rgba(255,95,95,1);`">
        <img src="@/static/leavemsg.png" alt="" />
        <div class="txt">留言数量({{ resource.leavemsg }})</div>
      </div>
      <div class="list" :style="`background-color: rgba(121,190,219,1);`">
        <img
          src="@/static/system.png"
          style="width: 60px; height: 60px; margin-left: 10px"/>
        <div class="txt">
          内存使用({{ resource.percentage }}%)
          <br />
          操作系统({{ resource.cpu }})
        </div>
      </div>
      <div class="list" :style="`background-color: rgba(212,237,244,1);`">
        <img src="@/static/visit.png" alt="" />
        <div class="txt">网站访问次数({{ resource.browse }})</div>
      </div>
    </div>
    <div id="main"></div>
    <div id="line"></div>
    <div id="night"></div>
  </div>
</template>

<script lang="ts">
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout, UniversalTransition } from "echarts/features";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart, LineChart } from "echarts/charts";

import { defineComponent, nextTick, onMounted, ref, reactive } from "vue";
import {
  Pipoption,
  Lineoption,
  Nightingaleoption,
} from "./components/CommonOptions";
import MonitorModuleApi from "@/api/Modules/MonitorModule";
import { ElMessage } from "element-plus";
import { randomColorList } from "@/common/Utils";
import UserInfoApi from "@/api/Modules/UserInfoModule";
import { useRouter } from "vue-router";
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LineChart,
  PieChart,
  LegendComponent,
]);
export default defineComponent({
  setup() {

    const router = useRouter();
    const resource = reactive({
      article: 0,
      category: 0,
      label: 0,
      leavemsg: 0,
      browse: 0,
      percentage: 0,
      cpu: null,
    });
    async function loadInfo() {
      let { data } = await UserInfoApi.adminInfo();
      if (data.state === 200) {
        for (let k in resource) {
          resource[k] = data.data[k];
        }
      } else ElMessage.error(data.msg);
    }

    function loadCharts(){
      document.getElementById("main").removeAttribute("_echarts_instance_");
      document.getElementById("night").removeAttribute("_echarts_instance_");
      document.getElementById("line").removeAttribute("_echarts_instance_");
      setTimeout(() => {
        MonitorModuleApi.MonitorList()
          .then((data) => {
            if (data.data.state === 200) {
              let { ApiCount, Max, User, onLine,Data } = data.data.data;
              let myPipChart = echarts.init(document.getElementById("main"));
              myPipChart.setOption(Pipoption(onLine, User, Max));
              let myNightChart = echarts.init(document.getElementById("night"));
              myNightChart.setOption(Nightingaleoption(ApiCount));
              let myLineChart = echarts.init(document.getElementById("line"));
              myLineChart.setOption(Lineoption(Data));
            }
          })
          .catch((error) => {
            ElMessage.error(error);
        });
      }, 300);
    }

    nextTick(() => {
      loadCharts();
      setInterval(() => {
        loadCharts();
      }, 5 * 3600 * 10);
    });

    onMounted(() => {
      loadInfo();
    });

    return {
      randomColorList,
      resource,
      router,
    };
  },
});
</script>

<style lang="less" scoped>
.WelCome {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  #main {
    width: 20%;
    height: 400px;
  }
  #line {
    width: 60%;
    height: 400px;
  }
  #night {
    width: 20%;
    height: 400px;
  }
  .list {
    padding: 20px;
    box-sizing: content-box;
    width: 20%;
    height: 80px;
    margin: 0 2%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 20px;
    cursor: pointer;
    transition: 300ms all linear;
    &:hover {
      opacity: 0.5;
    }
    .txt {
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 20px;
    }
    img {
      width: 80px;
      height: 80px;
      margin-left: 5px;
    }
  }
  width: 100%;
  position: relative;
  height:850px;
}
.details{
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>