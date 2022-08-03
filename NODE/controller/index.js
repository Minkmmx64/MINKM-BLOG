const jwt = require('jsonwebtoken');
const { chatService } = require('../services/chatService');
const { getUserimgService } = require('../services/getUserimgService');
const { blogCategorieService } = require('../services/blogCategorieService');
const { blogArticleService } = require('../services/blogArticleService');
const { blogLabelService } = require('../services/blogLabelService');
const { UserService } = require('../services/UserService');
const { SecretKey } = require('../common/index');
const { blogClientService } = require('../services/blogClientService');
const { blogWebShareService } = require("../services/blogWebShareService");
const { textservice } = require("../services/textservice");
const { blogBannersService } = require("../services/blogBannersService");
const { blogLeaveMsgService } = require("../services/blogLeaveMsgService");
const { monitorService } = require("../services/monitorService");
const Request = require('../request/index');
const { blogFriendService } = require('../services/blogFriendService');
const { blogWebCategoriesService } = require('../services/blogWebCategoriesService');

exports.testController = function (req, res) {
    textservice(req, res);
};

exports.chatController = {
    //好友申请
    findApply: async (req, res) => {
        let { uname } = req.query;

        if (await Request.ChatRequest.findApply(uname, res)) {
            chatService.findApply(uname, res);
        }
    },
    //好友列表
    findFriendList: async function (req, res) {
        let { uname } = req.query;

        if (await Request.ChatRequest.findFriendList(uname, res)) {
            chatService.findFriendList(uname, res);
        }
    },
    //好友消息
    findFriendMsg: async (req, res) => {
        let uname = req.query.u_name;
        let suname = req.query.s_name;

        if (await Request.ChatRequest.findFriendMsg(uname, suname, res)) {
            chatService.findFriendMsg(uname, suname, res);
        }
    },
    //聊天室消息
    findGolbalUserMsg: function (req, res) {
        chatService.findGolbalUserMsg(req, res);
    },
    //上传头像
    postUserimg: async function (req, res) {
        let params = {
            username: req.body.uname,
            filename: req.file.filename
        };

        if (await Request.ChatRequest.postUserimg(params, res)) {
            chatService.postUserimg(params, res);
        }
    }
};

//文章分类

exports.blogCategorieController = {
    addCategorie: async (req, res) => {
        let Categorie = req.body.param;

        if (await Request.BlogRequest.addCategorie(Categorie, res)) {
            blogCategorieService.insertCategorie(Categorie, res);
        }
    },

    getCategorie: (req, res) => {
        blogCategorieService.selectCategorie(req, res);
    },

    editCategorie: async (req, res) => {
        let oldedit = req.body.backedit;
        let newedit = req.body.edit;

        if (await Request.BlogRequest.updateCategorie(oldedit, newedit, res)) {
            blogCategorieService.updateCategorie(oldedit, newedit, res);
        }
    },

    deleteCategorie: async (req, res) => {
        let Categorie = req.query.name;

        if (await Request.BlogRequest.deleteCategorie(Categorie, res)) {
            blogCategorieService.deleteCategorie(Categorie, res);
        }
    }
};

//写文章
exports.blogArticleController = {

    //添加文章
    addArticle: async (req, res) => {
        let data = req.body;

        if (await Request.BlogRequest.addArticle(data, res)) {
            blogArticleService.addArticle(data, res);
        }
    },
    //获取一条文章
    getHotArticle: async (req, res) => {
        let { id } = req.query;
        let { article_id, uname } = JSON.parse(id);

        if (await Request.BlogRequest.getHotArticle(article_id, uname, res)) {
            blogArticleService.getHotArticle(article_id, uname, res);
        }
    },

    //文章列表
    selectEffectiveArticle: async (req, res) => {
        let { limits, pages, search } = req.query;
        limits = parseInt(limits);
        pages = parseInt(pages);

        if (await Request.BlogRequest.selectEffectiveArticle(limits, pages, res)) {
            blogArticleService.selectEffectiveArticle(limits, pages, search, res);
        }
    },

    //修改文章
    updateOneArticle: (req, res) => {
        blogArticleService.updateOneArticle(req, res);
    },

    //删除文章
    recoveryArticle: async (req, res) => {
        let { state } = req.body;
        let id = req.params.id;
        state = parseInt(state);

        if (await Request.BlogRequest.recoveryArticle(state, id, res)) {
            blogArticleService.recoveryArticle(state, id, res);
        }
    },

    //获取软删除文章
    selectRecoveryArticle: async (req, res) => {
        let { pages, limit, search } = req.query;
        limit = parseInt(limit);
        pages = parseInt(pages);

        if (await Request.BlogRequest.selectRecoveryArticle(limit, pages, res)) {
            blogArticleService.selectRecoveryArticle(pages, limit, search, res);
        }
    },

    //硬删除文章
    deleteArticle: async (req, res) => {
        let id = req.params.id;

        if (await Request.BlogRequest.deleteArticle(id, res)) {
            blogArticleService.deleteArticle(id, res);
        }
    },

    selectArticleDetails: (req, res) => {
        let { limit, pages } = req.query;
        limit = parseInt(limit);
        pages = parseInt(pages);

        blogArticleService.selectArticleDetails(limit, pages, res);
    },

    selectArticleCommentFromId: async (req, res) => {
        let { limit, pages, query } = req.query;

        limit = parseInt(limit);
        pages = parseInt(pages);
        query = JSON.parse(query);

        if (await Request.BlogRequest.selectArticleCommentFromId(limit, pages, query, res)) {
            blogArticleService.selectArticleCommentFromId(limit, pages, query, res);
        }
    },
    updateCommentFromId: async (req, res) => {
        let { id, comment } = req.body;

        if (await Request.BlogRequest.updateCommentFromId(id, comment, res)) {
            blogArticleService.updateCommentFromId(id, comment, res);
        }
    }
};

