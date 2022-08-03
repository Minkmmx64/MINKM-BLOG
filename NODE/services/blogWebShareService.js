const { BlogHTMLShareMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');
exports.blogWebShareService = {
  addWebShare: async (data, res) => {
    let { imgUrl, site, title, describe, classname } = data;
    try {
      let insertWebShare = BlogHTMLShareMod.create({
        imgUrl: imgUrl,
        url: site,
        title: title,
        describe: describe,
        classname: classname,
        create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      if (insertWebShare) {
        ApiResponse(new Response(200, '插入成功', null, null, res));
      }
    } catch (error) {
      ApiResponse(new Response(400, '插入失败' + error, null, null, res));
    }
  },
  selectWebShare: async (limit, size, res) => {
    try {
      let documen = await BlogHTMLShareMod.find();
      if (documen === null) {
        ApiResponse(new Response(400, '数据不存在', null, null, res));
      } else {
        ApiResponse(new Response(200, '查询成功', documen, { count: documen.length }, res));
      }
    } catch (error) {
      ApiResponse(new Response(400, error, null, null, res));
    }
  },
  updateWebShare: async (imgUrl, site, title, describe, id, classname, res) => {
    try {
      let update = await BlogHTMLShareMod.updateOne({ _id: id },
        {
          imgUrl: imgUrl,
          url: site,
          title: title,
          describe: describe,
          classname: classname,
          update_at: moment().format("YYYY-MM-DD HH:mm:ss")
        });
      if (update === null) {
        ApiResponse(new Response(400, '修改失败', null, null, res));
      } else {
        ApiResponse(new Response(200, '修改成功', null, null, res));
      }
    } catch (error) {
      ApiResponse(new Response(400, '修改失败', null, null, res));
    }
  },
  deleteWebShare: async (id, res) => {
    try {
      let del = await BlogHTMLShareMod.deleteOne({ _id: id });
      if (del === null) {
        ApiResponse(new Response(400, '删除失败', null, null, res));
      } else {
        ApiResponse(new Response(200, '删除成功', del, null, res));
      }
    } catch (error) {
      ApiResponse(new Response(400, '删除失败' + error, null, null, res));
    }
  },
  getClientWebShare: async (categorie, res) => {
    try {
      let document = await BlogHTMLShareMod.find(
        {
          classname: {
            $regex: categorie
          }
        }
      );
      if (document === null) {
        ApiResponse(new Response(400, '数据不存在', null, null, res));
      } else {
        try {
          let query = await BlogHTMLShareMod.aggregate([
            {
              $project: {
                title: 1,
                classname: 1,
              }
            },
            {
              $group: {
                _id: "$classname",
                count: { $sum: 1 }
              }
            }
          ]);
          ApiResponse(new Response(200, '查询成功', document, { query }, res));
        } catch (error) {
          ApiResponse(new Response(500, error, null, null, res));
        }
      }
    } catch (error) {
      ApiResponse(new Response(400, error, null, null, res));
    }
  }
};