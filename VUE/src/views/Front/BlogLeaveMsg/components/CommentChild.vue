<template>
  <div class="child-comment">
    <div class="head-cnt">
      <img class="head-img" :src="data.avatar" alt="" />
    </div>
    <div class="content">
      <div class="head-name">
        <span class="child-name"
          >{{ data.username }} <span v-if="data.admission" class="root">(管)</span>
          <hr class="line" />
        </span>
        <span style="color: rgba(74, 187, 243, 1)">回复</span>
        <span class="child-rname"
          >@{{ data.replayuser }}
          <hr class="line"
        /></span>
        <span class="child-time"
          >{{ moment(data.create_at).fromNow() }}
          <hr class="line"
        /></span>
      </div>
      <div class="child-content" v-html="data.content" />
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
        id: data.value.pid,
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
.child-comment {
  display: flex;
  flex-direction: row;
  padding-left: 70px;
  padding: 10px;
  border-radius: 5px;
  position: relative;
}
.head-cnt {
  text-align: center;
  width: 70px;
  margin-left: 70px;
  height: auto;
  border-left: 5px solid rgba(211, 211, 211, 0.3);
  .head-img {
    margin: 0 auto;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
}
.parent-comment {
  display: flex;
  flex-direction: row;
}
.content {
  padding-left: 10px;
  width: 100%;
  .head-msg {
    height: 40px;
    line-height: 40px;
    color: rgba(151, 151, 151, 0.8);
    margin: 0 auto;
    cursor: pointer;
  }
  .head-content {
    line-height: 30px;
    margin-top: 20px;
    font-size: 15px;
    //border:  1px solid rgba(218, 218, 218,.5);
    border-radius: 5px;
    padding: 20px;
    padding-bottom: 0px;
  }
  .child-name {
    color: rgba(221, 42, 123, 1);
    margin-right: 5px;
    margin-left: 5px;
    transition: 300ms all ease;
    display: inline-block;
    .line {
      transition: 500ms all ease;
      width: 0%;
      height: 2px;
      border: none;
      background-color: rgba(221, 42, 123, 1);
      opacity: 0;
    }
    &:hover > .line {
      width: 100%;
      opacity: 1;
    }
    cursor: pointer;
  }
  .child-rname {
    cursor: pointer;
    .line {
      transition: 500ms all ease;
      width: 0%;
      height: 2px;
      border: none;
      background-color: red;
      opacity: 0;
    }
    &:hover > .line {
      width: 100%;
      opacity: 1;
    }
    display: inline-block;
    margin-left: 5px;
    color: red;
    margin-right: 20px;
  }
  .child-time {
    color: rgba(151, 151, 151, 0.8);
    cursor: pointer;
    .line {
      transition: 500ms all ease;
      width: 0%;
      height: 1px;
      border: none;
      background-color: rgba(221, 42, 123, 1);
      opacity: 0;
    }
    &:hover > .line {
      width: calc(100% - 150px);
      opacity: 1;
    }
  }
  .child-content {
    padding: 20px;
    width: calc(100% - 150px);
    min-width: 200px;
    padding-top: 5px;
    padding-bottom: 0px;
    padding-left: 10px;
    word-wrap: break-word;
  }
}
.replay {
  position: absolute;
  right: 20px;
  color: rgba(3, 166, 255, 1);
  z-index: 9999;
  bottom: 5px;
  cursor: pointer;
  .line {
    transition: 500ms all ease;
    width: 0%;
    height: 2px;
    border: none;
    background-color: rgba(3, 166, 255, 1);
    opacity: 0;
  }
  &:hover > .line {
    width: 100%;
    opacity: 1;
  }
}
</style>