//文章标签
exports.blogLabelController = {

    addLabel: (req, res) => {
        let label = req.body.param;

        blogLabelService.addLabel(label, res);
    },

    deleteLabel: (req, res) => {
        let deleteV = req.query.name;

        blogLabelService.deleteLabel(deleteV, res);
    },

    updateLabe: (req, res) => {
        let oldV = req.body.backedit;
        let newV = req.body.edit;

        blogLabelService.updateLabel(oldV, newV, res);
    },

    selectLabel: (req, res) => {
        blogLabelService.selectLabel(req, res);
    }
};

/**
 * 用户相关
 */
exports.UserController = {
    //获取用户上传头像

    getUserImg: (req, res) => {
        getUserimgService(req.params.url, res);
    },

    //用户登录

    userLogin: (param, res) => {

        let { uname, psd } = param.body.params;

        UserService.userLogin(uname, psd, res);
    },

    //用户名判重

    verifyUsername: (req, res) => {
        UserService.verifyUsername(req.body.param, res);
    },

    //注册
    userRegist: (params, res) => {

        let data = params.body.params;
        let username = data.uname;
        let userpsd = data.psd;
        let userphone = data.phone;
        let token = jwt.sign({ username, userpsd, userphone }, SecretKey, {});

        UserService.userRegist(data, token, res);
    },

    //用户信息
    userInfo: (req, res) => {
        let { limit, current } = req.query;

        UserService.userInfo(limit, current, res);
    },

    //拼图验证码
    getVcodeImg: (req, res) => {
        UserService.getVcodeImg(res);
    },

    //验证拼图验证码
    postAuthVcodeImg: (req, res) => {
        let { code, auth } = req.body;
        UserService.postAuthVcodeImg(code, auth, res);
    },

    UpdateUserInfo: (req, res) => {
        UserService.UpdateUserInfo(req, res);
    }

};

/**
 * 前端博客
 */
exports.blogClientController = {
    //前端获取文章
    selectBlogClientArticle: (req, res) => {
        let { limit, size, search } = req.query;
        limit = parseInt(limit);
        size = parseInt(size);

        blogClientService.selectBlogClientArticle(limit, size, search, res);
    },

    //前端发送评论
    insertSendBlogArticle: (req, res) => {
        blogClientService.insertSendBlogArticle(req, res);
    },

    //获取该文章所有评论
    selectCommentByArticleId: (req, res) => {
        let { id } = req.params;

        blogClientService.selectCommentByArticleId(id, res);
    },

    //点赞评论
    praiseArticleComment: (req, res) => {
        let { commentId, data } = req.body;

        blogClientService.praiseArticleComment(commentId, data, res);
    },

    selectUserPraiseFromArticleId: (req, res) => {
        let { username, userId } = req.query;

        blogClientService.selectUserPraiseFromArticleId(username, userId, res);
    },
    //归档
    selectBlogFile: (req, res) => {

        blogClientService.selectBlogFile(res);
    },
    //首页信息
    adminInfo: (req, res) => {
        blogClientService.adminInfo(res);
    },
    //首页标签，分类
    clientLabelandCategories: (req, res) => {
        blogClientService.clientLabelandCategories(res);
    },
    HomeBlogArticle: (req, res) => {
        let { limit, current, query, search } = req.query;
        limit = parseInt(limit);
        current = parseInt(current);
        query = parseInt(query);
        blogClientService.HomeBlogArticle(limit, current, query, search, res);
    }
};

