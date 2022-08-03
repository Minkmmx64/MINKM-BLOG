const { BlogArticleMod, BlogDetailsMod, BlogCommentMod } = require('../config/mongoDbServer');
const moment = require('moment');
const { Snowflake } = require('../common/index');
const { Response, ApiResponse } = require('../middleware/response');

exports.blogArticleService = {

    //添加文章

    addArticle: (data, res) => {
        let id = Snowflake();
        let { title, label, author, categorie, describe, content, picture, signature } = data;
        BlogArticleMod.create({
            title,
            picture,
            label: label,
            signature,
            categorie,
            author,
            describe,
            content,
            article_id: `${id}`,
            state: 1,
            create_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).then(data => {
            if (typeof data === 'object') {
                ApiResponse(new Response(200, '文章发布成功', null, null, res));

                /**
                 * 添加文章成功并且初始化文章详情
                 */
                BlogDetailsMod.create({ article_id: `${id}` });
            }
            else ApiResponse(new Response(500, '文章发布失败', null, null, res));
        }).catch(error => {
            ApiResponse(new Response(500, error, null, null, res));
        });
    },
    //获取第一个文章
    getHotArticle: (article_id, uname, res) => {

        BlogArticleMod.findOne({ article_id: article_id }).exec((err, document) => {
            if (document) {
                //获取详情
                BlogDetailsMod.findOne({ article_id: article_id }).then(doc => {
                    if (doc) {
                        ApiResponse(new Response(200, '获取文章成功', { document, doc }, null, res));

                        if (uname !== null && uname !== undefined && typeof uname === 'string') {
                            BlogDetailsMod.updateOne(
                                { article_id: article_id },
                                {
                                    $inc: {
                                        'browse': 1
                                    }
                                }
                            ).then(d => {
                                if (d) {
                                    console.log('增加浏览成功', d);
                                }
                            }).catch(err => { console.log(err); });
                        }
                    } else ApiResponse(new Response(500, '获取文章失败', null, null, res));
                });
            } else {
                ApiResponse(new Response(500, '获取文章失败', null, null, res));
            }
        });
    },

    //获取所有文章
    selectEffectiveArticle: async (limits, pages, search, res) => {
        let { user, content, title, categorie } = JSON.parse(search);

        BlogArticleMod.find(
            {
                $and: [
                    { author: { $regex: user } },
                    { content: { $regex: content } },
                    { signature: { $regex: user } },
                    { title: { $regex: title } },
                    { categorie: { $regex: categorie } }
                ],
            }).where('state').equals(1).exec((err, document) => {
                BlogArticleMod.find(
                    {
                        $and: [
                            { author: { $regex: user } },
                            { content: { $regex: content } },
                            { signature: { $regex: user } },
                            { title: { $regex: title } },
                            { categorie: { $regex: categorie } }
                        ],
                    },
                )
                    .select('title label author signature categorie describe content picture article_id create_at update_at state')
                    .where('state').equals(1)
                    .skip((pages - 1) * limits)
                    .limit(limits)
                    .exec((err, data) => {
                        if (data) {
                            ApiResponse(new Response(200, '获取文章成功', data, { count: document.length }, res));
                            //res.send({state:200,data,meta:{count:document.length}});
                        } else {
                            ApiResponse(new Response(500, '获取文章失败' + err, null, null, res));
                        }
                    });
            });
    },
    //修改文章
    updateOneArticle: (req, res) => {
        let {
            title,
            label,
            author,
            categorie,
            describe,
            picture,
            content,
            signature,
            article_id
        } = req.body;

        BlogArticleMod.updateOne({
            title,
            picture,
            label: label,
            author,
            signature,
            categorie,
            describe,
            content,
            update_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        }).where('article_id').equals(article_id).exec((err, document) => {
            if (document) {
                ApiResponse(new Response(200, '修改文章成功', null, null, res));
            } else {
                ApiResponse(new Response(500, '修改文章失败', null, null, res));
            }
        });
    },
    /**
     * 软删除文章
     */
    recoveryArticle: (state, id, res) => {

        BlogArticleMod.updateOne({ state: state }).where('article_id').equals(id).exec((err, document) => {
            if (document) {
                ApiResponse(new Response(200, `${state ? '恢复' : '删除'}文章成功`, null, null, res));
            } else {
                ApiResponse(new Response(500, `${state ? '恢复' : '删除'}文章失败`, null, null, res));
            }
        });
    },
    /**
     * 获取软删除文章
     */
    selectRecoveryArticle: (pages, limit, search, res) => {
        let { user, content, title, categorie } = JSON.parse(search);
        BlogArticleMod.find(
            {
                $and: [
                    { author: { $regex: user } },
                    { content: { $regex: content } },
                    { signature: { $regex: user } },
                    { title: { $regex: title } },
                    { categorie: { $regex: categorie } }
                ],
            }).where('state').equals(0).exec((err, document) => {
                BlogArticleMod.find({
                    $and: [
                        { author: { $regex: user } },
                        { content: { $regex: content } },
                        { signature: { $regex: user } },
                        { title: { $regex: title } },
                        { categorie: { $regex: categorie } }
                    ],
                })
                    .select('title label author signature categorie describe content picture article_id create_at update_at state')
                    .where('state').equals(0)
                    .skip(limit * (pages - 1))
                    .limit(limit)
                    .exec((err, data) => {
                        if (data) {
                            ApiResponse(new Response(200, `获取文章成功`, data, { count: document.length }, res));
                        } else {
                            ApiResponse(new Response(500, `获取文章失败`, null, null, res));
                        }
                    });
            });
    },
    /**
     * 硬删除文章
     */
    deleteArticle: (id, res) => {

        BlogArticleMod.deleteOne().where('article_id').equals(id).exec(async (err, data) => {
            if (data) {
                try {
                    await BlogCommentMod.deleteMany({ article_id: id });
                    await BlogDetailsMod.deleteOne({ article_id: id });
                    ApiResponse(new Response(200, `文章删除成功,删除评论列表成功`, null, null, res));
                } catch (error) {
                    ApiResponse(new Response(200, `文章删除成功,删除评论列表失败`, null, null, res));
                }
            } else {

                ApiResponse(new Response(500, `文章删除失败`, null, null, res));
            }
        });
    },

    selectArticleDetails: async (limit, pages, res) => {

        let getArticleTotals = await (await BlogArticleMod.find().where('state').equals(1)).length;

        BlogDetailsMod.aggregate([{
            $facet: {
                paginatedResult: [
                    {
                        $skip: (pages - 1) * limit
                    },
                    {
                        $limit: limit
                    },
                    {
                        $lookup: {
                            from: 'blog_articles',
                            localField: 'article_id',
                            foreignField: 'article_id',
                            as: 'item'
                        }
                    },
                ]
            }
        }],
        ).then(d => {
            let result = [...d][0].paginatedResult;
            let data = [];
            result.forEach(e => {
                let {
                    article_id,
                    collections,
                    browse,
                    comment,
                    item
                } = e;

                if (item !== [] && item.length !== undefined && item.length !== 0) {
                    let ele = {
                        article_id,
                        collections,
                        browse,
                        comment,
                        title: item[0].title
                    };
                    data.push(ele);
                }
            });
            ApiResponse(new Response(200, `获取详情成功`, data, { count: getArticleTotals }, res));
        }).catch(err => {
            ApiResponse(new Response(500, err, null, null, res));
        });
    },
    //获取文章评论
    selectArticleCommentFromId: (limit, pages, query, res) => {
        let { articleId, pid } = query;
        BlogCommentMod.find({ article_id: articleId }).where('parent_id').equals(pid).then(document => {
            BlogCommentMod.find({ article_id: articleId }).where('parent_id').equals(pid).skip((pages - 1) * limit).limit(limit).then(data => {
                ApiResponse(new Response(200, `获取评论成功`, data, { count: document.length }, res));
            });
        });
    },
    //修改文章评论
    updateCommentFromId: async (id, comment, res) => {
        try {
            let data = await BlogCommentMod.updateOne({ _id: id }, { comment: comment });
            ApiResponse(new Response(200, `修改评论成功`, data, null, res));
        } catch (error) {
            ApiResponse(new Response(500, `修改评论失败` + error, null, null, res));
        }
    }
};