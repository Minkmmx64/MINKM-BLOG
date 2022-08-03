(async () => {
    const webSocket = require('websocket').server;
    const logger = require("./Utils/logger");
    const http = require('http').createServer().listen(8002, () => {
        console.log('sever start :8002');
    });
    const db = require("./dao/mongoDb");
    const fs = require("fs");
    const { Client,/* MONGO_CONFIG ,*/ MONGO_PATH } = require('./dao/connect.config');
    const ws = new webSocket({ httpServer: http, autoAcceptConnections: false });
    const DAO = require("./dao/redis");
    const mongoodb = require('mongoose');
    const OsComment = require("./Utils/os");
    Client.on('connect', () => { console.log('REDIS connect success'); })
        .on('error', () => { console.log('REDIS connect error'); });

    let socketConnectionpool = [];                //获取socket连接数
    let userHashMap = new Map();                  //保存用户ID映射
    let userIsOnline = [];                        //保存在线用户头像，用户名

    /**
      @param avatar                   //用户头像
      @param uname                   //用户名
      @param onLineTime             //在线时间戳
    */

    try {
        await mongoodb.connect(MONGO_PATH/**, MONGO_CONFIG */);
        console.log('MONGODB connect success');
        process.send({ Msg: "SUCCESS" });
    } catch (error) {
        console.log('MONGODB connect error');
        logger.error(error);
        process.send({ Msg: "ERROR" });
        process.abort();
    }
    /**
     * @param {数据} document 
     * @param {连接池} Connectionpool 
     */
    function CHATSENDAPPLY(document, Connectionpool) {     //好友申请方法
        //查找是否已经是好友
        db.UserAddMod
            .findOne({ username: document.username, send_username: document.send_username })
            .where('state').equals(1)
            .exec((err, doc) => {

                if (doc === null) {

                    //不是好友  P1正在申请，不需要发消息，P2 第一次申请发消息
                    db.UserAddMod
                        .findOne({ username: document.username, send_username: document.send_username })
                        .where('state').equals(0)
                        .exec((err, doc) => {
                            //是否正在申请 P1正在申请 P2第一次申请
                            if (doc === null) {

                                db.UserAddMod
                                    .findOne({ username: document.send_username, send_username: document.username })
                                    .where('state').equals(0)
                                    .exec((err, doc) => {
                                        if (doc === null) {

                                            db.UserAddMod.create({
                                                username: document.username,
                                                send_username: document.send_username,
                                                state: 0,
                                                creat_time: new Date
                                            });

                                            let data = {
                                                send: document.send_username,
                                                uname: document.username,
                                                emit: 'CHATSENDAPPLY'
                                            };
                                            //先给在线的所有用户发好友申请，过滤掉不相关的用户
                                            setTimeout(() => {
                                                Connectionpool.forEach(ele => {
                                                    ele.send(JSON.stringify(data));
                                                });
                                            }, 300);
                                        } else {
                                            console.log('对方给你发送好友邀请，请接受');
                                        }
                                    });
                            } else {
                                //正在申请不需要发消息
                                console.log('正在申请中');
                            }
                        });
                } else {
                    console.log('已经是好友了');
                }
            });
    }
    /**
     * @param {数据} document 
     * @param {连接} Connectionpool 
     */
    function ChatAcceptApply(document, Connectionpool) {     //是否接受申请     

        console.log(document);
        //state为1表示接受，0表示拒绝

        if (document.state === 1) {
            console.log(`${document.username}接受了${document.send_username}的好友申请`);
            //查找是否第一次申请，对方并未接受或拒绝
            db.UserAddMod
                .findOne({ username: document.send_username, send_username: document.username })
                .where('state').equals(0)
                .exec((err, doc) => {
                    if (doc !== null) {
                        //是第一次插入另一种状态
                        db.UserAddMod.create({
                            username: document.username,
                            send_username: document.send_username,
                            state: 0,
                            creat_time: new Date
                        }).then(data => {
                            //修改双方状态为1
                            if (data) {

                                db.UserAddMod.updateOne({ state: 1 })
                                    .where('username').equals(document.send_username)
                                    .where('send_username').equals(document.username)
                                    .exec((err, doc) => {
                                        if (doc) {
                                            logger.debug(`修改${document.send_username}和${document.username}的状态为1`);
                                        } else {
                                            logger.warn(`修改状态错误 :${err}`);
                                        }
                                    });

                                db.UserAddMod.updateOne({ state: 1 })
                                    .where('username').equals(document.username)
                                    .where('send_username').equals(document.send_username)
                                    .exec((err, doc) => {
                                        if (doc) {
                                            logger.debug(`修改${document.send_username}和${document.username}的状态为1`);
                                        } else {
                                            logger.warn(`修改状态错误 :${err}`);
                                        }
                                    });
                            }
                        }).catch(error => {
                            logger.warn(`请求错误${error}`);
                        });
                    } else {

                        //如果不是第一次申请则直接修改双方状态，不需要添加
                        db.UserAddMod.updateOne({ state: 1 })
                            .where('username').equals(document.send_username)
                            .where('send_username').equals(document.username)
                            .exec((err, doc) => {
                                if (doc) {
                                    logger.debug(`修改${document.send_username}和${document.username}的状态为1`);
                                } else {
                                    logger.warn(`修改状态错误 :${err}`);
                                }
                            });

                        db.UserAddMod.updateOne({ state: 1 })
                            .where('username').equals(document.username)
                            .where('send_username').equals(document.send_username)
                            .exec((err, doc) => {
                                if (doc) {
                                    logger.debug(`修改${document.send_username}和${document.username}的状态为1`);
                                } else {
                                    logger.warn(`修改状态错误 :${err}`);
                                }
                            });
                    }
                });

            //查询2个用户的头像
            db.UserRegistMod.find({
                $or:
                    [
                        { username: document.username },
                        { username: document.send_username }
                    ]
            }).exec((err, doc) => {
                if (err) {
                    logger.warn(`查询头像错误 :${err}`);
                } else {
                    let img1, img2;

                    doc.forEach(ele => {
                        if (ele.username === document.username) {     //接收方的头像
                            img1 = ele.imgUrl;
                        } else {
                            img2 = ele.imgUrl;                  //申请方的头像
                        }
                    });

                    let data = {
                        emit: 'CHATACCEPTAPPLY',
                        user1: document.username,
                        u1ImgUrl: img1,
                        user2: document.send_username,
                        u2ImgUrl: img2
                    };

                    setTimeout(() => {
                        Connectionpool.forEach(ele => {
                            ele.send(JSON.stringify(data));
                        });
                    }, 300);
                }
            });
        } else {
            //拒绝则删除这条申请
            db.UserAddMod.deleteOne({ username: document.send_username })
                .then((doc) => {
                    logger.debug(`删除${document.send_username}的好友请求 ${doc}`);
                }).catch(error => {
                    logger.warn(error);
                });
        }
    }

    /**
     * @param {数据} document 
     * @param {连接} Connectionpool 
     */
    function ChatAcceptMessage(document, Connectionpool) {

        let data = {
            emit: 'CHATACCEPTMESSAGE',
            value: document.value,                   //头像
            uname: document.uname,                   //发送方
            create_at: document.send_time,           //时间
            send_username: document.send_username,  //接收方
            msg: document.send_msg,
            types: document.types
        };

        db.UserFriendMsgMod.create({
            username: document.uname,                //我
            friend: document.send_username,          //好友       
            create_at: document.send_time,
            state: 0,                                //状态0表示我向他发消息,1表示他向我发消息
            msg: document.send_msg,                   //消息内容
            types: document.types
        });

        db.UserFriendMsgMod.create({
            username: document.send_username,        //我
            friend: document.uname,                  //好友    
            create_at: document.send_time,
            state: 1,                                //状态0表示我向他发消息,1表示他向我发消息
            msg: document.send_msg,                   //消息内容
            types: document.types
        });

        setTimeout(() => {
            Connectionpool.forEach(ele => {
                ele.send(JSON.stringify(data));
            });
        }, 0);
    }

    /**
     * @param {用户唯一ID} USERNAME 
     * @param {连接实例} connection 
     * @param {全部用户} Connectionpool
     */
    function judgeRepeatlogin(USERNAME, connection, Connectionpool) {

        //将上线用户的用户名和头像保存
        db.UserRegistMod.findOne()
            .select('imgUrl')
            .where('username').equals(USERNAME)
            .exec(async (err, UserRegistData) => {

                if (UserRegistData) {

                    let userInfo = {
                        avatar: UserRegistData['imgUrl'],  //用户头像
                        uname: USERNAME,                   //用户名
                        onLineTime: new Date().getTime()   //在线时间戳
                    };
                    console.log(userHashMap);
                    if (userHashMap.get(USERNAME) === undefined) {
                        //添加到在线用户
                        userIsOnline.push(userInfo);
                        //添加到userHashMap
                        userHashMap.set(USERNAME, connection);
                        //用户第一次登陆
                        console.log(`${USERNAME}上线了`);
                        //上线用户添加到redis里
                        let info = {
                            USERNAME: USERNAME,
                            avatar: UserRegistData['imgUrl']
                        };
                        try {
                            let MaxOnlineUserCount = __dirname + "/MaxOnlineUserCount.txt";
                            try {
                                let Max = fs.readFileSync(MaxOnlineUserCount, "utf-8");
                                let MaxCount = parseInt(Max);
                                DAO.Sadd(DAO.UserOnlineList, JSON.stringify(info));
                                let ok = await DAO.Smembers(DAO.UserOnlineList);
                                ok = Object.prototype.toString.call(ok) === "[object Array]" ? ok.length : 0;
                                if (ok > MaxCount) {
                                    try {
                                        fs.writeFileSync(MaxOnlineUserCount, ok.toString());
                                        logger.info(`[文件MaxOnlineUserCount统计最大在线人数成功],写入值:${ok}`);
                                        OsComment();
                                    } catch (error) {
                                        logger.warn(`[文件MaxOnlineUserCount写入失败],{文件路径}::${MaxOnlineUserCount}` + error);
                                    }
                                }

                                let Dok = await DAO.Smembers(DAO.UserOnlineList);
                                let DD = [];
                                Dok.forEach(v => {
                                    DD.push(JSON.parse(v));
                                });
                                let data = {
                                    emit: 'USERISLOGIN',
                                    msg: `${USERNAME}上线了`,
                                    uname: USERNAME,
                                    onLineCount: DD.length,    //在线用户
                                    onLineMessage: DD,     //用户信息
                                    avatar: UserRegistData['imgUrl'],
                                    info: ok
                                };
                                //广播用户上线
                                setTimeout(() => {
                                    Connectionpool.forEach(element => {
                                        element.send(JSON.stringify(data));
                                    });
                                }, 1000);
                            } catch (error) {
                                logger.warn(`[文件MaxOnlineUserCount读取失败],{文件路径}::${MaxOnlineUserCount}` + error);
                            }
                        } catch (error) {
                            logger.warn("[用户上线失败]" + error);
                        }
                    } else {
                        //用户已登陆,发送消息，并重新覆盖连接
                        let Emit = userHashMap.get(USERNAME);
                        let data = {
                            emit: 'REPEATLOGIN',
                            msg: '账号在别处登陆'
                        };
                        //给当前用户发送重新登陆消息
                        Emit.send(JSON.stringify(data));
                        //重新连接
                        userHashMap.set(USERNAME, connection);

                        //重新登录刷新消息
                        let NewEmit = userHashMap.get(USERNAME);

                        let NewData = {
                            emit: 'USERISLOGIN',
                            msg: `${USERNAME}上线了`,
                            uname: USERNAME,
                            onLineCount: userHashMap.size,    //在线用户
                            onLineMessage: userIsOnline,     //用户信息
                            avatar: UserRegistData['imgUrl']
                        };

                        NewEmit.send(JSON.stringify(NewData));
                    }
                } else {
                    logger.warn(`${USERNAME}的头像查找失败---${err}`);
                }
            });
    }

    /**
     * @param {监听下线用户} EMITDATA 
     * @param {全局在线状态} Connectionpool 
     */
    async function USEROFFLINE(EMITDATA, Connectionpool) {

        let userName = EMITDATA.userName; //下线用户

        //删除该用户
        if (userHashMap.get(userName)) {
            //寻找下线用户
            let key = undefined;
            for (let i = 0; i < userIsOnline.length; i++) {
                if (userIsOnline[i].uname !== undefined && userIsOnline[i].uname === userName) {
                    key = i;
                    break;
                }
            }

            //删除下线用户
            if (key !== undefined) {

                let data = {
                    USERNAME: userIsOnline[key].uname,
                    avatar: userIsOnline[key].avatar
                };

                try {
                    DAO.Srem(DAO.UserOnlineList, JSON.stringify(data));
                    userIsOnline.splice(key, 1);
                    userHashMap.delete(userName);

                } catch (error) {
                    logger.warn("[用户下线删除失败]" + error + "[USERINFO]:::" + data);
                }
            }

            let Dok = await DAO.Smembers(DAO.UserOnlineList);
            let DD = [];
            Dok.forEach(v => {
                DD.push(JSON.parse(v));
            });

            let SOCKETDATA = {
                emit: 'USEROFFLINE',
                uname: userName,
                onLineCount: DD.length,
                onLineMessage: DD,     //用户信息
            };

            setTimeout(() => {
                Connectionpool.forEach(data => {
                    data.send(JSON.stringify(SOCKETDATA)); //广播该用户下线了
                });
            }, 1000);

        } else {
            console.log('该用户已下线');
        }
    }

    /**
     * @param {世界聊天参数} EMITDATA 
     * @param {连接实例} connection 
     */
    function GOLBALMESSAGE(EMITDATA, connection) {

        //将消息插入到数据库
        const createdGolbalMsg = async () => {
            try {
                await db.GolbalUserMsgMod.create({
                    username: EMITDATA.username,
                    avatar: EMITDATA.avatar,
                    content: EMITDATA.content,
                    created_at: EMITDATA.created_at,
                    types: EMITDATA.types
                });

                logger.debug(`${EMITDATA.username}向'golbal_msgs'插入了一条消息---${EMITDATA.content}'`);

            } catch (error) {
                logger.warn(`${EMITDATA.username}的消息---${EMITDATA.content}插入失败 ERROR:${error}`);
            }
        };
        createdGolbalMsg();

        let data = {
            username: EMITDATA.username,
            avatar: EMITDATA.avatar,
            content: EMITDATA.content,
            created_at: EMITDATA.created_at,
            types: EMITDATA.types,
            emit: 'GOLBALMESSAGE'
        };

        connection.forEach(element => {
            element.send(JSON.stringify(data));
        });
    }

    /**
     * @param {心跳数据} WSResponse 
     * @param {用户连接实例} connection 
     * @readonly 更新用户在线情况，10分钟过滤一次离开用户
     */

    function USERISONLINE(WSResponse, connection) {

        if (userHashMap.get(WSResponse.userName)) {
            userIsOnline.forEach(element => {
                if (element.uname === WSResponse.userName) {
                    element.onLineTime = new Date().getTime();
                }
            });

            let data = {
                emit: 'USERISONLINE',
                username: WSResponse.userName
            };

            connection.send(JSON.stringify(data));
        } else {
            console.log('该用户已下线');
        }
    }

    /**
     * 用户修改信息
     * @param {*} WSResponse 
     * @param {*} connection 
     */
    async function USEREDIT(WSResponse, socketConnectionpool) {
        //旧的用户头像和用户名
        let uname = null;
        let oldImg = null;

        //将之前的用户key删除
        userIsOnline.map(k => {
            if (k.uname === WSResponse.rname) {
                uname = k.uname;
                oldImg = k.avatar;
                userHashMap.delete(k.uname);
                userHashMap.set(WSResponse.rname);
            }
        });

        //将之前的用户信息删除
        userIsOnline = userIsOnline.filter(k => k.uname !== WSResponse.rname);
        
        let userInfo = {
            avatar: WSResponse.avatar,  //用户头像
            uname: WSResponse.user,                   //用户名
            onLineTime: new Date().getTime()   //在线时间戳
        };

        //保存新的用户信息
        userIsOnline.push(userInfo);

        let Dok = await DAO.Smembers(DAO.UserOnlineList);
        let DDs = [];
        Dok.forEach(v => {
            DDs.push(JSON.parse(v));
        });
        
        let SOCKETDATA = {
            emit: 'USEROFFLINE',
            uname: uname,
            onLineCount: DDs.length,
            onLineMessage: DDs,     //用户信息
        };

        //将之前用户下线
        setTimeout(() => {
            socketConnectionpool.forEach(data => {
                data.send(JSON.stringify(SOCKETDATA)); //广播该用户下线了
            });
        }, 1000);

        //将旧用户从redis删除
        let oldinfo = {
            USERNAME: WSResponse.rname,
            avatar: oldImg
        };
        DAO.Srem(DAO.UserOnlineList, JSON.stringify(oldinfo));

        //将新用户插入redis
        let info = {
            USERNAME: WSResponse.user,
            avatar: WSResponse.avatar
        };
        DAO.Sadd(DAO.UserOnlineList, JSON.stringify(info));

        //统计当前信息
        let ok = await DAO.Smembers(DAO.UserOnlineList);
        let DD = [];
        ok.forEach(v => DD.push(JSON.parse(v)));
        //将新用户上线
        let data = {
            emit: 'USERISLOGIN',
            msg: `${WSResponse.user}上线了`,
            USERNAME: WSResponse.user,
            onLineCount: DD.length,    //在线用户
            onLineMessage: DD,     //用户信息
            avatar: WSResponse.avatar,
            info: info
        };
        
        //广播用户上线
        setTimeout(() => {
            socketConnectionpool.forEach(element => {
                element.send(JSON.stringify(data));
            });
        }, 1000);
    }

    ws.on('request', async (request) => {
        //获取连接用户ID
        let USERNAME = request.resourceURL.query.uname;

        //判断连接用户是否有效
        if (USERNAME === '' || USERNAME === undefined || USERNAME === null) return;

        let findUser = await db.UserRegistMod.findOne({ username: USERNAME });

        //有效
        if (findUser) {
            //获取连接状态
            let connection = request.accept();
            //重复连接或者第一次上线
            judgeRepeatlogin(USERNAME, connection, socketConnectionpool);

            //保存每个实例，包括已经失去连接的实例
            socketConnectionpool.push(connection);

            connection.on('message', data => {

                //接受消息参数
                let WSResponse = JSON.parse(data.utf8Data);
                //打印参数
                console.log(WSResponse);

                //发送对应请求
                switch (WSResponse.emit) {
                    case 'CHATSENDAPPLY': {
                        let log = `${WSResponse.username}向${WSResponse.send_username}发送了一条好友申请`;
                        logger.debug(log);
                        CHATSENDAPPLY(WSResponse, socketConnectionpool);
                        break;
                    }
                    case 'CHATACCEPTAPPLY': {
                        let log = `${WSResponse.username}回应了${WSResponse.send_username}的好友申请`;
                        logger.debug(log);
                        ChatAcceptApply(WSResponse, socketConnectionpool);
                        break;
                    }
                    case 'CHATACCEPTMESSAGE': {
                        let log = `${WSResponse.uname}给${WSResponse.send_username}发送了一条消息---${WSResponse.send_msg}`;
                        logger.debug(log);
                        ChatAcceptMessage(WSResponse, socketConnectionpool);
                        break;
                    }
                    case 'USEROFFLINE': {
                        let log = `${WSResponse.userName}:::下线了`;
                        logger.debug(log);
                        USEROFFLINE(WSResponse, socketConnectionpool);
                        break;
                    }
                    case 'USERISONLINE': {       //每1分钟发送心跳包超时判定为下线
                        let log = `${WSResponse.userName}在线`;
                        logger.debug(log);
                        USERISONLINE(WSResponse, connection);
                        break;
                    }
                    case 'GOLBALMESSAGE': {
                        //接收世界聊天
                        GOLBALMESSAGE(WSResponse, socketConnectionpool);
                        break;
                    }
                    case "USERRLOAD": {
                        USERRLOAD(WSResponse, connection);
                        break;
                    }
                    case "USEREDIT": {
                        USEREDIT(WSResponse, socketConnectionpool);
                        break;
                    }
                }
            });
        }
    });
    /**
     * 同一个用户登录不同设备，踢出前一个设备，且他一直在线
     * @param {Object} WSResponse 
     * @param {USERONLINE} connection 
     */
    async function USERRLOAD(WSResponse, connection) {
        try {
            let ok = await DAO.Smembers(DAO.UserOnlineList);

            let data = {
                emit: 'USERRLOAD',
                data: ok,
                onLineTime: new Date().getTime()   //在线时间戳
            };

            connection.send(JSON.stringify(data));
        } catch (error) {
            logger.warn("[用户重复登录失败]" + error + "[USERINFO]:::" + WSResponse);
        }
    }
    setInterval(() => {
        if (userIsOnline.length && userIsOnline[0] !== undefined) {
            userIsOnline.forEach(element => {
                //时间间隔超过10分钟说明没有收到心跳包，判断下线
                if (element.onLineTime - (new Date().getTime()) > 1000 * 60 * 10) {

                    //如果他还在线，发送消息，让他下线
                    if (userHashMap.get(element.uname)) {

                        let key = undefined;

                        for (let i = 0; i < userIsOnline.length; i++) {
                            if (userIsOnline[i].uname !== undefined && userIsOnline[i].uname === element.uname) {
                                key = i;
                                break;
                            }
                        }//寻找下线用户

                        if (key !== undefined) {

                            let data = {
                                USERNAME: userIsOnline[key].uname,
                                avatar: userIsOnline[key].avatar
                            };

                            try {
                                DAO.Srem(DAO.UserOnlineList, JSON.stringify(data));
                                userIsOnline.splice(key, 1);
                                userHashMap.delete(element.uname);

                            } catch (error) {
                                logger.warn("[用户下线删除失败]" + error + "[USERINFO]:::" + data);
                            }
                        }

                        let SOCKETDATA = {
                            emit: 'USEROFFLINE',
                            uname: element.uname,
                            onLineCount: userHashMap.size,
                            onLineMessage: userIsOnline,     //用户信息
                        };

                        setTimeout(() => {
                            socketConnectionpool.forEach(WebSocketClient => {
                                WebSocketClient.send(JSON.stringify(SOCKETDATA));
                            });
                        }, 1000);

                        console.log(`[HeartConnection ------ing-----]:::${element.uname}已经离线`);

                    } else {
                        ///此时已经下线
                        console.log(`${element.uname}已经下线`);
                    }
                } else {
                    console.log(`[HeartConnection ------ing-----]:::${element.uname}正在线`);
                }
            });
        }
    }, 1000 * 60 * 5);
})();