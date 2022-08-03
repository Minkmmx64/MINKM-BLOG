const { Response, ApiResponse } = require('../middleware/response');
const { UserRegistMod } = require('../config/mongoDbServer');
const { userNameRegEx } = require("../common/index");
exports.ChatRequest = {
    findApply: async (uname, res) => {
        if (uname === null || uname === undefined || typeof uname !== 'string' || uname === '') {
            ApiResponse(new Response(400, '数据格式不正确', null, null, res));
            return Promise.resolve(false);
        }
        else if (!userNameRegEx.test(uname)) {
            ApiResponse(new Response(400, '数据非法', null, null, res));
            return Promise.resolve(false);
        } else {
            let userIsRegister = await UserRegistMod.findOne({ username: uname });
            if (userIsRegister === null) {
                ApiResponse(new Response(400, '用户不存在', null, null, res));
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    },
    findFriendList: async (uname, res) => {
        if (uname === null || uname === undefined || typeof uname !== 'string' || uname === '') {
            ApiResponse(new Response(400, '数据格式不正确', null, null, res));
            return Promise.resolve(false);
        }
        else if (!userNameRegEx.test(uname)) {
            ApiResponse(new Response(400, '数据非法', null, null, res));
            return Promise.resolve(false);
        } else {
            let userIsRegister = await UserRegistMod.findOne({ username: uname });
            if (userIsRegister === null) {
                ApiResponse(new Response(400, '用户不存在', null, null, res));
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    },
    findFriendMsg: async (uname, suname, res) => {
        if (uname === null || uname === undefined || typeof uname !== 'string' || uname === ''
            || suname === null || suname === undefined || typeof suname !== 'string' || suname === ''
        ) {
            ApiResponse(new Response(400, '数据格式不正确', null, null, res));
            return Promise.resolve(false);
        }
        else if (!userNameRegEx.test(uname) || !userNameRegEx.test(suname)) {
            ApiResponse(new Response(400, '数据非法', null, null, res));
            return Promise.resolve(false);
        } else {
            let userIsRegister = await UserRegistMod.findOne({ username: uname });
            let user2IsRegister = await UserRegistMod.findOne({ username: suname });
            if (userIsRegister === null || user2IsRegister === null) {
                ApiResponse(new Response(400, '用户不存在', null, null, res));
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    },
    postUserimg: async (params, res) => {
        let { username } = params;
        if (username === null || username === undefined || typeof username !== 'string' || username === '') {
            ApiResponse(new Response(400, '数据格式不正确', null, null, res));
            return Promise.resolve(false);
        }
        else if (!userNameRegEx.test(username)) {
            ApiResponse(new Response(400, '数据非法', null, null, res));
            return Promise.resolve(false);
        } else {
            let userIsRegister = await UserRegistMod.findOne({ username: username });
            if (userIsRegister === null) {
                ApiResponse(new Response(400, '用户不存在', null, null, res));
                return Promise.resolve(false);
            }
        }
        return Promise.resolve(true);
    }
};