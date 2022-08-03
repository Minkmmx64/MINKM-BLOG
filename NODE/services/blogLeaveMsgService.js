const { Response, ApiResponse } = require('../middleware/response');
const { BlogMessageBoardMod } = require("../config/mongoDbServer");
const { sendEmail } = require("../Utils/email");
const { logger } = require("../Utils/log");
const moment = require("moment");

exports.blogLeaveMsgService = {
  postLeaveMsg: async (req, res) => {
    let { avatar, content, qqnumber, pid, side, user, email, phone, islogin, replayuser, isread } = req.body;
    isread = isread === true ? isread : false;
    replayuser = typeof replayuser === "string" ? replayuser : "";
    try {
      let insert = await BlogMessageBoardMod.create({
        username: user,
        email: email,
        phone: phone,
        content: content,
        side: side,
        avatar: avatar,
        qqnumber: qqnumber,
        islogin: islogin,
        pid: pid,
        isread: isread,
        replayuser: replayuser,
        create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      if (insert) {
        ApiResponse(new Response(200, '插入留言成功', insert, null, res));
      } else throw new Error("插入留言失败");
    } catch (error) {
      ApiResponse(new Response(500, error, null, null, res));
    }
  },
  loadLeaveMsg: async (pages, limits, query, search, res) => {
    if (query === "" || query === "null") {
      try {
        let data = await BlogMessageBoardMod.find({ isread: true });
        if (data) {
          ApiResponse(new Response(200, '查询留言成功', data, null, res));
        } else throw new Error("查询留言错误");
      } catch (error) {
        ApiResponse(new Response(500, '查询留言错误' + error, null, null, res));
      }
    } else {
      let { isRead } = JSON.parse(query);
      try {
        let data = await BlogMessageBoardMod.find({
          isread: isRead,
          pid: "root"
        }).skip((pages - 1) * limits).limit(limits);
        if (data) {
          ApiResponse(new Response(200, '查询留言成功', data, null, res));
        } else throw new Error("查询留言错误");
      } catch (error) {
        ApiResponse(new Response(500, '查询留言错误' + error, null, null, res));
      }
    }
  },
  deleteLeaveMsg: async (id, email, content, usercontent, res) => {
    let deletes = await BlogMessageBoardMod.deleteOne({ _id: id });
    sendEmail(email, "<p>你的留言由于某些原因，不给与展示,留言内容:</p>" + usercontent + '<p>作者备注</p>' + content).then((data) => {
      if (deletes) {
        ApiResponse(new Response(200, '操作成功', deletes, data.response, res));
        logger.info(`[发送邮件成功] ${data.accepted} from ${data.envelope.from} to ${data.envelope.to} messageId ${data.messageId} response ${data.response}`);
      } else ApiResponse(new Response(500, '操作失败', deletes, data, res));
    }).catch(error => {
      let Errors = new Error(error).message;
      if (Errors === "Error: No recipients defined") {
        logger.warn('[邮件不存在]' + 'to' + email + Errors);
        ApiResponse(new Response(201, '发送邮件失败邮箱不存在' + Errors, null, null, res));
      } else if (Errors === "Error: Missing credentials for \"PLAIN\"") {
        logger.error('[缺少凭证，可能后台邮件配置参数错误]' + 'to' + email + Errors);
        ApiResponse(new Response(500, '[缺少凭证，可能后台邮件配置参数错误]' + Errors, null, null, res));
      } else {
        logger.error('[发送邮件失败]' + 'to' + email + Errors);
        ApiResponse(new Response(500, '发送邮件失败请稍后再试' + Errors, null, null, res));
      }
    });
  },
  putLeaveMsgReply: async (avatar, user, pid, content, email, username, usercontent, admission, res) => {
    sendEmail(email, '<p>您的留言发布成功</p>' + '<p>留言内容' + usercontent + '</p>' + '<p>作者回复</p>' + content).then(async (data) => {
      logger.info(`[发送邮件成功] ${data.accepted} from ${data.envelope.from} to ${data.envelope.to} messageId ${data.messageId} response ${data.response}`);
      try {
        let updates = await BlogMessageBoardMod.updateOne(
          { _id: pid, },
          { isread: true }
        );
        let created = await BlogMessageBoardMod.create({
          username: user,
          content: content,
          avatar: avatar,
          islogin: true,
          pid: pid,
          isread: true,
          create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          replayuser: username,
          admission: admission
        });
        if (created || updates) {
          ApiResponse(new Response(200, '回复成功', { step1: created, step2: updates }, data.response, res));
        } else throw new Error("ERROR!!!");
      } catch (error) {
        ApiResponse(new Response(500, '邮件发送成功内部异常' + error, null, data.response, res));
      }
    }).catch(error => {
      let Errors = new Error(error).message;
      if (Errors === "Error: No recipients defined") {
        logger.warn('[邮件不存在]' + 'to' + email + Errors);
        /**
         * 删除这条记录
         */
        /** (code) */
        ApiResponse(new Response(201, '发送邮件失败邮箱不存在' + Errors, null, null, res));
      } else if (Errors === "Error: Missing credentials for \"PLAIN\"") {
        logger.error('[缺少凭证，可能后台邮件配置参数错误]' + 'to' + email + Errors);
        ApiResponse(new Response(500, '[缺少凭证，可能后台邮件配置参数错误]' + Errors, null, null, res));
      } else {
        logger.error('[发送邮件失败]' + 'to' + email + Errors);
        ApiResponse(new Response(500, '发送邮件失败请稍后再试' + Errors, null, null, res));
      }
    });
  },
  updateLeaveMsg: async (ctx, id, res) => {
    try {
      let update = await BlogMessageBoardMod.updateOne({ content: ctx }).where("_id").equals(id);
      ApiResponse(new Response(200, '修改留言成功', update, null, res));
    } catch (error) {
      ApiResponse(new Response(500, '修改留言失败请稍后再试' + error, null, null, res));
    }
  }
};