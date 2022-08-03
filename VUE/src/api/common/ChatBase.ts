import { enumEmit } from "@/common/LoadSocketEvent";

/**
 * 消息
 */
type msgType = 'images' | 'text'
export interface userSendMsgData {

    name: string;

    types: msgType;

    date: string;

    content: string;

    sned_name: string;

    state?: number;

    imgUrl?: string;
}
/**
 * 好友列表
 */
export interface leftMsgList {

    date?: string

    lastMsg?: string

    name: string

    imgUrl?: string
}
/**
 * UserStatus
 */
export interface IUserStatus {

    create_time: string,

    imgUrl: string,

    nickname: string,

    sex: number,

    u_token: string,

    update_time: string,

    username: string,

    userphone: string,

    userpsd: string,

    admission: number
}
/**
 * 好友申请
 */
export interface userApply {

    imgUrl?: string,

    username: string,

    nickname?: string,
}
/**
 * socket 事件参数
 */
export interface socketData {

    emit: enumEmit,

    send_time: unknown,

    [praname: string]: unknown
}
/**
 * 登录
 */
export interface IUserLogin {

    uname: string,

    psd: string
}
/**
 * 注册
 */
export interface IUserRegist {

    uname: string,

    phone: string,

    psd: string,

    bpsd: string

    nickname: string
}

/**
 * 在线用户
 */
export interface GolbalInfo {
    avatar: string,
    USERNAME: string
}

/**
 * 全局用户消息
 */

export interface GolbalUserMessage {
    content: string,
    date: string,
    imgUrl: string,
    name: string,
    types: msgType
}