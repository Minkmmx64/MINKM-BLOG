<template>
  <div class="m-bg-leave">
    <!-- <LeaveBackGround mtitle="留言" /> -->
    <c-scrollbar
      style="width: 100%; height: calc(100vh - 60px); margin: 0 auto"
    >
      <div class="leave-message">
        <textarea
          rows="5"
          placeholder="留言内容经审核再发布,已登录用户可以不使用QQ账号进行发言"
          class="textarea"
          v-model="textarea"
        >
        </textarea>
        <div class="leave-item">
          <div>
            <input
              type="text"
              v-model="leaveMsgInp.phone"
              placeholder="输入你的手机号（可选）"
            />
          </div>
          <div>
            <input
              type="text"
              v-model="leaveMsgInp.email"
              placeholder="输入你的邮箱（必填）"
            />
          </div>
          <div>
            <input
              type="text"
              v-model="leaveMsgInp.qqnumber"
              placeholder="输入你的QQ号（可选）"
            />
          </div>
          <div>
            <input
              type="text"
              v-model="leaveMsgInp.side"
              placeholder="输入你的站点（可选）"
            />
          </div>
        </div>
        <div @click="submit" class="leave-submit">发布留言</div>
        <template v-if="ParentDataSource">
          <li v-for="(item, index) in ParentDataSource" :key="index">
            <LeaveMsgComment
              @showReplayComment="showReplayComment"
              :data="item"
              :key="index"
            />
            <template v-if="item.children">
              <li v-for="(child, index) in item.children" :key="index">
                <CommentChild
                  @showReplayComment="showReplayComment"
                  :data="child"
                />
              </li>
              <CustomInputControl
                v-if="item._id === id"
                :data="data"
                @putLeaveMsgOk="loadData"
              />
            </template>
          </li>
        </template>
      </div>
    </c-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { checkUrl, userPhoneRegEx } from "@/common/common";
