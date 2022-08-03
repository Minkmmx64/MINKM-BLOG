<template>
  <div class="user-head mjw-flex-column" v-if="store.state.UserStatus">
    <div class="head mjw-flex-column">
      <el-upload
        class="upload-demo"
        method="POST"
        name="img"
        action=""
        :show-file-list="false"
        :http-request="MyUpLoadImg"
      >
        <el-button :icon="Upload" type="primary" size="small">更换头像</el-button>
      </el-upload>
      <div class="demo-image__preview">
        <el-image
          style="width: 100px; height: 100px;margin-top:5px;border-radius:5px"
          :src="
            store.getters.getUserImgurl == ''
              ? 'src/static/wx.png'
              : store.getters.getUserImgurl
          "
          :preview-src-list="srcList"
          :initial-index="0"
          fit="cover"
        >
        </el-image>
      </div>
      <div class="update">用户名:{{store.getters.getUserName}}</div>
      <div class="update">昵称:{{ store.getters.getUserNick }}</div>
      <div class="update">性别:&nbsp;&nbsp;&nbsp;&nbsp;<a-badge :status="store.getters.getUserSex == 1 ? 'success' : 'error'" :text="store.getters.getUserSex == 1 ? '男' : '女'" /></div>
      <div class="update">手机号:{{ store.state.UserStatus.userphone }}</div>
      <el-button :icon="Share" type="primary" @click="handleEdit">编辑资料</el-button>
    </div>
    <a-modal 
      :confirm-loading="confirmLoading"
      v-model:visible="isEditing" centered @ok="handleOK"> 
      <a-form-item label="用户名">
        <a-input v-model:value="SearchFrom.user" placeholder="username" />
      </a-form-item>
      <a-form-item label="昵称">
        <a-input v-model:value="SearchFrom.nick" placeholder="nickname" />
      </a-form-item>
      <a-form-item label="性别">
        <a-switch checked-children="男" un-checked-children="女" v-model:checked="SearchFrom.sex" />
      </a-form-item>
      <a-form-item label="手机号">
        <a-input v-model:value="SearchFrom.phone" placeholder="moblie phone" />
      </a-form-item>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { ElMessage } from "element-plus";
import store from "@/store";
import { getAxios } from "@/api/config";
import { Share,Upload } from '@element-plus/icons-vue';
import UserInfoApi,{UserInfo} from "@/api/Modules/UserInfoModule";
import { socketData } from "@/api/common/ChatBase";
export default defineComponent({
  setup() {
    const confirmLoading = ref(false);
    const isEditing = ref(false);
    const SearchFrom = ref({
      user: null,
      nick: null,
      sex: null,
      phone: null,
      rname: null,
    }) as unknown as Ref<UserInfo>;
    /**
     * 上传图片之前
     */
    function MyUpLoadImg(param: { file: File }) {
      setTimeout(() => {
        if (
          param.file.type !== "image/jpeg" &&
          param.file.type !== "image/png" &&
          param.file.type !== "image/jpg"
        ) {
          ElMessage.error("格式错误");
          return false;
        } else {
          let formData = new FormData();
          formData.append("img", param.file);
          formData.append("uname", store.getters.getUserName);
          getAxios()
            .post("/chat/upload/img/head", formData)
            .then((document) => {
              store.commit("setUserImg", document.data.data);
            }).catch( error => { ElMessage.error(error); });
        }
      }, 800);
    }

    function handleEdit(){
      isEditing.value = true;
      SearchFrom.value.user = store.getters.getUserName;
      SearchFrom.value.nick = store.getters.getUserNick;
      SearchFrom.value.sex  = store.getters.getUserSex === 1 ? true : false;
      SearchFrom.value.phone = store.state.UserStatus.userphone;
      SearchFrom.value.rname = store.getters.getUserName;
    }

    function handleOK(){
      confirmLoading.value = true;
      UserInfoApi.UpdateUserInfo(SearchFrom.value).then( data => {
        setTimeout(() => {
          isEditing.value = false;
          confirmLoading.value = false;
          if(data.data.state === 200){
            ElMessage.success(data.data.msg);
            store.state.UserStatus.userphone = SearchFrom.value.phone;
            store.state.UserStatus.sex = SearchFrom.value.sex ? 1 : 0;
            store.state.UserStatus.username = SearchFrom.value.user;
            store.state.UserStatus.nickname = SearchFrom.value.nick;
            //修改信息发送websocket将原来用户状态删除
            let Data:socketData = {
              emit: "USEREDIT",
              rname: SearchFrom.value.rname,
              user: SearchFrom.value.user,
              avatar: store.getters.getUserImgurl,
              send_time: new Date()
            };
            store.state.UserStatus.username = SearchFrom.value.user;
            store.state.webSocket.send(JSON.stringify(Data));
          }else{
            ElMessage.error(data.data.msg);
          }
        }, 800);
      }).catch( error => {
        ElMessage.error(error);
      });
    }

    const srcList = [store.getters.getUserImgurl];
    return {
      store,
      MyUpLoadImg,
      srcList,
      Share,
      Upload,
      isEditing,
      SearchFrom,
      handleEdit,
      handleOK,
      confirmLoading
    };
  },
});
</script>

<style scoped lang="less">
.user-head {
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 780px;
  width: 700px;
  .head {
    margin-top: 20px;
    width: 200px;
    flex: auto;
    align-items: center;
    img {
      width: 50px;
    }
  }
}
.update{
  cursor: pointer;
  margin-top:5px;
}

.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>