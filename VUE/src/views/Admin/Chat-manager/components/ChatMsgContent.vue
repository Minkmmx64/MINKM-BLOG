<template>
  <div>
    <div class="chatMain" v-for="(item, index) in dataList" :key="index">
      <div class="chat-ls" v-if="store.getters.getUserName !== item.name">
        <div
          class="chat-time"
          style="margin-top: 30px"
          v-if="isShowData(index, dataList)"
        >
          {{ D(item.date) }}
        </div>
        <div class="msg-left mjw-flex-row">
          <img :src="item.imgUrl" alt="" />
          <div v-if="item.types === 'text'" class="msg-content">
            {{ item.content }}
          </div>
          <div v-else-if="item.types === 'images'" class="msg-content">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.content"
              :preview-src-list="[item.content]"
              :initial-index="0"
              fit="cover"
            >
            </el-image>
          </div>
        </div>
      </div>
      <div class="chat-ls" v-else>
        <div
          class="chat-time"
          style="margin-top: 30px"
          v-if="isShowData(index, dataList)"
        >
          {{ D(item.date) }}
        </div>
        <div class="msg-right mjw-flex-row-rev">
          <img :src="store.getters.getUserImgurl" />
          <div v-if="item.types === 'text'" class="msg-content">
            {{ item.content }}
          </div>
          <div v-else-if="item.types === 'images'" class="msg-content">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.content"
              :preview-src-list="[item.content]"
              :initial-index="0"
              fit="cover"
            >
            </el-image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
export default defineComponent({
  setup() {
    function D(date: string): string {
      let T = date.split(" ");
      return `${T[3].length === 2 ? T[3] : "0" + T[3]}:${
        T[4].length === 2 ? T[4] : "0" + T[4]
      }`;
    }

    function isShowData(key: number, list: [{ date: string }]) {
      if (key === 0) return true;
      else {
        let beforeTime = list[key - 1].date.split(" ");
        let nextTime = list[key].date.split(" ");
        let bY = beforeTime[0];
        //let bM = beforeTime[1];
        let bD = beforeTime[2];
        let bH = beforeTime[3];
        let bS = beforeTime[4];
        let nY = nextTime[0];
        //let nM = nextTime[1];
        let nD = nextTime[2];
        let nH = nextTime[3];
        let nS = nextTime[4];
        return Math.abs(
          +bY * 365 * 24 * 3600 +
            +bD * 3600 * 24 +
            +bH * 3600 +
            +bS * 60 -
            (+nY * 365 * 24 * 3600 + +nD * 3600 * 24 + +nH * 3600 + +nS * 60)
        ) >= 180
          ? true
          : false;
      }
    }

    return {
      isShowData,
      store,
      D,
    };
  },
  props: ["dataList"],
});
</script>

<style scoped  lang="less">
.msg-left {
  img {
    width: 30px;
    height: 30px;
  }
  .msg-content {
    margin-left: 20px;
    background-color: #fff;
    max-width: 200px;
    padding: 8px;
    border-radius: 10px;
  }
}
.chat-ls {
  .chat-time {
    text-align: center;
    background: rgba(201, 201, 201, 0.2);
    width: 50px;
    margin: 0 auto;
    border-radius: 5px;
    color: gray;
  }
  margin-top: 30px;
}
.msg-right {
  img {
    width: 30px;
    height: 30px;
  }
  .msg-content {
    padding: 8px;
    margin-right: 20px;
    border-radius: 10px;
    background-color: rgb(158, 234, 106);
    max-width: 200px;
  }
}
</style>