exports.blogWebShareController = {
    addWebShare: async (req, res) => {
        let data = req.body.param;

        if (await Request.BlogWebShareRequest.addWebShare(data, res)) {
            blogWebShareService.addWebShare(data, res);
        }
    },
    selectWebShare: async (req, res) => {
        let { limit, size } = req.query;
        limit = parseInt(limit);
        size = parseInt(size);

        if (await Request.BlogWebShareRequest.selectWebShare(limit, size, res)) {
            blogWebShareService.selectWebShare(limit, size, res);
        }
    },
    updateWebShare: async (req, res) => {
        let { imgUrl, site, title, describe, id, classname } = req.body.edit;

        if (await Request.BlogWebShareRequest.updateWebShare(imgUrl, site, title, describe, id, classname, res)) {
            blogWebShareService.updateWebShare(imgUrl, site, title, describe, id, classname, res);
        }
    },
    deleteWebShare: async (req, res) => {
        let { id } = req.query;

        if (await Request.BlogWebShareRequest.deleteWebShare(id, res)) {
            blogWebShareService.deleteWebShare(id, res);
        }
    },
    getClientWebShare: (req, res) => {
        let { search } = req.query;
        let { categorie } = JSON.parse(search);

        blogWebShareService.getClientWebShare(categorie, res);
    }
};

exports.BlogBannersController = {
    addBlogBanners: async (req, res) => {
        let { param } = req.body;

        if (await Request.BlogBannersRequest.addBlogBanners(param, res)) {
            blogBannersService.addBlogBanners(param, res);
        }
    },
    getBlogBanners: async (req, res) => {
        blogBannersService.getBlogBanners(req, res);
    },
    updateBlogBanners: async (req, res) => {
        let { _id, value } = req.body;

        if (await Request.BlogBannersRequest.updateBlogBanners(_id, value, res)) {
            blogBannersService.updateBlogBanners(_id, value, res);
        }
    },
    deleteBlogBanners: async (req, res) => {
        let { _id } = req.query;

        if (await Request.BlogBannersRequest.deleteBlogBanners(_id, res)) {
            blogBannersService.deleteBlogBanners(_id, res);
        }
    },
};

exports.LeaveMsgController = {
    postLeaveMsg: async (req, res) => {

        if (await Request.BlogLeaveMsgRequest.postLeaveMsg(req, res)) {
            blogLeaveMsgService.postLeaveMsg(req, res);
        }
    },
    loadLeaveMsg: async (req, res) => {
        let { pages, limits, query, search } = req.query;
        pages = parseInt(pages);
        limits = parseInt(limits);

        if (await Request.BlogLeaveMsgRequest.loadLeaveMsg(query, res)) {
            blogLeaveMsgService.loadLeaveMsg(pages, limits, query, search, res);
        }
    },
    deleteLeaveMsg: async (req, res) => {
        let { id, email, content, usercontent } = req.query;

        if (await Request.BlogLeaveMsgRequest.deleteLeaveMsg(id, res)) {
            blogLeaveMsgService.deleteLeaveMsg(id, email, content, usercontent, res);
        }
    },
    putLeaveMsgReply: async (req, res) => {
        let { edit } = req.query;
        let { avatar, user, pid, content, email, username, usercontent, admission } = JSON.parse(edit);

        if (await Request.BlogLeaveMsgRequest.putLeaveMsgReply(avatar, user, pid, content, res)) {
            blogLeaveMsgService.putLeaveMsgReply(avatar, user, pid, content, email, username, usercontent, admission, res);
        }
    },
    updateLeaveMsg: async (req, res) => {
        let { ctx, id } = req.body;
        blogLeaveMsgService.updateLeaveMsg(ctx, id, res);
    }
};

exports.monitorController = {
    MonitorList: (req, res) => {
        monitorService.MonitorList(req, res);
    }
};

exports.blogFriendController = {
    addFriendChain: (req, res) => {
        blogFriendService.addFriendChain(req, res);
    },
    getFriendChain: (req, res) => {
        blogFriendService.getFriendChain(req, res);
    },
    updateFriendChain: (req, res) => {
        blogFriendService.updateFriendChain(req, res);
    },
    deleteFriendChain: (req, res) => {
        blogFriendService.deleteFriendChain(req, res);
    },
};

exports.blogWebCategoriesController = {
    addWebCategories: (req, res) => {
        blogWebCategoriesService.addWebCategories(req, res);
    },
    getWebCategories: (req, res) => {
        blogWebCategoriesService.getWebCategories(req, res);
    },
    updateWebCategories: (req, res) => {
        blogWebCategoriesService.updateWebCategories(req, res);
    },
    deleteWebCategories: (req, res) => {
        blogWebCategoriesService.deleteWebCategories(req, res);
    },
};