import { ElMessage } from "element-plus";
import QQApi from "@/api/Modules/QQModule";
import { deepClone } from "@/common/Utils";
import store from "@/store";
import LeaveMsgApi from "@/api/Modules/LeaveMsgModule";
import { convertPidToChildren } from "@/common/Utils";
import LeaveMsgComment from "./LeaveMsgComment.vue";
import CommentChild from "./components/CommentChild.vue";
import CustomInputControl from "@/components/CustomInputControl.vue";
export default defineComponent({
  components: {
    LeaveMsgComment,
    CommentChild,
    CustomInputControl,
  },
  setup() {
    const textarea = ref("");
    const leaveMsgInp = ref({
      content: "",
      phone: "",
      qqnumber: "",
      email: "",
      side: "",
      user: "",
      avatar: "",
      pid: "",
      islogin: false,
    });
    const ParentDataSource = ref();
    const id = ref();
    const data = ref();

    function postData() {
      LeaveMsgApi.postLeaveMsg(leaveMsgInp.value)
        .then((data) => {
          if (data.data.state === 200) {
            ElMessage.success(data.data.msg);
            for (let k in leaveMsgInp.value) {
              leaveMsgInp.value[k] = "";
            }
            textarea.value = "";
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    function showReplayComment(e) {
      id.value = e.id;
      data.value = e;
    }

    function submit() {
      if (!ckeck()) return;
      textarea.value
        .trim()
        .split("\n")
        .map((item) => {
          leaveMsgInp.value.content += `<p>${item}</p>`;
        });
      if (leaveMsgInp.value.pid === "") leaveMsgInp.value.pid = "root";
      //如果用户已登录
      if (store.state.UserStatus) {
        leaveMsgInp.value.avatar = store.getters.getUserImgurl;
        leaveMsgInp.value.user = store.getters.getUserName;
        leaveMsgInp.value.islogin = true;
        postData();
      } else {
        //否则使用QQ
        if (
          leaveMsgInp.value.qqnumber === "" ||
          leaveMsgInp.value.qqnumber === undefined ||
          leaveMsgInp.value.qqnumber === null
        )
          ElMessage.error("无效的发言[未输入用户信息]");
        QQApi.getQQUserInfo(leaveMsgInp.value.qqnumber)
          .then((info) => {
            if (info.data.code === 200) {
              let data = deepClone(info.data.data);
              leaveMsgInp.value.avatar = data.avatar;
              leaveMsgInp.value.user = data.name;
              leaveMsgInp.value.qqnumber = data.qq;
              leaveMsgInp.value.islogin = false;
              postData();
            }
          })
          .catch((error) => {
            ElMessage.error("请输入正确qq账号");
          });
      }
    }

    function ckeck(): Boolean {
      if (
        textarea.value === "" ||
        textarea.value === undefined ||
        textarea.value === null
      ) {
        ElMessage.error("还没输入内容呢");
        return false;
      } else if (
        leaveMsgInp.value.side !== "" &&
        typeof leaveMsgInp.value.side === "string"
      ) {
        if (!checkUrl.test(leaveMsgInp.value.side)) {
          ElMessage.error("站点不符合");
          return false;
        }
      } else if (
        leaveMsgInp.value.phone !== "" &&
        typeof leaveMsgInp.value.phone === "string"
      ) {
        if (!userPhoneRegEx.test(leaveMsgInp.value.phone)) {
          ElMessage.error("手机号不符合");
          return false;
        }
      }
      if (leaveMsgInp.value.email === "") {
        ElMessage.error("还没输入email");
        return false;
      }
      return true;
    }

    function loadData() {
      LeaveMsgApi.loadLeaveMsg(0, 0, null, null)
        .then((data) => {
          if (data.data.state === 200) {
            ParentDataSource.value = convertPidToChildren(
              deepClone(data.data.data),
              "pid",
              "root"
            );
          } else ElMessage.error(data.data.msg);
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    }

    onMounted(() => {
      loadData();
    });

    return {
      leaveMsgInp,
      submit,
      textarea,
      store,
      ParentDataSource,
      id,
      data,
      showReplayComment,
      loadData,
    };
  },
});
</script>

<style lang="less" scoped>
.leave-msg {
  position: relative;
  transform: scale3d(1, 1, 1);
  height: 100vh;
}
.leave-message {
  @media screen and (max-width: 1200px) {
    width: 60%;
  }
  @media screen and (max-width: 1000px) {
    width: 70%;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
  width: 50%;
  margin: 0 auto;
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: #fff;
}
.bg {
  width: 100%;
  height: 100%;
  transition: 1000ms all ease;
  background: url("https://img0.baidu.com/it/u=2913025988,991323511&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889");
  background-repeat: no-repeat;
  background-color: rgba(133, 133, 133, 0.5);
  background-size: auto 100%;
  cursor: pointer;
  .title {
    width: 100%;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.1);
    color: rgb(255, 255, 255);
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 0%;
    text-align: center;
    line-height: 50px;
  }
}
.textarea {
  width: 80%;
  display: block;
  margin: 0 auto;
  resize: none;
  padding: 20px;
  outline: none;
  border-radius: 5px;
  border: 2px solid rgba(219, 219, 219, 0.7);
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
  transition: 300ms all ease-in-out;
  &:focus {
    border-color: rgba(255, 115, 0, 0.7);
  }
}
.leave-item {
  transition: 200ms all ease-in-out;
  display: flex;
  flex-direction:row;
  flex-wrap:nowrap;
  width: 100%;
  height: 35px;
  justify-content: center;
  margin-top: 10px;
  div {
    border-radius: 20px;
    margin: 0 2%;
    width: 22%;
    height: 100%;
    input {
      border-radius: 15px;
      padding-left: 15px;
      line-height: 35px;
      font-size: 0.4rem;
      color: rgba(0, 0, 0, 0.7);
      transition: 300ms all ease-in-out;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(219, 219, 219, 0.7);
      outline: none;
      &:focus {
        border-color: rgba(255, 115, 0, 0.7);
      }
    }
  }
}
.leave-submit {
  width: 80%;
  height: 45px;
  margin: 0 auto;
  margin-top: 20px;
  text-align: center;
  color: rgb(255, 255, 255);
  line-height: 45px;
  border-radius: 5px;
  cursor: pointer;
  background: -webkit-linear-gradient(
    45deg,
    rgba(231, 71, 94, 1),
    rgba(255, 156, 195, 0.7),
    rgba(241, 172, 157, 1)
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    45deg,
    rgba(231, 71, 94, 1),
    rgba(255, 156, 195, 0.7),
    rgba(241, 172, 157, 1)
  ); /*11.1 - 12.0 */
  background: -moz-linear-gradient(
    45deg,
    rgba(231, 71, 94, 1),
    rgba(255, 156, 195, 0.7),
    rgba(241, 172, 157, 1)
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(
    45deg,
    rgba(231, 71, 94, 1),
    rgba(255, 156, 195, 0.7),
    rgba(241, 172, 157, 1)
  ); /* 标准的语法（必须放在最后） */
  background-size: 400%;
  animation: bgl 10s ease-in-out infinite;
  margin-bottom: 20px;
}
@keyframes bgl {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>