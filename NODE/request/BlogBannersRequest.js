const { Response, ApiResponse } = require('../middleware/response');
const { BlogIndexImageShowMod } = require("../config/mongoDbServer");
const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/; // 匹配网址
exports.BlogBannersRequest = {
  addBlogBanners: async (param, res) => {
    let { avatar, title, url } = param;
    if (!checkUrl.test(avatar) || !checkUrl.test(url)) {
      ApiResponse(new Response(400, 'url数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (typeof title !== "string" || title === "" || title === undefined || title === null) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  updateBlogBanners: async (_id, value, res) => {
    let { avatar, title, url } = value;
    if (!checkUrl.test(avatar) || !checkUrl.test(url)) {
      ApiResponse(new Response(400, 'url数据不合法', null, null, res));
      return Promise.resolve(false);
    } else if (typeof title !== "string" || title === "" || title === undefined || title === null) {
      ApiResponse(new Response(400, 'title数据不合法', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  deleteBlogBanners: async (_id, res) => {
    if (await BlogIndexImageShowMod.find({ _id: _id }) === null) {
      ApiResponse(new Response(400, '_id不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
};