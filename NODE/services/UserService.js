const { UserRegistMod,UserAddMod,UserFriendMsgMod,BlogCommentPraiseMod,BlogCommentMod,BlogMessageBoardMod,GolbalUserMsgMod } = require('../config/mongoDbServer');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');
const fs = require("fs");
const path = require("path");
const game = require("../Utils/gm");
const { getRandomNum, randomString } = require("../common/index");
const ImageAuthVcode = require("../dao/ImageVcodeTable");
/**
* 判断用户名重复
*/
async function verifyuserRegist(uname) {
    let verify = await UserRegistMod.findOne({ username: uname });
    if (verify === null) {
        return true;
    }
    return false;
}

/**
* 插入文档
*/
async function InsertUserCollection(data) {
    return await UserRegistMod.create(data);
}
exports.UserService = {

    userInfo: async (limit, current, res) => {

        try {

            let count = await UserRegistMod.estimatedDocumentCount();

            UserRegistMod.find().select('nickname username sex userphone imgUrl update_time create_time admission')
                .skip(limit * (current - 1)).limit(10).exec((err, data) => {
                    if (data) {
                        ApiResponse(new Response(200, '用户信息查找成功', data, { count: count }, res));
                    } else {
                        throw new Error('网络错误');
                    }
                });
        } catch (error) {
            ApiResponse(new Response(500, error, null, null, res));
        }
    },
    userRegist: async function (params, token, res) {
        if (await verifyuserRegist(params.uname)) {
            /**
            * 密码加密
            */
            let salt = bcrypt.genSaltSync(10);
            let result = bcrypt.hashSync(params.psd, salt);

            let document = {
                username: params.uname,
                userpsd: result,
                nickname: params.nickname,
                userphone: params.phone,
                sex: 1,
                create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                update_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                u_token: token
            };
            try {
                InsertUserCollection(document);
                ApiResponse(new Response(200, '注册成功', null, null, res));
            } catch (error) {
                ApiResponse(new Response(500, '注册失败' + error, null, null, res));
            }

        } else {
            ApiResponse(new Response(401, '用户名重复', null, null, res));
        }

    },
    verifyUsername: function (param, res) {
        UserRegistMod
            .findOne({ username: param })
            .then(doc => {
                if (doc === null) {
                    ApiResponse(new Response(401, '用户名不存在', null, null, res));
                } else ApiResponse(new Response(200, '用户名存在', null, null, res));
            });
    },
    userLogin: function (uname, password, res) {
        UserRegistMod.findOne({ username: uname }, (err, data) => {
            if (data === null) {
                ApiResponse(new Response(401, '用户名不存在', null, null, res));
            } else {
                let psd = data.userpsd;
                if (bcrypt.compareSync(password, psd)) {
                    UserRegistMod.updateOne({ update_time: moment().format("YYYY-MM-DD HH:mm:ss") })
                        .where('username').equals(uname).exec((err, doc) => {
                            console.log(doc);
                            if (doc) {
                                ApiResponse(new Response(200, '登录成功', data, null, res));
                            } else {
                                ApiResponse(new Response(500, '登录失败' + err, null, null, res));
                            }
                        });
                } else {
                    ApiResponse(new Response(401, '密码错误', null, null, res));
                }
            }
        });
    },
    getVcodeImg: (res) => {
        let baseUrl = path.resolve(__dirname, '../vcodeimage');
        try {

            let imageFileCollection = fs.readdirSync(baseUrl);
            let l = getRandomNum(imageFileCollection.length);
            let imageUrl = path.join(baseUrl, imageFileCollection[l]);
            try {
                let ImageVcodeAuthRedis = new ImageAuthVcode();
                let image = fs.readFileSync(imageUrl);
                if (!image) throw new Error("文件不存在");
                let str = randomString(60);
                let imgArr = [];

                (async () => {
                    for (let i = 0; i < 6; i++) {
                        let I = await game(imageUrl, Math.floor(i / 2) * 100, (i % 2) * 100);
                        imgArr.push(I);
                    }

                    try {
                        let n1, n2;

                        let ID = randomString(64);
                        let data = {
                            time: new Date().getTime(),
                            auth: str
                        };
                        //将唯一ID，对应imgAuth传入redis,设置60s过期
                        ImageVcodeAuthRedis.MsetImg(ID, JSON.stringify(data));

                        let resObj = [];

                        for (let i = 0; i < 6; i++) {
                            let auth = "";
                            for (let j = i * 10; j < (i + 1) * 10; j++) {
                                auth += [...str][j];
                            }
                            resObj.push({
                                image: imgArr[i],
                                code: auth
                            });
                        }
                        do {
                            n1 = Math.floor(Math.random() * 6);
                            n2 = Math.floor(Math.random() * 6);
                        } while (n1 === n2);

                        let k = resObj[n1];
                        resObj[n1] = resObj[n2];
                        resObj[n2] = k;
                        ApiResponse(new Response(200, '成功', { resObj, ID }, null, res));
                    } catch (error) {
                        ApiResponse(new Response(500, '[redis异常]' + "错误:" + error, null, null, res));
                    }
                })();
            } catch (error) {
                ApiResponse(new Response(500, '[读取图片失败，图片名称]' + imageUrl + "错误:" + error, null, null, res));
            }
        } catch (error) {
            ApiResponse(new Response(500, '[读取文件夹失败，路径名称]' + baseUrl + "错误:" + error, null, null, res));
        }
    },
    postAuthVcodeImg: async (code, id, res) => {

        let ImageVcodeAuthRedis = new ImageAuthVcode();
        try {
            let AuthImg = await ImageVcodeAuthRedis.MgetImg(id);
            let { auth } = JSON.parse(AuthImg);
            if (auth === code) {
                ApiResponse(new Response(200, '成功', JSON.parse(AuthImg), null, res));
            } else ApiResponse(new Response(500, '验证失败', null, null, res));
        } catch (error) {
            ApiResponse(new Response(500, '验证过期', null, null, res));
        }
    },
    UpdateUserInfo: async (req, res) => {
        let { user, nick, sex, phone, rname } = req.body;
        let find = await UserRegistMod.findOne({ username: user });
        if (!find) {
            let update = await UserRegistMod.updateOne({
                username: user,
                nickname: nick,
                userphone: phone,
                sex: sex ? 1 : 0,
                update_time: moment().format("YYYY-MM-DD HH:mm:ss"),
            }).where('username').equals(rname);
            try {
                await UserAddMod.updateMany({ username: user }).where('username').equals(rname);
                await UserAddMod.updateMany({ send_username: user }).where('send_username').equals(rname);
                await UserFriendMsgMod.updateMany({ username: user }).where('username').equals(rname);
                await UserFriendMsgMod.updateMany({ friend: user }).where('friend').equals(rname);
                await BlogCommentPraiseMod.updateMany({ username: user }).where('username').equals(rname);
                await BlogCommentMod.updateMany({ username: user }).where('username').equals(rname);
                await BlogMessageBoardMod.updateMany({ username: user }).where('username').equals(rname).where('islogin').equals(true);
                await GolbalUserMsgMod.updateMany({ username: user }).where('username').equals(rname).where('islogin').equals(true);
                ApiResponse(new Response(200, '修改用户名成功', update, null, res));
            } catch (error) {
                ApiResponse(new Response(400, '修改用户名失败', error, null, res));
            }
            
        } else {
            ApiResponse(new Response(400, '用户名重复', null, null, res));
        }
        
    }
};