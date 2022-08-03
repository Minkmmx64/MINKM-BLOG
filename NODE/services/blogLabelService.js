const { BlogLabelMod, BlogArticleMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');
exports.blogLabelService = {

    addLabel: (label, res) => {

        BlogLabelMod.create({
            label: label,
            create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).then(data => {
            ApiResponse(new Response(200, '添加标签成功', data, null, res));
        }).catch(error => {
            ApiResponse(new Response(500, '添加标签失败' + error, null, null, res));
        });
    },

    deleteLabel: (deleteV, res) => {

        BlogLabelMod.deleteOne().where('label').equals(deleteV).exec((err, doc) => {
            if (doc) {
                ApiResponse(new Response(200, '删除标签成功', doc, null, res));
            } else {
                ApiResponse(new Response(500, '删除标签失败' + err, null, null, res));
            }
        });
    },

    updateLabel: (oldV, newV, res) => {

        BlogLabelMod.updateOne({
            label: newV,
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).where('label').equals(oldV).exec(async (err, document) => {
            if (document) {
                //修改标签同时修改文章对应标签字段
                let updateLabel = await BlogArticleMod.updateMany(
                    {
                        label: {
                            $all: [oldV]
                        }
                    },
                    {
                        $set: {
                            "label.$": newV
                        }
                    }
                );
                if (updateLabel) ApiResponse(new Response(200, '修改标签成功且文章标签修改成功', document, null, res));
                else {
                    ApiResponse(new Response(500, '修改标签成功,文章标签修改失败' + err, null, null, res));
                }
            } else {
                ApiResponse(new Response(500, '修改标签失败' + err, null, null, res));
            }
        });
    },

    selectLabel: (req, res) => {

        BlogLabelMod.find().then(data => {
            ApiResponse(new Response(200, '获取标签成功', data, null, res));
        }).catch(error => {
            ApiResponse(new Response(500, '获取标签失败' + error, null, null, res));
        });
    }
};