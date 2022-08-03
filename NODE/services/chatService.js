const { UserRegistMod, GolbalUserMsgMod, BlogCommentMod, UserAddMod, UserFriendMsgMod, BlogMessageBoardMod } = require('../config/mongoDbServer');
const { userImgUrl } = require('../config/baseUrl');
const moment = require('moment');
const fs = require('fs');
const { Response, ApiResponse } = require('../middleware/response');
async function updateAllImgHead(url, name) {
    try {
        await GolbalUserMsgMod.updateMany({ avatar: url }).where('username').equals(name);
        await BlogCommentMod.updateMany({ avatar: url }).where('username').equals(name);
        await BlogMessageBoardMod.updateMany({ avatar: url }).where('username').equals(name).where("islogin").equals(true);
    } catch (error) {
        console.log(error);
    }
}

exports.chatService = {

    findApply: function (uname, res) {
        UserAddMod
            .find({ send_username: uname })
            .select('state username')
            .where('state')
            .equals(0)
            .exec((err, doc) => {
                if (err) ApiResponse(new Response(500, 'ERR', null, null, res));
                else {
                    ApiResponse(new Response(200, '好友申请列表获取成功', doc, null, res));
                }
            });
    },
    findFriendList: function (uname, res) {

        UserAddMod.aggregate(
            [
                {
                    $lookup: {
                        from: 'user_collections',
                        localField: 'send_username',
                        foreignField: 'username',
                        as: 'items'
                    }
                },
                {
                    $match: {
                        'username': uname,
                        'state': 1
                    },
                }
            ]
            , (err, document) => {
                let data = [];
                console.log(document);
                document.forEach(ele => {
                    data.push(ele.items);
                });
                ApiResponse(new Response(200, '好友列表获取成功', data, null, res));
            }
        );
    },
    findFriendMsg: function (uname, suname, res) {
        /**
        * 获取用户好友的消息
        */

        UserFriendMsgMod
            .find({ username: uname })
            .select('msg state create_at types')
            .where('friend')
            .equals(suname)
            .exec((err, doc) => {
                //ApiResponse(new Response(200,'好友消息获取成功',doc,null,res));
                res.send(doc);
            });
    },
    findGolbalUserMsg: async function (req, res) {

        try {
            let selectAnyFromGolbalUserMsgMod = await GolbalUserMsgMod.find();

            if (selectAnyFromGolbalUserMsgMod) {
                ApiResponse(new Response(200, 'success', selectAnyFromGolbalUserMsgMod, null, res));
            } else {
                throw new Error('查找聊天记录失败');
            }
        } catch (error) {
            ApiResponse(new Response(500, error, null, null, res));
        }
    },
    postUserimg: function (params, res) {
        /**
     * 用户头像修改,修改前需要删除原来的头像
     */
        let img = userImgUrl + params.filename;

        UserRegistMod.findOne({ username: params.username })
            .select('imgUrl')
            .exec((err, doc) => {
                if (doc.imgUrl === '') {
                    UserRegistMod
                        .updateOne({ imgUrl: img, update_time: moment().format("YYYY-MM-DD HH:mm:ss") })
                        .where('username')
                        .equals(params.username)
                        .exec((err, doc) => {
                            if (doc) {
                                ApiResponse(new Response(200, '修改头像成功', img, null, res));
                            } else {
                                ApiResponse(new Response(500, err, null, null, res));
                            }
                        });
                } else {

                    let imgUrl = doc.imgUrl.slice(7);
                    let baseUrl = imgUrl.split('/');

                    try {
                        if (baseUrl[baseUrl.length - 1] === 'head.jpeg') {
                            throw new Error();
                        } else {
                            let f = fs.unlinkSync('./uploads/' + baseUrl[baseUrl.length - 1]);
                            if (f === undefined) {

                                UserRegistMod
                                    .updateOne({ imgUrl: img, update_time: moment().format("YYYY-MM-DD HH:mm:ss") })
                                    .where('username')
                                    .equals(params.username)
                                    .exec((err, doc) => {
                                        if (doc) {
                                            ApiResponse(new Response(200, '修改头像成功', img, null, res));
                                        } else {
                                            ApiResponse(new Response(500, err, null, null, res));
                                        }
                                    });
                            }
                        }
                    } catch (error) {

                        UserRegistMod
                            .updateOne({ imgUrl: img, update_time: moment().format("YYYY-MM-DD HH:mm:ss") })
                            .where('username')
                            .equals(params.username)
                            .exec((err, doc) => {
                                if (doc) {
                                    ApiResponse(new Response(200, '修改头像成功', img, null, res));
                                } else {
                                    ApiResponse(new Response(500, err, null, null, res));
                                }
                            });
                    }
                }
                updateAllImgHead(img, params.username);
            });
    }
};