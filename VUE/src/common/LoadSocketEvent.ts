import { ElNotification, ElMessageBox } from 'element-plus';
import { Ref } from 'vue';
import store from '@/store';
import router from '@/router';
import { GolbalUserMessage, GolbalInfo } from '@/api/common/ChatBase';

export type enumEmit = 'CHATSENDAPPLY'
    | 'CHATACCEPTAPPLY'
    | 'REPEATLOGIN'
    | 'CHATACCEPTMESSAGE'
    | 'USEROFFLINE'
    | 'USERISLOGIN'
    | 'GOLBALMESSAGE'
    | 'USERRLOAD'
    | 'USEREDIT'

interface WebSocketMsg {
    emit: enumEmit;
    uname: string;
    send: string;
    user2: string;
    user1: string;
    u2ImgUrl: string;
    u1ImgUrl: string;
    msg: string;
    send_username: string;
    value: string;
    create_at: string;
    [praname: string]: any;
    data?: [];
}

interface EmitData {
    [praname: string]: any;
}

export function LoadSocketEvent(SendMsgData: Ref, username: Ref) {
    store.state.webSocket.onmessage = (data: EmitData) => {

        let SocketData = JSON.parse(data.data) as WebSocketMsg;

        //console.log(SocketData);

        //发送申请
        if (SocketData.emit === 'CHATSENDAPPLY') {
            let uname = SocketData.uname;       //接收方
            let send = SocketData.send;         //发送方
            if (store.state.UserStatus.username === send) {
                ElNotification({
                    title: '新的好友申请',
                    message: `${uname}请求添加你为好友`,
                });
                store.state.userApply.push({
                    username: uname,            //谁发起的好友申请
                });
            }
            //接受申请
        } else if (SocketData.emit === 'CHATACCEPTAPPLY') {

            if (store.state.UserStatus.username === SocketData.user1) {
                store.state.userMsgList.push({
                    name: SocketData.user2,
                    imgUrl: SocketData.u2ImgUrl,
                    lastMsg: '测试消息'
                });
            }

            if (store.state.UserStatus.username === SocketData.user2) {
                store.state.userMsgList.push({
                    name: SocketData.user1,
                    imgUrl: SocketData.u1ImgUrl,
                    lastMsg: '测试消息'
                });
            }
            //异地登录
        } else if (SocketData.emit === 'REPEATLOGIN') {

            let msg = SocketData.msg;
            store.state.status = 1;
            ElMessageBox.alert(msg, '重新登陆', {
                confirmButtonText: 'OK',
                callback: () => {
                    router.replace('/home');
                    store.dispatch('AuthRemoveSync');
                    window.location.reload();
                }
            });
            //发送接收消息
        } else if (SocketData.emit === 'CHATACCEPTMESSAGE' && SendMsgData.value !== null && username.value !== null) {
            let data = {
                imgUrl: SocketData.value,
                name: SocketData.uname,
                date: SocketData.create_at,
                sned_name: SocketData.send_username,
                content: SocketData.msg,
                types: SocketData.types
            };

            if (store.getters.getUserName === SocketData.send_username && SocketData.uname === username.value) {
                SendMsgData.value.push(data);
            }

            setTimeout(() => {
                let s = document.getElementById('contentScrollbar');
                s.scrollTop = s.scrollHeight;

            }, 100);
            //下线通知
        } else if (SocketData.emit === 'USEROFFLINE') {

            //在线用户信息
            store.commit('setGolbalUserInfo', SocketData.onLineMessage);

            store.commit('setOnlineCount', SocketData.onLineCount);


            //上线通知
        } else if (SocketData.emit === 'USERISLOGIN') {
            //在线用户信息
            store.commit('setGolbalUserInfo', SocketData.onLineMessage);
            //在线用户数量
            store.commit('setOnlineCount', SocketData.onLineCount);

        } else if (SocketData.emit === 'GOLBALMESSAGE') {


            let golbalOneMessageList: GolbalUserMessage = {
                content: SocketData.content,
                date: SocketData.created_at,
                imgUrl: SocketData.avatar,
                name: SocketData.username,
                types: SocketData.types
            };

            //添加到消息记录
            store.commit('setGolbalUserMessage', golbalOneMessageList);
            setTimeout(() => {
                let s = document.getElementById('worldMsgScrollbar');
                s.scrollTop = s.scrollHeight;

            }, 100);
        } else if (SocketData.emit === "USERRLOAD") {
            let info = [] as GolbalInfo[];
            SocketData.data.forEach((e: string) => {
                let d = JSON.parse(e);
                info.push({
                    USERNAME: d.USERNAME,
                    avatar: d.avatar
                });
            });
            store.commit('setGolbalUserInfo', info);
            //在线用户数量
            store.commit('setOnlineCount', info.length);
        }
    };
    return {
        SendMsgData,
    };
}