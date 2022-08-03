const { BlogCategorieMod, BlogArticleMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');
exports.blogCategorieService = {

    insertCategorie: (Categorie, res) => {
        BlogCategorieMod.create({
            categorie: Categorie,
            create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).then(data => {
            ApiResponse(new Response(200, '添加分类成功', data, null, res));
        });
    },

    selectCategorie: (req, res) => {
        BlogCategorieMod.find({}).then(data => {
            ApiResponse(new Response(200, 'success', data, null, res));
        });
    },

    updateCategorie: (oldedit, newedit, res) => {

        BlogCategorieMod.updateOne({
            categorie: newedit,
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).where('categorie').equals(oldedit).exec(async (err, doc) => {
            if (err) {
                ApiResponse(new Response(500, '网络错误', null, null, res));
            } else {
                try {
                    //修改分类同时修改文章对应分类
                    let updateMany = await BlogArticleMod.updateMany({
                        categorie: newedit,
                        update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    }).where('categorie').equals(oldedit);
                    if (updateMany) {
                        ApiResponse(new Response(200, '修改分类成功', doc, updateMany, res));
                    } else throw new Error("修改分类成功，修改文章分类失败");
                } catch (error) {
                    ApiResponse(new Response(500, error, null, null, res));
                }
            }
        });
    },

    deleteCategorie: (uname, res) => {
        BlogCategorieMod.deleteOne({ categorie: uname }).then(data => {
            if (data) {
                ApiResponse(new Response(200, '删除成功', null, null, res));
            } else {
                ApiResponse(new Response(500, '修改失败', null, null, res));
            }
        });
    }

};