<template>
  <div class="fx">
    <c-scrollbar :style="`height: auto; width: ${collapsed ? '90px' : '200px'}; background-color: #fff;transition: 500ms all ease;`">
      <a-menu mode="inline" @click="onMenuClick" 
        :openKeys="openKeys"
        :inline-collapsed="collapsed"
        v-model:selectedKeys="selectedKeys"
        :style="`width: ${collapsed ? '90px' : '200px'};`"
        >
        <a-sub-menu v-for="item in menu" :key="item.name" :title="item.name">
          <template #icon>
            <icon-font :type="item.icon" />
          </template>
          <template v-for="item2 in item.children">
            <a-sub-menu
              v-if="item2.children"
              :title="item2.name"
              :key="item2.route"
            >
              <a-menu-item v-for="item3 in item2.children" :key="item3.route">
                <span>{{item3.name}}</span>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item2.route">
              <span>{{item2.name}}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
        <a-button
          class="btn"
          type="primary"
          @click="$router.push('/home')"
          style="width: 100%; height: 40px; margin-top: 20px"
          >返回主页</a-button
        >
      </a-menu>
    </c-scrollbar>
    <div class="cxt">
      <div class="bread">
        <li class="nav" @click="collapsed = !collapsed" >
          <img :style="`${collapsed ? 'transform: rotateY(180deg);' : 'transform: rotateY(0deg);'}`" src="@/static/nav.png" alt="">
        </li>
        <li class="item" @click="goto(item,index)" v-for="(item,index) in breadNavigator" :key="index" :style="`${step === index ? 'background-color: rgba(121,30,148,1);color:#fff;' : ''}`">
          <div>{{item.router}}</div>
          <div @click.stop="drop(item,index)" class="c"
            :style="`${step === index ? 'right: 3px;' : ''}`"
          >×</div>
        </li>
      </div>
      <c-scrollbar style="height: 100%;padding-left: 15px;padding-top: 10px;padding-right: 20px;">
        <router-view></router-view>
      </c-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MenuData from "@/menu/menu";
import router from "@/router";
import { useRoute } from "vue-router";
export default defineComponent({
  setup() {
    const findMenuPath = ref<string[]>([]);
    const menu = ref(MenuData.menu);
    const route = useRoute();
    const openKeys = ref(['首页']);
    const selectedKeys = ref(['WellCome']);
    const breadNavigator = ref([]);
    const collapsed = ref(false);
    const step = ref(0);

    function onMenuClick(e: { keyPath: string[] }) {
      router.push(e.keyPath[1]);
      openKeys.value = [e.keyPath[0]];
      let data = {
        key: e.keyPath[0],
        router: e.keyPath[1]
      };
      if(!breadNavigator.value.find( x => {
        return x.router === e.keyPath[1];
      })){
        breadNavigator.value.push(data);
      }
    
      breadNavigator.value.map((k,i) => {
        if(k.router === data.router){
          step.value = i;
        }
      });
    }

    window.addEventListener("beforeunload", () => {
      let data = {
        ok: openKeys.value,
        sk: selectedKeys.value,
        br: breadNavigator.value,
        sp: step.value
      };
      sessionStorage.setItem("menu",JSON.stringify(data));
    });

    function drop(data:Record<string,string>,index:number){
      breadNavigator.value =  breadNavigator.value.filter(item => item.router !== data.router);
      if(index === step.value){
        if(breadNavigator.value.length === step.value && breadNavigator.value.length !== 0){
          step.value--;
          router.push(breadNavigator.value[step.value].router);
          selectedKeys.value = [breadNavigator.value[step.value].router];
          openKeys.value = [breadNavigator.value[step.value].key];
          return;
        }
        if(breadNavigator.value.length !== 0){
          openKeys.value = [breadNavigator.value[step.value].key];
          selectedKeys.value = [breadNavigator.value[step.value].router];
          router.push(breadNavigator.value[step.value].router);
          return;
        }
      }else{
        if(index < step.value){
          step.value--;
        }
      };
    }

    function goto(data:Record<string,string>,index:number){
      openKeys.value = [data.key];
      selectedKeys.value = [data.router];
      router.push(data.router);
      step.value = index;
    }

    onMounted(() => {
      let data = sessionStorage.getItem("menu");
      if(data !== null){
        let { ok, sk,br,sp } = JSON.parse(data);
        openKeys.value = ok;
        selectedKeys.value = sk;
        breadNavigator.value = br;
        step.value = sp;
        router.push(sk[0]);
      }
      else {
        router.push("WellCome");
        breadNavigator.value.push({
          key: openKeys.value[0],
          router: selectedKeys.value[0],
        });
      }
    });
    return {
      menu,
      findMenuPath,
      onMenuClick,
      route,
      openKeys,
      selectedKeys,
      breadNavigator,
      drop,
      goto,
      collapsed,
      step
    };
  },
});
</script>
<style scoped lang="less">
.fx {
  display: flex;
  height: 100vh;
  .cxt {
    flex: auto;
    width: 1px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: rgba(245, 245, 245, 1);
  }
}
.btn {
  background-color: rgb(0, 183, 255);
  &:hover {
    background-color: rgb(0, 204, 255);
  }
}
.bread{
  display: flex;
  align-items:center;
  border-bottom: 1px solid rgba(180, 180, 180,.5);
  height: 45px;
  .item{
    cursor: pointer;
    &:hover{
      background-color: rgba(121,30,148,1) !important;
      color: #fff;
    }
    transition: 500ms all ease;
    background-color: #fff;
    height: 35px;
    display: flex;
    align-items:center;
    justify-content: center;
    line-height: 35px;
    border-radius: 5px;
    text-align: center;
    margin-left: 10px;
    border: 1px solid rgba(172, 172, 172,0.6);
    padding-left: 10px;
    color:rgba(107,119,141,1);
    padding-right: 25px;
    position: relative;
    overflow: hidden;
    &:hover > .c{
      right: 3px;
    }
    .c{
      z-index: 9999;
      cursor: pointer;
      display: flex;
      align-items:center;
      justify-content: center;
      width: 15px;
      height: 15px;
      text-align: center;
      border-radius: 50%;
      border: 1px solid #fff;
      position: absolute;
      right: -20px;
      top: 10px;
      transition: 500ms all ease;
      &:hover{
        background-color: rgba(54,140,191,1);
        color: #fff;
      }
    }
  }
  .nav{
    cursor: pointer;
    &:hover{
      background-color: rgba(255, 0, 128,0.3);
    }
    transition: 500ms all ease;
    background-color: rgba(245,78,162,1);
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    text-align: center;
    margin-left: 10px;
    border: 1px solid rgba(172, 172, 172,0.6);
    padding-left: 10px;
    color:rgba(107,119,141,1);
    padding-right: 20px;
    display: flex;
    align-items:center;
    justify-content: center;
    img{
      transition: 500ms all ease;
      width: 20px;
    }
  }
}
</style>

