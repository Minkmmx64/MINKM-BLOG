const { Response, ApiResponse } = require('../middleware/response');
const { BlogIndexImageShowMod } = require("../config/mongoDbServer");
const moment = require('moment');
exports.blogBannersService = {
  addBlogBanners: async (param, res) => {
    let { avatar, title, url } = param;

    try {
      let created = await BlogIndexImageShowMod.create({
        avatar: avatar,
        title: title,
        url: url,
        create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      if (created) {
        ApiResponse(new Response(200, '图片添加成功', created, null, res));
      } else throw new Error('图片添加失败');
    } catch (error) {
      ApiResponse(new Response(500, error, null, null, res));
    }

  },
  getBlogBanners: async (req, res) => {
    try {
      let document = await BlogIndexImageShowMod.find();
      if (document) {
        ApiResponse(new Response(200, '查找成功', document, null, res));
      } else throw new Error('查找失败');
    } catch (error) {
      ApiResponse(new Response(500, error, null, null, res));
    }
  },
  updateBlogBanners: async (_id, value, res) => {
    let { avatar, title, url } = value;
    try {
      let update = await BlogIndexImageShowMod.updateOne(
        {
          _id: _id
        },
        {
          avatar,
          title,
          url,
          update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      if (update) {
        ApiResponse(new Response(200, '修改成功', update, null, res));
      } else throw new Error('修改失败');
    } catch (error) {
      ApiResponse(new Response(500, error, null, null, res));
    }
  },
  deleteBlogBanners: async (_id, res) => {
    try {
      let del = await BlogIndexImageShowMod.deleteOne({ _id: _id });
      if (del) {
        ApiResponse(new Response(200, '删除成功', del, null, res));
      } else throw new Error('删除失败');
    } catch (error) {
      ApiResponse(new Response(500, error, null, null, res));
    }
  },
};