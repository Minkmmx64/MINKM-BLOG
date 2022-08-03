const { Response, ApiResponse } = require('../middleware/response');
const { BlogCategorieMod, UserRegistMod, BlogArticleMod, BlogCommentMod } = require('../config/mongoDbServer');
const { userNameRegEx } = require("../common/index");
exports.BlogRequest = {
  addCategorie: (Categorie, res) => {
    if (Categorie === null || Categorie === undefined || typeof Categorie !== 'string' || Categorie === '') {
      ApiResponse(new Response(400, '数据格式不正确', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  updateCategorie: async (oCategorie, nCategorie, res) => {
    if (oCategorie === null || oCategorie === undefined || typeof oCategorie !== 'string' || oCategorie === ''
      || nCategorie === null || nCategorie === undefined || typeof nCategorie !== 'string' || nCategorie === ''
    ) {
      ApiResponse(new Response(400, '数据格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogCategorieMod.find({ categorie: nCategorie }) === null) {
      ApiResponse(new Response(400, '分类不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  deleteCategorie: async (Categorie, res) => {
    if (Categorie === null || Categorie === undefined || typeof Categorie !== 'string' || Categorie === '') {
      ApiResponse(new Response(400, '数据格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogCategorieMod.findOne({ categorie: Categorie }) === null) {
      ApiResponse(new Response(400, '分类不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  addArticle: async (data, res) => {
    //标题 标签 作者 分类 描述 内容 图片 署名
    let { title, label, author, categorie, describe, content, picture, signature } = data;
    const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g; // 匹配网址
    if (title === null || title === undefined || typeof title !== 'string' || title === '') {
      ApiResponse(new Response(400, '标题格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (label === null || label === undefined || (typeof label !== 'object' && typeof label !== 'string') || label === '' || label === []) {
      ApiResponse(new Response(400, '标签格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (author === null || author === undefined || typeof author !== 'string' || author === '' || !userNameRegEx.test(author)) {
      ApiResponse(new Response(400, '作者格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (categorie === null || categorie === undefined || typeof categorie !== 'string' || categorie === '') {
      ApiResponse(new Response(400, '分类格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (describe === null || describe === undefined || typeof describe !== 'string' || describe === '') {
      ApiResponse(new Response(400, '描述格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (picture === null || picture === undefined || typeof picture !== 'string' || picture === '') {
      ApiResponse(new Response(400, '图片地址格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (signature === null || signature === undefined || typeof signature !== 'string' || signature === '') {
      ApiResponse(new Response(400, '署名格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (content === null || content === undefined || typeof content !== 'string' || content === '') {
      ApiResponse(new Response(400, '内容格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (await UserRegistMod.findOne({ username: author }) === null) {
      ApiResponse(new Response(400, '用户不存在', null, null, res));
      return Promise.resolve(false);
    } else if (!checkUrl.test(picture)) {
      ApiResponse(new Response(400, '图片路径非法', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogCategorieMod.findOne({ categorie: categorie }) === null) {
      ApiResponse(new Response(400, '分类不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  selectEffectiveArticle: async (limits, pages, res) => {
    if (typeof limits !== 'number' || typeof pages !== 'number' || limits <= 0 || pages <= 0 || limits >= 50 || pages >= 9999) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else {
      try {
        let document = await BlogArticleMod.find().where('state').equals(1);
        let L = document.length;
        if (limits * (pages - 1) >= L) {
          ApiResponse(new Response(400, '数据不合法', null, null, res));
          return Promise.resolve(false);
        }
        else return Promise.resolve(true);
      } catch (error) {
        ApiResponse(new Response(400, error, null, null, res));
        return Promise.resolve(false);
      }
    }
  },
  getHotArticle: async (articleId, uname, res) => {
    if (typeof articleId !== "string") {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogArticleMod.findOne({ article_id: articleId }) === null) {
      ApiResponse(new Response(400, '文章不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  recoveryArticle: async (state, articleId, res) => {

    if (state !== 0 && state !== 1) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (typeof articleId !== "string" || articleId === "" || articleId === undefined) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogArticleMod.findOne({ article_id: articleId }) === null) {
      ApiResponse(new Response(400, '文章不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  selectRecoveryArticle: async (limits, pages, res) => {
    if (typeof limits !== 'number' || typeof pages !== 'number' || limits <= 0 || pages <= 0 || limits >= 50 || pages >= 9999) {
      ApiResponse(new Response(400, '分页数据不合法', null, null, res));
      return Promise.resolve(false);
    } else {
      try {
        let document = await BlogArticleMod.find().where('state').equals(0);
        let L = document.length;
        if (limits * (pages - 1) > L) {
          ApiResponse(new Response(400, '数据不合法', null, null, res));
          return Promise.resolve(false);
        }
        else return Promise.resolve(true);
      } catch (error) {
        ApiResponse(new Response(400, error, null, null, res));
        return Promise.resolve(false);
      }
    }
  },
  deleteArticle: async (articleId, res) => {
    if (typeof articleId !== "string" || articleId === "" || articleId === undefined) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogArticleMod.findOne({ article_id: articleId }).where('state').equals(0) === null) {
      ApiResponse(new Response(400, '文章不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  selectArticleCommentFromId: async (limit, pages, query, res) => {
    if (typeof limit !== 'number' || typeof pages !== 'number' || limit <= 0 || pages <= 0 || limit >= 50 || pages >= 9999) {
      ApiResponse(new Response(400, '分页数据不合法', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  updateCommentFromId: async (id, comment, res) => {
    if (typeof id !== "string" || id === "" || id === undefined) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogCommentMod.findOne({ _id: id }).where('state').equals(0) === null) {
      ApiResponse(new Response(400, '评论不存在', null, null, res));
      return Promise.resolve(false);
    } else if (typeof comment !== "string" || comment === undefined) {
      ApiResponse(new Response(400, '数据不合法', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
};