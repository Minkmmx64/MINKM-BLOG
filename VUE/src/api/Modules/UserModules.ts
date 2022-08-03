import { registError } from '../common/checkUserRegist';
import { ElMessage } from 'element-plus';
import { getAxios } from '../config';
import { IUserLogin, IUserRegist } from '../common/ChatBase';
import { LoadUserBaseInfo } from '@/common/LoadUserBaseInfo';
import { LoadSocketEvent } from '@/common/LoadSocketEvent';
import store from '@/store';
import { AxiosResponse } from 'axios';
import { DataModule } from './DataModule';
class UserLogin extends DataModule<UserLogin>{
    /*
     * @param params
     * @returns
     * 发起登录请求
     */
    public postLogin(params: IUserLogin) {

        return new Promise((resolve, reject) => {
            getAxios().post('/user/login', { params }).then(doc => {

                if (doc.data.state === 200) {
                    ElMessage.success('登录成功');
                    resolve(doc.data);
                } else {
                    ElMessage.error('登录失败，用户名不存在或者密码错误');
                    reject(doc.data);
                }
            }).catch(e => { reject(e); });
        });
    }
    /**
     * @param params
     * @returns
     * 发起注册请求
     */
    public postRegist(params: IUserRegist) {
        if (!registError(params)) {
            return false;
        }
        else {
            getAxios().post('/user/regist', { params }).then(doc => {
                if (doc.data.state === 200) {
                    ElMessage.success('注册成功');
                } else {
                    ElMessage.error('注册失败，用户名重复');
                }
            }).catch(e => { ElMessage.error(e); });
        }
    }
    /**
     * @param param
     * @returns
     * 获取用户好友列表
     */
    public getUserFriend(param: string) {
        return new Promise((resolve, reject) => {
            getAxios().get(`/chat/friend/list`, {
                params: { uname: param }
            }).then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * @param param
     * 获取用户好友申请表
     */
    public getUserApply(param: string) {
        return new Promise((resolve, reject) => {
            getAxios().get(`/chat/firend/apply`, {
                params: { uname: param }
            }).then(doc => {
                resolve(doc);
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * @param param 用户名
     * 查找用户名是否存在
     */
    public postVerifyUserName(param: string) {
        return new Promise((resolve, reject) => {
            getAxios().post('/user/verify_name', { param }).then(doc => {
                if (doc.data.state === 200) {
                    resolve(true);
                } else reject(false);
            }).catch(e => { reject(e); });
        });
    }
    /**
     * 获取好友消息记录
     * @param username
     * @param send_uname
     * @returns {Promise}
     */
    public getUserFriendMsg(username: string, send_uname: string) {
        return new Promise((resolve, reject) => {
            getAxios().get('/chat/friend/msg', {
                params: {
                    u_name: username,
                    s_name: send_uname
                }
            }).then(data => { resolve(data.data); })
                .catch(e => { reject(e); });
        });
    }
    /**
     * 登录加载
     */
    public setUserInfoStorageSync(data) {
        store.state.UserStatus = data;
        store.dispatch('AuthSetStorageSync', data.u_token);
        LoadUserBaseInfo();
        LoadSocketEvent(null, null);//在VUE界面接受socket事件
    }

    /**
    * 获取全局聊天记录
    */
    public selectGolbalUserChatMessage() {
        return new Promise((resolve, reject) => {
            getAxios().get('/chat/golbal/message').then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * 获取拼图验证码
     * @returns {Promise}
     */
    public getAuthVcodeImg(): Promise<AxiosResponse<UserLogin>> {
        return getAxios().get('/auth/vcode/img');
    }

    /**
     * 验证拼图验证码
     * @param str 
     * @returns {Promise}
     */
    public postAuthVcodeImg(str: string, id: string): Promise<AxiosResponse<UserLogin>> {
        return getAxios().post(`/auth/vcode/img`, { code: str, auth: id });
    }
}
export default new UserLogin();
