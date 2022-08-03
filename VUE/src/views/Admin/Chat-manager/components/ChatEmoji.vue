<template>
  <c-scrollbar style="background-color: #fff; width: 300px" class="p">
    <div class="emoji">
      <li
        @click="chooseEmoji(item)"
        v-for="(item, index) in Emoji"
        :key="index"
      >
        {{ item }}
      </li>
    </div>
  </c-scrollbar>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
export default defineComponent({
  props: {
    emojiList: Array,
  },
  setup(props, ctx) {
    const { emojiList } = toRefs(props);

    function chooseEmoji(item) {
      ctx.emit("sendEmoji", item);
    }

    return {
      Emoji: emojiList,
      chooseEmoji,
    };
  },
});
</script>

<style lang="less" scoped>
.emoji {
  width: 300px;
  height: 120px;
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
  li {
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
      background-color: gray;
    }
  }
}
.p {
  position: absolute;
  right: 0px;
  top: 0px;
}
</style>