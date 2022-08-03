const { SecretKey, checkIp, convertApiName } = require('../common/index');
const { ApiResponse, Response } = require('./response');
const jwt = require('jsonwebtoken');
const { logger } = require("../Utils/log");
const db = require('../config/mongoDbServer');
const { monitorService } = require("../services/monitorService");
const moment = require("moment");
let whiteList = ['/user/regist', '/user/login', '/user/verify_name', '/blog/leave/msg', '/auth/vcode/img','/user/info'];
//判断用户认证
const AuthRouter = (req, res, next) => {
    //增删改需要用户认证
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        if (!whiteList.includes(req._parsedUrl.pathname)) {
            if (typeof req.headers.authtoken === 'string') {
                let token = req.headers.authtoken;
                jwt.verify(token, SecretKey, (err, decoded) => {
                    if (err) {
                        ApiResponse(new Response(403, '认证失败', null, null, res));
                    } else {
                        console.log('认证成功', decoded);
                        console.log("remoteAddress = " + req.connection.remoteAddress);
                        console.log("ip = " + req.ip);
                        next();
                    }
                });
            } else {
                ApiResponse(new Response(403, '认证失败', null, null, res));
            }
        } else next();
    } else next();
};

//用户权限操作
const AdmissionAction = (req, res, next) => {
    if ((req.headers.admission !== undefined) &&
        (typeof req.headers.admission === "string") &&
        (req.headers.admission === "Admission") &&
        (!whiteList.includes(req._parsedUrl.pathname))
    ) {
        console.log('此操作需要管理员权限');
        jwt.verify(req.headers.authtoken, SecretKey, (err, decoded) => {
            if (err) {
                ApiResponse(new Response(401, '认证失败', null, null, res));
            } else {
                let username = decoded.username;
                db.UserRegistMod.findOne({ username: username }).then(d => {
                    if (typeof d.admission === "number" && d.admission === 1) {
                        next();
                    } else ApiResponse(new Response(403, '没有权限', null, null, res));
                }).catch(e => {
                    ApiResponse(new Response(500, e, null, null, res));
                });
            }
        });
    }
    else next();
};

//记录接口请求IP地址
const ApiCollection = async (req, res, next) => {
    //获取请求进入时间
    req.setTimes = new Date().getTime();
    //获取ip
    let UserIp = req.connection.remoteAddress === "::1" ? "127.0.0.1" : req.connection.remoteAddress;
    //获取接口名称
    let ApiName = req._parsedUrl.pathname;
    //去除前缀
    UserIp = UserIp.replace(/::ffff:/, '');
    //判断ip网络
    let IpFlag = checkIp.test(UserIp) ? "内网" : "外网";
    if (UserIp === "127.0.0.1") IpFlag = "本地主机";
    //过滤一些不需要记录次数的请求(乱写的)
    let chat = /^\/chat/;
    if (chat.test(ApiName) || (
        (req.method === "GET") && (ApiName === '/blog/comment/parise'
            || ApiName === '/client/get/article' || ApiName === '/blog/get/hot/article'
            || ApiName === '/blog/get/categorie' || ApiName === "/client/home/article"
            || ApiName === '/blog/get/label' || ApiName === "/blog/get/all/article"
            || ApiName === "/admin/monitor" || ApiName === "/front/admin/info"
            || ApiName === "/client/get/detali" || ApiName === "/blog/get/client/webshare"
            || ApiName === "/blog/get/WebCategories" || ApiName === "/blog/get/webshare"
        ))
    )
        next();
    else {
        //防止频繁请求
        let k = `${UserIp}/${ApiName}/${req.method}`;
        if (await monitorService.IpLimit(k, res)) {
            next();
        }
    }
    res.once('close', async () => {
        let endTimes = new Date().getTime() - req.setTimes;
        let Time = moment().format("YYYY-MM-DD HH:mm:ss");
        let ConvertApi = (convertApiName[ApiName] === null || convertApiName[ApiName] === undefined) ? '其他' : convertApiName[ApiName];
        logger.error(`[Name]||[Method]||[IP]||[NetWork]||[Consuming]||[Device]||[Date]
                      [请求URL-->${ApiName}]
                      [接口名称-->${ConvertApi}]
                      [请求方式-->${req.method}]
                      [请求IP-->${UserIp}]
                      [请求网络-->${IpFlag}]
                      [请求耗时-->${endTimes}ms]
                      [请求设备-->${req.headers['user-agent']}]
                      [请求时间-->${Time}]`);
        //将请求方式和请求时间记录下来
        await monitorService.ApiMethodsAndTime(req.method, Time, ConvertApi);
        //统计近N次Api请求情况
        if (req.method === "GET") monitorService.ApiCount(ApiName, endTimes);
    });
};

module.exports = {
    AuthRouter,
    AdmissionAction,
    ApiCollection
};