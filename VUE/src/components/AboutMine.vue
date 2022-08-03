<template>
  <div class="AboutMine">
    <img :src="QQInfo.avatar" alt="" class="head" />
    <div class="qq">
      <span @click="goToQQ"
        >站长QQ:&nbsp;&nbsp;&nbsp;&nbsp;{{ QQInfo.qq }}
        <hr class="line"
      /></span>
    </div>
    <div class="name">
      用户名:&nbsp;&nbsp;&nbsp;&nbsp;{{ QQInfo.name }}
      <hr class="line" />
    </div>
    <div class="detail">
      <li>
        <div
          class="title"
          :style="{
            color:
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ],
            borderRight: `1px solid ${
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ]
            }`,
          }"
        >
          文章
        </div>
        <div class="text">{{ adminInfo.article }}</div>
      </li>
      <li>
        <div
          class="title"
          :style="{
            color:
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ],
            borderRight: `1px solid ${
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ]
            }`,
          }"
        >
          浏览量
        </div>
        <div class="text">{{ adminInfo.browse }}</div>
      </li>
      <li>
        <div
          class="title"
          :style="{
            color:
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ],
            borderRight: `1px solid ${
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ]
            }`,
          }"
        >
          文章评论
        </div>
        <div class="text">{{ adminInfo.comment }}</div>
      </li>
      <li>
        <div
          class="title"
          :style="{
            color:
              randomColorList[
                Math.floor(Math.random() * randomColorList.length)
              ],
          }"
        >
          点赞数
        </div>
        <div class="text">{{ adminInfo.like }}</div>
      </li>
    </div>
    <div class="wx">
      <span class="anim">扫一扫添加微信哦^-^</span>
      <img src="@/static/wx.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import UserInfoApi from "@/api/Modules/UserInfoModule";
import QQApi from "@/api/Modules/QQModule";
import { ElMessage } from "element-plus";
import { randomColorList } from "@/common/Utils";
export default defineComponent({
  setup() {
    const qqList = ["2268731813", "3573672188", "1362553792", "1970777503"];
    const QQInfo = reactive({
      qq: "",
      name: "",
      avatar: "",
    });

    const adminInfo = reactive({
      browse: "",
      comment: "",
      article: "",
      like: "",
      dislike: "",
    });

    function goToQQ() {
      window.open(
        "https://wpa.qq.com/msgrd?v=3&uin=3573672188&site=qq&menu=yes"
      );
    }

    onMounted(async () => {
      QQApi.getQQUserInfo(qqList[Math.floor(Math.random() * qqList.length)])
        .then((data) => {
          if (data.data.code === 200) {
            for (let k in data.data.data) {
              QQInfo[k] = data.data.data[k];
            }
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });

      UserInfoApi.adminInfo()
        .then((data) => {
          if (data.data.state === 200) {
            for (let k in data.data.data) {
              adminInfo[k] = data.data.data[k];
            }
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    });

    return {
      QQInfo,
      randomColorList,
      goToQQ,
      adminInfo,
    };
  },
});
</script>

<style lang="less" scoped>
.AboutMine {
  width: 100%;
  padding-top: 10px;
  border: 2px solid rgba(242,244,246,1);
   box-shadow: 5px 5px 20px rgba(145, 145, 145, 0.5),
        -5px -5px 20px rgba(190, 190, 190, 0.5);
  padding-bottom: 10px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 1px 1px 10px 2px rgba(131, 131, 131, 0.1),-1px -1px 10px 2px rgba(92, 92, 92, 0.1);
  //border-top-right-radius: 20px;
  margin: 0 auto;
  background-color: #fff;
  .head {
    margin: 0 auto;
    border-radius: 50%;
    width: 90px;
    height: 90px;
    transition: 800ms all ease-in-out;
    &:hover {
      transform: rotate(400deg);
    }
  }
  .qq {
    color: rgba(255, 182, 185, 1);
    span {
      cursor: pointer;
      position: relative;
      height: 30px;
      display: inline-block;
      line-height: 30px;
      .line {
        width: 0%;
        opacity: 0;
        height: 1px;
        background-color: rgb(255, 113, 118);
        transition: 500ms all ease;
        border: none;
      }
      &:hover > .line {
        width: 100%;
        opacity: 1;
      }
    }
  }
}
.name {
  color: rgba(243, 129, 129, 1);
  &:hover > .line {
    width: 100%;
    opacity: 1;
  }
}
.name > .line {
  transition: 500ms all ease;
  background-color: rgba(221, 42, 123, 1);
  width: 0%;
  height: 1px;
  border: none;
}
.detail {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  justify-content: center;
  li {
    width: 24%;
    text-align: center;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 0.5rem;
    }
  }
}
.wx {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 10px;
  background-color: #fff;
  img {
    margin: 0 auto;
    width: 220px;
    height: 220px;
  }
  .anim {
    width: 0%;
    overflow: hidden;
    margin-top: 10px;
    display: inline-block;
    height: 25px;
    line-height: 25px;
    text-decoration: underline;
    color: rgb(255, 113, 118);
    margin-bottom: 5px;
    border-right: 1px solid #000;
    animation: typewrite 4s steps(44) infinite normal both,
      ablink 0.4s steps(44) infinite normal;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  }
}
@keyframes typewrite {
  0% {
    width: 0%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
@keyframes ablink {
  from {
    border-color: rgb(255, 255, 255);
  }
  to {
    border-color: #000;
  }
}
</style>