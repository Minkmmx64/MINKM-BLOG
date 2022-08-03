<template>
  <div class="parent-comment">
    <div class="head-cnt">
      <div class="head-name">{{ data.username }}</div>
      <img class="head-img" :src="data.avatar" alt="" />
    </div>
    <div class="content">
      <div class="head-msg">
        {{ moment(data.create_at).fromNow() }}
        <hr class="line" />
      </div>
      <div class="head-content" v-html="data.content" />
      <span class="replay" @click="replayMsg"
        >回复
        <hr class="line" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import moment from "moment";
export default defineComponent({
  props: {
    data: Object,
  },
  setup(props, ctx) {
    const { data } = toRefs(props);

    function replayMsg() {
      let Data = {
        id: data.value._id,
        replayname: data.value.username,
      };
      ctx.emit("showReplayComment", Data);
    }

    return {
      moment,
      replayMsg,
    };
  },
});
</script>

<style scoped lang="less">
.head-cnt {
  width: 70px;
  text-align: center;
  .head-name {
    width: 70px;
    height: 40px;
    line-height: 40px;
    color: rgba(254, 95, 85, 1);
  }
  .head-img {
    margin: 0 auto;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: 500ms all ease-in-out;
    &:hover {
      transform: rotate(400deg);
    }
  }
}
.parent-comment {
  display: flex;
  flex-direction: row;
  position: relative;
}
.content {
  .head-msg {
    height: 40px;
    line-height: 40px;
    color: rgba(151, 151, 151, 0.8);
    cursor: pointer;
    .line {
      transition: 500ms all ease;
      width: 0%;
      height: 1px;
      border: none;
      background-color: rgba(255, 59, 29, 1);
      opacity: 0;
    }
    &:hover > .line {
      width: 100%;
      opacity: 1;
      height: 1px;
    }
  }
  .head-content {
    line-height: 30px;
    margin-top: 5px;
    font-size: 15px;
    border-radius: 5px;
    padding: 20px;
    padding-bottom: 0px;
    padding-top: 5px;
  }
  .replay {
    position: absolute;
    right: 20px;
    bottom: 5px;
    color: rgba(255, 59, 29, 1);
    z-index: 9999;
    cursor: pointer;
    .line {
      transition: 500ms all ease;
      width: 0%;
      height: 2px;
      border: none;
      background-color: rgba(255, 59, 29, 1);
      opacity: 0;
    }
    &:hover > .line {
      width: 100%;
      opacity: 1;
    }
  }
}
</style>