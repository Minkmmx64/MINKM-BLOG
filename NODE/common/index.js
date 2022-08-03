const moment = require('moment');
const SecretKey = 'mjw';

exports.Date = moment().format("YYYY M D H m");

const Snowflake = function () {
    let T = new Date().getTime();
    let char = "HelloWorld";
    let strForTime = T.toString().split('');
    let strForChar = char.split('');
    let result = '';
    while (strForTime.length || strForChar.length) {
        if (strForTime.length) {
            let random = Math.floor(Math.random() * strForTime.length);
            result += strForTime[random];
            strForTime.splice(random, 1);
        }
        if (strForChar.length) {
            let random = Math.floor(Math.random() * strForChar.length);
            result += strForChar[random];
            strForChar.splice(random, 1);
        }
    }
    return result;
};

function getRandomNum(length) {
    return Math.floor(Math.random() * length);
}

/**
 * @param {Number} authLength 生成指定位数随机字符串
 */
function randomString(authLength) {
    let Arr = "ghj390<>!@#qVNEU‘；。、FGDTSPVwertyui【o^&QCIMVP】、E|*(pklz12asdfxcPZADv45678bnm[];,.$%)_+~";
    let res = "";
    Arr = Arr.split("");
    while (authLength) {
        res += Arr[Math.floor(Math.random() * Arr.length)];
        authLength--;
    }
    return res;
}

const userNameRegEx = /^\w{6,20}$/;           //6-20个包含数字英文下划线的用户名
const userNicknameRegEx = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$/;                //2-20个包含中英文数字下划线的昵称
const userPhoneRegEx = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/; //手机号
const userPsdRegEx = /^[A-Za-z0-9]{6,20}$/;                //密码6-10位英文数字
const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/; // 匹配网址
const checkIp = /(^192)|(^172)|(^10\.)/;//判断内网IP,外网IP

const convertApiName = {
    "/qiniu/upoad": "七牛上传",
    "/chat/friend/list": "好友列表",
    "/chat/firend/apply": "好友申请",
    "/chat/friend/msg": "好友消息",
    "/chat/golbal/message": "聊天室消息",
    "/blog/get/categorie": "文章分类",
    "/blog/get/hot/article": "单条文章",
    "/blog/get/all/article": "文章列表",
    "/blog/get/label": "获取标签",
    "/blog/get/recovery/article": "有效文章",
    "/user/info": "用户信息",
    "/client/get/article": "首页文章列表",
    "/blog/comment/parise": "评论点赞",
    "/blog/detail/article": "文章详情",
    "/blog/get/webshare": "网页分享",
    "/blog/get/client/webshare": "网页分享",
    "/blog/detail/comment": "评论详情",
    "/blog/get/banner": "轮播图",
    "/client/get/file": "归档",
    "/blog/leave/msg": "留言板",
    "/auth/vcode/img": "图片验证码",
    "/front/admin/info": "首页信息",
    "/admin/monitor": "后台监控",
    "/chat/upload/img/head": "上传头像",
    "/blog/post/categorie": "创建分类",
};

module.exports = {
    SecretKey,
    Snowflake,
    userNameRegEx,
    userNicknameRegEx,
    userPhoneRegEx,
    userPsdRegEx,
    checkUrl,
    getRandomNum,
    randomString,
    checkIp,
    convertApiName
};


