const { Response, ApiResponse } = require('../middleware/response');
const { BlogHTMLShareMod } = require('../config/mongoDbServer');
exports.BlogWebShareRequest = {
  addWebShare: async (data, res) => {
    const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g; // 匹配网址
    let { imgUrl, site, title, describe, classname } = data;
    if (title === null || title === undefined || typeof title !== 'string' || title === ''
      || describe === null || describe === undefined || typeof describe !== 'string' || describe === ''
      || imgUrl === null || imgUrl === undefined || typeof imgUrl !== 'string' || imgUrl === ''
      || classname === null || classname === undefined || typeof classname !== 'string' || classname === ''
    ) {
      ApiResponse(new Response(400, '参数格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (!checkUrl.test(site)) {
      ApiResponse(new Response(400, '网址格式不正确', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  selectWebShare: async (limit, size, res) => {
    if (typeof limit !== "number" || typeof size !== "number") {
      ApiResponse(new Response(400, '参数格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (limit >= 50 || limit <= 0 || size >= 9999 || size <= 0) {
      ApiResponse(new Response(400, '非法参数', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  updateWebShare: async (imgUrl, site, title, describe, id, classname, res) => {
    const checkUrl = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g; // 匹配网址
    if (title === null || title === undefined || typeof title !== 'string' || title === ''
      || describe === null || describe === undefined || typeof describe !== 'string' || describe === ''
      || imgUrl === null || imgUrl === undefined || typeof imgUrl !== 'string' || imgUrl === ''
      || id === null || id === undefined || typeof id !== 'string' || id === ''
      || classname === null || classname === undefined || typeof classname !== 'string' || classname === ''
    ) {
      ApiResponse(new Response(400, '参数格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (!checkUrl.test(site)) {
      ApiResponse(new Response(400, '网址格式不正确', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  },
  deleteWebShare: async (id, res) => {
    if (typeof id !== "string" || id === undefined || id === "" || id === null) {
      ApiResponse(new Response(400, '参数格式不正确', null, null, res));
      return Promise.resolve(false);
    } else if (await BlogHTMLShareMod.findOne({ _id: id }) === null) {
      ApiResponse(new Response(400, 'id不存在', null, null, res));
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
};