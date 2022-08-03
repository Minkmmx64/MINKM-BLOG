<template>
  <div class="addFriedn mjw-flex-column" v-if="UserFriendApply.length != 0">
    <div
      class="index mjw-flex-row"
      v-for="(item, index) in UserFriendApply"
      :key="index"
    >
      <img src="@/static/ChatMain/empty3.png" alt="" />
      <div class="u_name">{{ item.username }}请求添加你为好友</div>
      <div class="btn">
        <el-button
          type="success"
          size="mini"
          @click="AddFriend(1, index, item.username)"
          >接受</el-button
        >
        <el-button
          type="danger"
          size="mini"
          @click="AddFriend(0, index, item.username)"
          >拒绝</el-button
        >
      </div>
    </div>
  </div>
  <div v-else>目前没有好友向你申请</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import store from "@/store";
import { socketData } from "@/api/common/ChatBase";
export default defineComponent({
  setup() {
    const UserFriendApply = store.state.userApply;

    function AddFriend(type: number, index: number, Uname: string): void {
      if (type) {
        ElMessageBox.confirm("接受好友请求吗", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            ElMessage({
              type: "success",
              message: "添加成功",
            });
            let data: socketData = {
              emit: "CHATACCEPTAPPLY",
              send_time: "",
              msg: `${store.getters.getUserName}接受了${Uname}的好友请求`,
              username: store.getters.getUserName,
              state: 1,
              send_username: Uname,
            };
            store.state.webSocket.send(JSON.stringify(data));
            store.state.userApply.splice(index, 1);
          })
          .catch(() => {
            /** */
          });
      } else {
        ElMessageBox.confirm("拒绝好友请求吗", "Warning", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            ElMessage({
              type: "error",
              message: "拒绝成功",
            });
            let data: socketData = {
              emit: "CHATACCEPTAPPLY",
              send_time: "",
              msg: `${store.getters.getUserName}拒绝${Uname}的好友请求`,
              username: store.getters.getUserName,
              state: 0,
              send_username: Uname,
            };
            store.state.webSocket.send(JSON.stringify(data));
            store.state.userApply.splice(index, 1);
          })
          .catch(() => {
            /** */
          });
      }
    }
    return {
      UserFriendApply,
      AddFriend,
    };
  },
});
</script>

<style lang="less" scoped>
.c {
  width: 100%;
  box-sizing: border-box;
}

.index {
  width: 750px;
  position: relative;
  height: 45px;
  background-color: #fff;
  margin-left: 50px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.8);
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  align-items: center;
  padding-left: 20px;
  img {
    height: 80%;
  }
  .u_name {
    margin-left: 10px;
    font-size: 10px;
    color: rgba(144, 147, 153, 0.5);
  }
  .btn {
    position: absolute;
    right: 40px;
  }
}
</style>