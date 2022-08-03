const db = require('../config/mongoDbServer');
const moment = require('moment');
const { Response, ApiResponse } = require('../middleware/response');
const { memory } = require('../Utils/os');
exports.blogClientService = {

    selectBlogClientArticle: async (limit, size, search, res) => {
        let { selectSearch: { categorie }, inputSearch } = JSON.parse(search);
        inputSearch = new RegExp(inputSearch, "i");
        try {
            let document = await (await db.BlogArticleMod.find().where('state').equals(1)).length;
            db.BlogArticleMod.find(
                {
                    $or: [
                        {
                            label:
                                { $regex: categorie }
                        },
                        {
                            categorie:
                                { $regex: categorie }
                        },
                    ],
                    $and: [
                        {
                            title:
                                { $regex: inputSearch }
                        },
                    ]
                }
            ).select('article_id picture label title categorie create_at update_at')
                .skip(limit * (size - 1))
                .limit(limit)
                .where('state').equals(1)
                .exec(async (err, doc) => {
                    if (err) {
                        ApiResponse(new Response(500, '获取文章字段失败' + err, null, null, res));
                    } else {
                        try {
                            let query = await db.BlogArticleMod.aggregate([
                                {
                                    $project: {
                                        categorie: 1
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$categorie",
                                        count: { $sum: 1 }
                                    }
                                }
                            ]);
                            ApiResponse(new Response(200, 'success', doc, { count: document, query }, res));
                        } catch (error) {
                            ApiResponse(new Response(500, '获取文章字段失败' + error, null, null, res));
                        }
                    }
                });
        } catch (error) {
            ApiResponse(new Response(500, '获取文章字段失败' + error, null, null, res));
        }
    },

    insertSendBlogArticle: (req, res) => {

        const { data } = req.body;
        const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

        let {
            username,
            comment,
            article_id,
            parent_id,
            avatar
        } = data;

        try {
            if (typeof article_id !== 'string') {
                throw new Error('数据不合法');
            } else {
                db.BlogCommentMod.create({
                    username,
                    avatar,
                    comment,
                    article_id,
                    parent_id,
                    created_at
                }).then(data => {
                    if (data) {
                        db.BlogDetailsMod.updateOne(
                            { article_id: article_id },
                            {
                                $inc: {
                                    'comment': 1
                                }
                            }
                        ).then(d => {
                            if (d) {
                                ApiResponse(new Response(200, '发布评论成功', null, null, res));
                            }
                            else throw new Error('修改评论数失败');
                        });
                    }
                    else throw new Error('发布评论失败');
                }).catch(err => {
                    throw new Error(err);
                });
            }
        } catch (error) {
            ApiResponse(new Response(500, error, null, null, res));
        }
    },

    selectCommentByArticleId: (id, res) => {

        try {
            if (id === undefined || id === null || id === '') {
                throw new Error('参数不合法');
            }
            if (typeof id !== 'string') {
                throw new Error('参数不合法');
            }
            db.BlogCommentMod.find({ article_id: id }).then(d => {
                if (d) {
                    ApiResponse(new Response(200, '获取评论成功', d, null, res));
                }
                else {
                    throw new Error('获取失败');
                }
            }).catch(err => {
                throw new Error(err);
            });
        } catch (error) {
            ApiResponse(new Response(500, '获取评论失败' + error, null, null, res));
        }
    },
    praiseArticleComment: (commentId, data, res) => {
        let { like, like_count, dislike, dislike_count, username, article_id } = data;

        //更新评论表点赞数据
        const upDateComment = async (res) => {
            try {
                let update = await db.BlogCommentMod.updateOne(
                    {
                        _id: commentId,
                    },
                    {
                        $inc: {
                            'comment_like': like_count,
                            'comment_dislike': dislike_count
                        }
                    }
                );
                if (update) {
                    ApiResponse(new Response(200, '点赞成功', update, null, res));
                } else throw new Error('更新点赞失败');
            } catch (error) {
                ApiResponse(new Response(500, '点赞失败' + error, null, null, res));
            }
        };
        //寻找评论点赞表中用户是否已经操作过
        db.BlogCommentPraiseMod.findOne({ username: username }).where('comment_id').equals(commentId).then(findOne => {
            if (findOne === null) {
                //没有就新建
                db.BlogCommentPraiseMod.create({
                    username: username,
                    comment_id: commentId,
                    like: like,
                    dislike: dislike,
                    article_id: article_id,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                }).then(createMod => {
                    if (createMod) {
                        upDateComment(res);
                    }
                    else ApiResponse(new Response(500, '点赞失败', null, null, res));
                }).catch(err => {
                    ApiResponse(new Response(500, '点赞失败' + err, null, null, res));
                });
            } else {
                db.BlogCommentPraiseMod.updateOne(
                    {
                        username: username,
                        comment_id: commentId
                    },
                    {
                        like: like,
                        dislike: dislike,
                    }
                ).then(updatePraise => {
                    if (updatePraise) {
                        upDateComment(res);
                    } else ApiResponse(new Response(500, '点赞失败', null, null, res));
                }).catch(err => {
                    ApiResponse(new Response(500, '点赞失败' + err, null, null, res));
                });
            }
        });
    },
    selectUserPraiseFromArticleId: (username, userId, res) => {
        db.BlogCommentPraiseMod.findOne({ comment_id: userId, username: username }).then(document => {
            ApiResponse(new Response(200, '获取点赞列表成功', document, null, res));
        }).catch(error => {
            ApiResponse(new Response(500, '获取点赞列表失败' + error, null, null, res));
        });
    },
    selectBlogFile: (res) => {
        db.BlogArticleMod.aggregate([
            {
                $match: { "state": 1 }
            },
            {
                $project: {
                    create_at: {
                        $substr: ["$create_at", 0, 7]
                    },
                    update_at: {
                        $substr: ["$create_at", 5, 5]
                    },
                    "title": 1,
                    "article_id": 1,
                },
            },
            {
                $group: {
                    _id: "$create_at",
                    document: {
                        $push: {
                            title: "$title",
                            update_at: "$update_at",
                            article_id: "$article_id"
                        }
                    },
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).then(document => {
            ApiResponse(new Response(200, '获取归档成功', document, null, res));
        }).catch(error => {
            ApiResponse(new Response(500, '获取归档失败' + error, null, null, res));
        });
    },
    adminInfo: async (res) => {
        let [browse, comment, article, like, dislike] = [0, 0, 0, 0, 0];
        try {
            let query = await db.BlogArticleMod.aggregate([
                {
                    $lookup: {
                        from: "blog_details",
                        localField: "article_id",
                        foreignField: "article_id",
                        as: "blogItems"
                    }
                },
                { $match: { state: 1 } },
                {
                    $project: {
                        "blogItems.article_id": 1,
                        "blogItems.browse": 1,
                        "blogItems.comment": 1,
                    }
                },
            ]);
            if (query !== null) {
                article = query.length;
                query.forEach((element) => {
                    if (element.blogItems.length) {
                        browse += element.blogItems[0].browse;
                        comment += element.blogItems[0].comment;
                    }
                });
            }
            try {
                let praise = await db.BlogArticleMod.aggregate([
                    {
                        $lookup: {
                            from: "blog_comment_praises",
                            localField: "article_id",
                            foreignField: "article_id",
                            as: "blogItems"
                        }
                    },
                    { $match: { state: 1 } },
                    {
                        $project: {
                            "blogItems.username": 1,
                            "blogItems.like": 1,
                            "blogItems.dislike": 1,
                        }
                    }
                ]);
                if (praise !== null) {
                    praise.map(k => {
                        if (k.blogItems.length) {
                            k.blogItems.map(v => {
                                like += v.like;
                                dislike += v.dislike;
                            });
                        }
                    });
                    let category = await db.BlogCategorieMod.estimatedDocumentCount();
                    let label = await db.BlogLabelMod.estimatedDocumentCount();
                    let leavemsg = await (await db.BlogMessageBoardMod.find({ pid: "root" })).length;
                    let { percentage, cpu } = memory();
                    ApiResponse(new Response(200, '获取首页信息成功', { browse, comment, article, like, dislike, category, label, leavemsg, percentage, cpu }, null, res));
                }
            } catch (error) {
                ApiResponse(new Response(500, '查询点赞信息失败' + error, null, null, res));
            }
        } catch (error) {
            ApiResponse(new Response(500, '查询文章信息失败' + error, null, null, res));
        }
    },
    clientLabelandCategories: async (res) => {
        try {
            let categories = await db.BlogArticleMod.aggregate([
                {
                    $project: {
                        categorie: 1
                    }
                },
                {
                    $group: {
                        _id: "$categorie",
                        count: { $sum: 1 }
                    }
                }
            ]);
            let label = await db.BlogArticleMod.aggregate([
                {
                    $match: {
                        state: 1
                    }
                },
                {
                    $project: {
                        _id: 0, label: 1
                    }
                },
                {
                    $unwind: "$label"
                },
                {
                    $group: {
                        _id: "$label", count: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        tags: -1
                    }
                }
            ]);
            ApiResponse(new Response(200, '查询标签分类成功', { categories, label }, null, res));
        } catch (error) {
            ApiResponse(new Response(500, '查询标签分类失败' + error, null, null, res));
        }
    },
    HomeBlogArticle: async (limit, current, query, search, res) => {
        const poj = {
            title: 1,
            label: 1,
            author: 1,
            categorie: 1,
            describe: 1,
            picture: 1,
            article_id: 1,
            create_at: 1,
            update_at: 1,
        };
        try {
            const find = JSON.parse(search).search;
            switch (query) {
                case 0: {
                    let query = await db.BlogArticleMod.aggregate([
                        {
                            $match: {
                                state: 1, $or: [
                                    { label: { $regex: find } },
                                    { categorie: { $regex: find } },
                                ],
                            }
                        },
                        { $sort: { "create_at": -1 } },
                        { $skip: current * limit },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "blog_details",
                                localField: "article_id",
                                foreignField: "article_id",
                                as: "items"
                            }
                        },
                        {
                            $project: Object.assign(poj, {
                                "items.article_id": 1,
                                "items.collections": 1,
                                "items.browse": 1,
                                "items.comment": 1,
                            })
                        },
                    ]);
                    ApiResponse(new Response(200, 'success', query, null, res));
                    break;
                }
                case 1: {
                    let query = await db.BlogArticleMod.aggregate([

                        {
                            $match: {
                                state: 1, $or: [
                                    { label: { $regex: find } },
                                    { categorie: { $regex: find } },
                                ],
                            }
                        },
                        {
                            $lookup: {
                                from: "blog_details",
                                localField: "article_id",
                                foreignField: "article_id",
                                as: "items"
                            }
                        },
                        {
                            $project: Object.assign(poj, {
                                "items.article_id": 1,
                                "items.collections": 1,
                                "items.browse": 1,
                                "items.comment": 1,
                            })
                        },
                        { $sort: { "items.browse": -1 } },
                        { $skip: current * limit },
                        { $limit: limit },
                    ]);
                    ApiResponse(new Response(200, 'success', query, null, res));
                    break;
                }
                case 2: {
                    let query = await db.BlogArticleMod.aggregate([
                        {
                            $match: {
                                state: 1,
                                $or: [
                                    { label: { $regex: find } },
                                    { categorie: { $regex: find } },
                                ],
                            },
                        },
                        {
                            $lookup: {
                                from: "blog_details",
                                localField: "article_id",
                                foreignField: "article_id",
                                as: "items"
                            }
                        },
                        {
                            $project: Object.assign(poj, {
                                "items.article_id": 1,
                                "items.collections": 1,
                                "items.browse": 1,
                                "items.comment": 1,
                            })
                        },
                        { $sort: { "update_at": -1 } },
                        { $skip: current * limit },
                        { $limit: limit },
                    ]);
                    ApiResponse(new Response(200, 'success', query, null, res));
                    break;
                }
                case 3: {
                    let query = await db.BlogArticleMod.aggregate([
                        {
                            $match: {
                                state: 1,
                                $or: [
                                    { label: { $regex: find } },
                                    { categorie: { $regex: find } },
                                ],
                            }
                        },
                        {
                            $lookup: {
                                from: "blog_details",
                                localField: "article_id",
                                foreignField: "article_id",
                                as: "items"
                            }
                        },
                        {
                            $project: Object.assign(poj, {
                                "items.article_id": 1,
                                "items.collections": 1,
                                "items.browse": 1,
                                "items.comment": 1,
                            })
                        },
                        { $sort: { "items.comment": -1 } },
                        { $skip: current * limit },
                        { $limit: limit },
                    ]);
                    ApiResponse(new Response(200, 'success', query, null, res));
                    break;
                }
                default: {
                    ApiResponse(new Response(500, '字段错误', null, null, res));
                    break;
                }
            }
        } catch (error) {
            ApiResponse(new Response(500, '字段错误' + error, null, null, res));
        }
    }
};