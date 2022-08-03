import { createStore } from 'vuex';
import { IUserStatus, leftMsgList, userApply, GolbalInfo, GolbalUserMessage } from '@/api/common/ChatBase';
export default createStore({
    state: {
        UserStatus: null as IUserStatus,           //用户信息
        userMsgList: [] as leftMsgList[],        //一对一消息列表
        userApply: [] as userApply[],              //好友申请
        webSocket: null as WebSocket,           //全局ws实例
        golbalOnlineCount: 0 as number,               //在线用户,
        golbalUserInfo: [] as GolbalInfo[],          //用户信息,
        golbalUserMessage: [] as GolbalUserMessage[],    //消息记录,
        status: 0
    },
    getters: {
        getUserImgurl: state => state.UserStatus.imgUrl,
        getUserName: state => state.UserStatus.username,
        getUserNick: state => state.UserStatus.nickname,
        getUserSex: state => state.UserStatus.sex,
        getAuthToken: state => state.UserStatus.u_token,
        getGolbalOnlineCount: state => state.golbalOnlineCount,
        getGolbalUserInfo: state => state.golbalUserInfo,
        getGolbalUserMessage: state => state.golbalUserMessage,
    },
    mutations: {
        BASE_WSCONNECT(state, WS) { state.webSocket = WS; },
        setUserImg(state, url) { state.UserStatus.imgUrl = url; },
        AuthRemove() {
            sessionStorage.removeItem('u_token');
            sessionStorage.removeItem('userMsg');
        },
        AuthSetStorage(state, data) {
            sessionStorage.setItem("u_token", data);
            sessionStorage.setItem("userMsg", JSON.stringify(state));
        },
        setOnlineCount(state, total) {
            state.golbalOnlineCount = total;
        },
        setGolbalUserInfo(state, data: GolbalInfo[]) {
            state.golbalUserInfo = data;
        },
        setGolbalUserMessage(state, message) {
            state.golbalUserMessage.push(message);
        }
    },
    actions: {
        GLOBAL_WSCREATED(store, action) {
            store.commit('BASE_WSCONNECT', new WebSocket(action));
        },
        AuthRemoveSync(store) {
            store.commit('AuthRemove');
        },
        AuthSetStorageSync(store, data) {
            store.commit('AuthSetStorage', data);
        },
    }
});
