import store from '@/store/index';
import UserLogin from '@/api/Modules/UserModules';
import { AxiosResponse } from 'axios';
import { leftMsgList } from '@/api/common/ChatBase';
import { WS_BASE_URL } from '@/api/ApiConfig';
import { GolbalUserMessage, socketData } from '@/api/common/ChatBase';
import { ElMessage } from 'element-plus';

/**
 * 加载好友消息，好友列表，申请列表,全局聊天消息
 */
export function LoadUserBaseInfo() {

    onLoadUserFriendTable(store.state.UserStatus.username);
    onLoadApplyTable(store.state.UserStatus.username);

    loadGolbalUserMessage();
    //如果用户登录时websocket依然存在说明用户在其他地方登录，不是第一次登录
    if (store.state.webSocket === null) {
        store.dispatch('GLOBAL_WSCREATED', `${WS_BASE_URL}?uname=${store.getters.getUserName}`);
    } else {
        //加载在线好友列表
        ElMessage.success("请稍后");
        let data = {
            emit: "USERRLOAD",
            send_time: new Date(),
            username: store.getters.getUserName
        } as socketData;
        setTimeout(() => {
            if (store.state.webSocket.readyState) {
                store.state.webSocket.send(JSON.stringify(data));
                ElMessage.success("连接成功");
            } else {
                ElMessage.error("socket连接错误，请重试");
                setTimeout(() => {
                    window.location.reload();
                    store.dispatch("AuthRemoveSync");
                }, 500);
            }
        }, 200);
    }
    store.state.webSocket.onopen = E => {
        //console.log('websocket 已经 连接');
    };
    store.state.webSocket.close = E => {
        // close...
    };

}

function onLoadUserFriendTable(param: string) {
    UserLogin.getUserFriend(param).then((document: AxiosResponse) => {
        console.log(document);
        
        store.state.userMsgList = changeFriendMsg(document.data.data);
    });
}

function onLoadApplyTable(param: string) {
    UserLogin.getUserApply(param).then((doc: { data }) => {
        store.state.userApply = doc.data.data;
    });
}

function changeFriendMsg(list: [{ username, imgUrl }]) {
    let data = <leftMsgList[]>[];
    list.forEach(ele => {
        let el = {
            name: ele[0].username,
            imgUrl: ele[0].imgUrl,
            lastMsg: '测试消息'
        } as leftMsgList;
        data.push(el);
    });
    return data;
}

function loadGolbalUserMessage() {

    UserLogin.selectGolbalUserChatMessage().then((data: { data: any }) => {

        let msg = data.data.data;

        let newValue = [] as GolbalUserMessage[];
        msg.forEach((element) => {
            let doc: GolbalUserMessage = {
                content: element.content,
                imgUrl: element.avatar,
                name: element.username,
                date: element.created_at,
                types: element.types
            };
            newValue.push(doc);
        });

        store.state.golbalUserMessage = newValue;

    }).catch(error => {
        ElMessage.error(error);
    });
}
