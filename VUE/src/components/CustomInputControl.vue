<!-- 自定义表单输入控件 -->
<template>
  <div class="leave-message1">
    <textarea
      rows="5"
      placeholder="子留言内容不会进行邮箱发送"
      class="textarea"
      v-model="textarea"
    >
    </textarea>
    <div class="leave-item">
      <div>
        <input
          type="text"
          v-model="InpValue.phone"
          placeholder="输入你的手机号（可选）"
        />
      </div>
      <div>
        <input
          type="text"
          v-model="InpValue.qqnumber"
          placeholder="输入你的QQ号（可选）"
        />
      </div>
    </div>
    <div @click="submit" class="leave-submit">发布留言</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import QQApi from "@/api/Modules/QQModule";
import store from "@/store";
import LeaveMsgApi from "@/api/Modules/LeaveMsgModule";
import { ElMessage } from "element-plus";
import { userPhoneRegEx } from "@/common/common";
import { deepClone } from "@/common/Utils";
export default defineComponent({
  props: {
    data: Object,
  },
  setup(props, ctx) {
    const { data } = toRefs(props);
    const InpValue = ref({
      content: "", //1
      phone: "", //1
      qqnumber: "", //1
      user: "",
      avatar: "",
      pid: "", //1
      islogin: true,
      replayuser: "",
      side: "",
      isread: true,
    });
    const textarea = ref("");

    function submit() {
      if (textarea.value === "") return ElMessage.error("未输入评论");
      if (InpValue.value.phone !== "") {
        if (!userPhoneRegEx.test(InpValue.value.phone))
          return ElMessage.error("手机号格式不正确");
      }
      InpValue.value.pid = data.value.id;
      InpValue.value.replayuser = data.value.replayname;
      InpValue.value.isread = true;
      textarea.value
        .trim()
        .split("\n")
        .map((item) => {
          InpValue.value.content += `<p>${item}</p>`;
        });
      if (store.state.UserStatus) {
        //此时不需要输入qq账号
        InpValue.value.user = store.getters.getUserName;
        InpValue.value.avatar = store.getters.getUserImgurl;
        InpValue.value.islogin = true;
        LeaveMsgApi.postLeaveMsg(InpValue.value)
          .then((data) => {
            if (data.data.state === 200) {
              ElMessage.success(data.data.msg);
              for (let k in InpValue.value) {
                InpValue.value[k] = "";
              }
              textarea.value = "";
              ctx.emit("putLeaveMsgOk");
            } else ElMessage.error(data.data.msg);
          })
          .catch((error) => {
            ElMessage.error(error);
          });
      } else {
        if (InpValue.value.qqnumber === "")
          return ElMessage.error("未输入qq账号");
        //此时未登录
        QQApi.getQQUserInfo(InpValue.value.qqnumber)
          .then((info) => {
            if (info.data.code === 200) {
              let data = deepClone(info.data.data);
              InpValue.value.avatar = data.avatar;
              InpValue.value.user = data.name;
              InpValue.value.qqnumber = data.qq;
              InpValue.value.islogin = false;
              LeaveMsgApi.postLeaveMsg(InpValue.value)
                .then((data) => {
                  if (data.data.state === 200) {
                    ElMessage.success(data.data.msg);
                    for (let k in InpValue.value) {
                      InpValue.value[k] = "";
                    }
                    textarea.value = "";
                    ctx.emit("putLeaveMsgOk");
                  } else ElMessage.error(data.data.msg);
                })
                .catch((error) => {
                  ElMessage.error(error);
                });
            }
          })
          .catch((error) => {
            ElMessage.error("请输入正确qq账号" + error);
          });
      }
    }
    return {
      textarea,
      submit,
      InpValue,
    };
  },
});
</script>

<style scoped lang="less">
.leave-message1 {
  width: 80%;
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: #fff;
  margin: 0 auto;
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
  flex-direction: row;
  width: 100%;
  height: 35px;
  justify-content: center;
  margin-top: 10px;
  div {
    border-radius: 20px;
    margin: 0 2%;
    width: 40%;
    height: 100%;
    input {
      border-radius: 15px;
      padding-left: 15px;
      line-height: 35px;
      font-size: 12px;
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
    left,
    rgba(250, 227, 217, 1),
    rgba(253, 196, 182, 1),
    rgba(250, 227, 217, 1)
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    left,
    rgba(250, 227, 217, 1),
    rgba(253, 196, 182, 1),
    rgba(250, 227, 217, 1)
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    left,
    rgba(250, 227, 217, 1),
    rgba(253, 196, 182, 1),
    rgba(250, 227, 217, 1)
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(
    left,
    rgba(250, 227, 217, 1),
    rgba(253, 196, 182, 1),
    rgba(250, 227, 217, 1)
  ); /* 标准的语法（必须放在最后） */
  background-size: 10000px 100%;
  background-position: 0px 0%;
  animation: bgl 50s ease-in-out infinite;
  margin-bottom: 20px;
}
@keyframes bgl {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -5000px 0%;
  }
}
</style>