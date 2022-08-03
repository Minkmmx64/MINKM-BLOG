const db = require("../config/mongoDbServer");
exports.textservice = async (req, res) => {
  /*db.BlogArticleMod.aggregate([
    {
      $match: { "state": 1 }
    },
    {
      $project: {
        create_at: {
          $substr: ["$create_at", 0, 7]
        },
        "title": 1,
        "update_at": 1,
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
  ]).then(d => {
    res.send(d);
  }).catch(e => {
    console.log(e);
  }); */
  /*db.BlogCommentMod.aggregate([
    {
      $match: {
        "article_id": '7o8l6W8l5d6l1o4H8r6e429'
      },
    },
    {
      $project: {
        "username": 1,
        "avatar": 1,
        "comment": 1,
        "parent_id": 1,
        "_id":1
      },
    },
    {
      $group: {
        _id: "$parent_id",
        child: {
          $push: {
            username: "$username",
            avatar: "$avatar",
            comment: "$comment",
            parent_id: "$parent_id",
            _id: "$_id"
          }
        }
      }
    }
  ]).then(d => {
    res.send(d);
  });*/
  /*let query = await db.BlogHTMLShareMod.aggregate([
    {
      $project: {
        title: 1,
        classname: 1,
      }
    },
    {
      $group: {
        _id: "$classname",
        document: { $sum: 1 }
      }
    }
  ]); */
  /*let query = await db.BlogArticleMod.aggregate([
    {
      $project: {
        categorie:1
      }
    },
    {
      $group: {
        _id: "$categorie",
        count: { $sum: 1 }
      }
    }
  ]);*/
  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $lookup: {
  //       from: "blog_details",
  //       localField: "article_id",
  //       foreignField: "article_id",
  //       as: "blogItems"
  //     }
  //   },
  //   { $match: { state: 1 } },
  //   {
  //     $project: {
  //       "blogItems.article_id": 1,
  //       "blogItems.browse": 1,
  //       "blogItems.comment": 1,
  //     }
  //   },
  // ]);
  // let praise = await db.BlogArticleMod.aggregate([
  //   {
  //     $lookup: {
  //       from: "blog_comment_praises",
  //       localField: "article_id",
  //       foreignField: "article_id",
  //       as: "blogItems"
  //     }
  //   },
  //   { $match: { state: 1 } },
  //   {
  //     $project: {
  //       "blogItems.username": 1,
  //       "blogItems.like": 1,
  //       "blogItems.dislike": 1,
  //     }
  //   }
  // ]);
  // let [browse, comment, article, like, dislike] = [0, 0, 0, 0, 0];
  // praise.map(k => {
  //   if (k.blogItems.length) {
  //     k.blogItems.map(v => {
  //       like += v.like;
  //       dislike += v.dislike;
  //     });
  //   }
  // });
  // if (query !== null) {
  //   article = query.length;
  //   query.forEach((element) => {
  //     if (element.blogItems.length) {
  //       browse += element.blogItems[0].browse;
  //       comment += element.blogItems[0].comment;
  //     }
  //   });
  //   res.send({ browse, comment, article, like, dislike });
  // } else res.send([0, 0, 0, 0]);
  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $match: {
  //       state: 1
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 0, label: 1
  //     }
  //   },
  //   {
  //     $unwind: "$label"
  //   },
  //   {
  //     $group: {
  //       _id: "$label", count: { $sum: 1 }
  //     }
  //   },
  //   {
  //     $sort: {
  //       tags: -1
  //     }
  //   }
  // // ]);

  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $sort: {
  //       "create_at": -1
  //     }
  //   }
  // ]);

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

  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $match: {
  //       state: 1,
  //     }
  //   },
  //   {
  //     $project: poj
  //   },
  //   {
  //     $sort: {
  //       "update_at": -1
  //     }
  //   },
  // ]);
  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $lookup: {
  //       from: "blog_details",
  //       localField: "article_id",
  //       foreignField: "article_id",
  //       as: "items"
  //     }
  //   },
  //   {
  //     $project: Object.assign(poj, {
  //       "items.article_id": 1,
  //       "items.collections": 1,
  //       "items.browse": 1,
  //       "items.comment": 1,
  //     })
  //   },
  //   {
  //     $sort: {
  //       "items.browse": -1
  //     }
  //   }
  // ]);
  // let query = await db.BlogArticleMod.aggregate([
  //   {
  //     $lookup: {
  //       from: "blog_details",
  //       localField: "article_id",
  //       foreignField: "article_id",
  //       as: "items"
  //     }
  //   },
  //   {
  //     $project: Object.assign(poj, {
  //       "items.article_id": 1,
  //       "items.collections": 1,
  //       "items.browse": 1,
  //       "items.comment": 1,
  //     })
  //   },
  //   {
  //     $sort: {
  //       "items.comment": -1
  //     }
  //   }
  // ]);
  let query = await db.BlogArticleMod.aggregate([
    {
      $match: {
        state: 1,
      }
    },
    { $skip: 4 },
    { $limit: 4 },
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
  ]);
  res.send(query);
};