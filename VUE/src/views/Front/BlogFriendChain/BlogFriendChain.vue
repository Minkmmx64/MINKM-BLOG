<template>
  <c-scrollbar style="width: 100%; height: calc(100vh - 60px);" direction="y">
    <div class="FriendChain">
      <ul class="main">
        <li 
          class="chain-item" 
          @click="goTo(item.chain_side)" v-for="(item,index) in FriendChain" :key="index" 
          :style="`background-color: ${bgcList[Math.floor(Math.random() * bgcList.length)]};`"> <!-- :style="`background-color: ${bgcList[Math.floor(Math.random() * bgcList.length)]};`" -->
          <div class="time">
            {{item.create_at.split(" ")[0]}}
          </div>
          <img :src="item.chain_avatar" alt="">
          <div class="title">
            {{item.chain_title}}
          </div>
          <div class="describe">
            {{item.chain_describe}}
          </div>
        </li>
      </ul>
    </div>
  </c-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BlogFriendChainApi from "@/api/Modules/BlogFriendChainModule";
export default defineComponent({
  setup() {

    const FriendChain = ref();
    const bgcList = [
      "rgba(242,49,127,1)",
      "rgba(237,84,133,1)",
      "rgba(51,153,255,1)",
      "rgba(228,213,40,1)"
    ];

    async function loadFriendChain(){
      FriendChain.value = (await BlogFriendChainApi.getFriendChain(1,9999)).data.data;
    }

    function goTo(src:string){
      window.open(src);
    }


    onMounted(() => loadFriendChain());

    return{
      FriendChain,
      loadFriendChain,
      bgcList,
      goTo
    };
  },
});
</script>

<style lang="less" scoped>
.FriendChain{
  width: 100%;
  //background-color: rgba(255, 255, 255, 1);
  margin-top: 150px;
}
.main{
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 70%;
  margin: 0 auto;
}
.chain-item{
  .time{
    transition:  500ms all ease;
    width: 100%;
    position: absolute;
    color: rgba(254,95,85,1);
    transform: rotateY(180deg);
    opacity: 0;
  }
  border: 1px solid rgba(202, 202, 202,.2);
  position: relative;
  background-color: #fff;
  cursor: pointer;
  transition:  500ms all ease;
  &:hover{
    transform: scale(1.05);
    box-shadow: 5px 5px 25px rgba(59, 59, 59, 0.2),
    -5px -5px 25px rgba(54, 54, 54, 0.2);
  }
  &:hover > .time{
    transform: rotateX(0deg);
    opacity: 1;
  }
  margin: 20px;
  padding-top: 10px;
  width: 250px;
  border-radius: 10px;
  overflow:hidden;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  img{
    width: 100px;
    height:100px;
    border-radius: 5px;
  }
  .title{
    width: 100%;
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    color: rgba(0,0,0,1);
    //background-color: #fff;
  }
  .describe{
    width: 80%;
    margin: 0 auto;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    //background-color: #fff;
    box-sizing: border-box;
    color: #fff;
  }
}
</style>