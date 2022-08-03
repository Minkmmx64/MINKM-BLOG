const { Response, ApiResponse } = require('../middleware/response');
const { BlogMessageBoardMod } = require("../config/mongoDbServer");
const { userPhoneRegEx, checkUrl } = require("../common/index");
exports.BlogLeaveMsgRequest = {
  postLeaveMsg: async (req, res) => {
    let { content, user, avatar, side, phone, islogin } = req.body;
    if (content === "" || content === undefined || content === null || typeof content !== "string") {
      ApiResponse(new Response(400, '没有留言内容', null, null, res));
      return Promise.resolve(false);
    } else if (user === "" || user === undefined || user === null || typeof user !== "string") {
      ApiResponse(new Response(400, '用户名不合法', null, null, res));
      return Promise.resolve(false);
    } else if (phone !== "") {
      if (!userPhoneRegEx.test(phone)) {
        ApiResponse(new Response(400, '手机号不合法', null, null, res));
        return Promise.resolve(false);
      }
    } else if (side !== "") {
      if (!checkUrl.test(side)) {
        ApiResponse(new Response(400, '网站不合法', null, null, res));
        return Promise.resolve(false);
      }
    } else if (!checkUrl.test(avatar)) {
      ApiResponse(new Response(400, '头像不合法', null, null, res));
      return Promise.resolve(false);
    } else if (typeof islogin !== "boolean" || islogin === undefined || islogin === null) {
      ApiResponse(new Response(400, '登录情况不合法', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  loadLeaveMsg: async (query, res) => {
    if (typeof query !== "string") {
      ApiResponse(new Response(500, '参数不合法', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  deleteLeaveMsg: async (id, res) => {
    if (typeof id !== "string" || id === "" || id === undefined || id === null) {
      ApiResponse(new Response(500, 'id不合法', null, null, res));
      return Promise.resolve(false);
    }
    if (await BlogMessageBoardMod.findOne({ _id: id }) === null) {
      ApiResponse(new Response(500, '留言不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  putLeaveMsgReply: async (avatar, user, pid, content, res) => {
    if (content === "" || content === undefined || content === null || typeof content !== "string") {
      ApiResponse(new Response(400, '没有留言内容', null, null, res));
      return Promise.resolve(false);
    } else if (user === "" || user === undefined || user === null || typeof user !== "string") {
      ApiResponse(new Response(400, '用户名不合法', null, null, res));
      return Promise.resolve(false);
    }
    else if (!checkUrl.test(avatar)) {
      ApiResponse(new Response(400, '头像不合法', null, null, res));
      return Promise.resolve(false);
    }
    if (await BlogMessageBoardMod.findOne({ _id: pid }) === null) {
      ApiResponse(new Response(500, '留言不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
};