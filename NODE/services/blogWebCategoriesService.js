const { BlogWebCategoriesMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');

exports.blogWebCategoriesService = {
  addWebCategories: async (req, res) => {
    const { categories } = req.body;
    try {
      let insert = await BlogWebCategoriesMod.create({
        categories: categories,
        create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      ApiResponse(new Response(200, '网页分类添加成功', insert, null, res));
    } catch (error) {
      ApiResponse(new Response(500, '网页分类添加失败' + error, null, null, res));
    }
  },
  getWebCategories: async (req, res) => {
    let { pages, limits, /* search, query */ } = req.query;
    pages = parseInt(pages);
    limits = parseInt(limits);
    try {
      const total = await BlogWebCategoriesMod.estimatedDocumentCount();
      const data = await BlogWebCategoriesMod.find().skip((pages - 1) * limits).limit(limits);

      ApiResponse(new Response(200, '网页分类查找成功', data, { count: total }, res));
    } catch (error) {
      ApiResponse(new Response(500, '网页分类查找失败' + error, null, null, res));
    }
  },
  updateWebCategories: async (req, res) => {
    const { categories, id } = req.body;
    try {
      let update = await BlogWebCategoriesMod.updateOne({
        categories: categories,
        update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      }).where("_id").equals(id);
      ApiResponse(new Response(200, '网页分类修改成功', update, null, res));
    } catch (error) {
      ApiResponse(new Response(500, '网页分类修改失败' + error, null, null, res));
    }
  },
  deleteWebCategories: async (req, res) => {
    const { id } = req.query;
    try {
      let del = await BlogWebCategoriesMod.deleteOne().where("_id").equals(id);
      ApiResponse(new Response(200, '网页分类删除成功', del, null, res));
    } catch (error) {
      ApiResponse(new Response(500, '网页分类删除失败' + error, null, null, res));
    }
  }
};