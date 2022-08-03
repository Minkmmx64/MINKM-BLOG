const mongoose = require('mongoose');
const { userImgUrl } = require('./baseUrl');
/**
 * 用户信息表
 */
const UserRegistSchema = new mongoose.Schema({
    username: { type: String },                                                   //用户名
    userpsd: { type: String },                                                    //密码
    nickname: { type: String },                                                   //昵称
    userphone: { type: String },                                                  //手机号
    sex: { type: Number, default: 1 },                                            //性别
    imgUrl: { type: String, default: userImgUrl + 'head.jpeg' },                  //头像
    update_time: { type: String },                                                //上线时间
    create_time: { type: String },                                                //创建时间
    u_token: { type: String },                                                    //用户token
    admission: { type: Number, default: 0 }                                       //权限
});

/**
 * 添加好友请求表
 */
const UserAddSchema = new mongoose.Schema({
    username: { type: String },                                                   //接收方
    send_username: { type: String },                                              //发送请求方           
    state: { type: Number },                                                      //是否添加,0表示正在申请,1表示好友,-1表示拒绝
    creat_time: { type: Date }                                                    //申请时间
});
/**
 * 一对一消息表
 */
const UserFriendMsgSchema = new mongoose.Schema({
    username: { type: String },                                                   //我
    create_at: { type: String },                                                  //发送时间
    friend: { type: String },                                                     //好友          
    state: { type: Number },                                                      //状态0表示我向他发消息,1表示他向我发消息
    msg: { type: String },                                                        //消息内容
    types: { type: String }
});
/**
 * 全局消息表
 */
const GolbalUserMsgSchema = new mongoose.Schema({
    username: { type: String, },                                                  //用户名
    avatar: { type: String, },                                                    //头像
    content: { type: String, },                                                   //内容
    created_at: { type: String, },                                                //发送时间
    types: { type: String }                                                       //消息类型
});
/**
 * 博客分类表
 */
const BlogCategorieSchema = new mongoose.Schema({
    categorie: { type: String },                                                  //分类
    create_at: { type: String },                                                  //创建时间
    update_at: { type: String }                                                   //修改时间
});
/**
 * 博客文章表
 */
const BlogArticleSchema = new mongoose.Schema({
    title: { type: String },                                                      //标题
    label: { type: Array },                                                       //标签
    author: { type: String },                                                     //作者id
    signature: { type: String },                                                  //作者署名
    categorie: { type: String },                                                  //分类
    describe: { type: String },                                                   //描述
    content: { type: String },                                                    //文章内容
    picture: { type: String },                                                    //文章封面
    article_id: { type: String },                                                 //文章唯一ID
    create_at: { type: String },                                                  //创建时间
    update_at: { type: String },                                                  //修改时间
    state: { type: Number },                                                      //软删除
});
/**
 * 博客详情表
 */
const BlogDetailsSchema = new mongoose.Schema({
    article_id: { type: String, },                                                //文章id
    collections: { type: Number, default: 0 },                                    //收藏数
    browse: { type: Number, default: 0 },                                         //浏览数
    comment: { type: Number, default: 0 }                                         //评论数
});
/**
 * 博客标签表
 */
const BlogLabelSchema = new mongoose.Schema({
    label: { type: String },                                                      //标签
    create_at: { type: String },                                                  //创建时间
    update_at: { type: String }                                                   //修改时间
});
/**
 * 博客评论表
 */
const BlogCommentSchema = new mongoose.Schema({
    username: { type: String },                                                   //用户名
    avatar: { type: String },                                                     //头像
    comment: { type: String },                                                    //评论
    article_id: { type: String },                                                 //文章id
    parent_id: { type: String, default: 'root' },                                 //pid
    /*like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },*/
    comment_like: { type: Number, default: 0 },                                   //是否点赞
    comment_dislike: { type: Number, default: 0 },                                //是否踩
    created_at: { type: String }                                                  //创建时间
});
/**
 * 博客点赞表
 */
const BlogCommentPraiseSchema = new mongoose.Schema({
    username: { type: String },                                                   //点赞用户
    comment_id: { type: String },                                                 //点赞评论
    like: { type: Number, default: 0 },                                           //点赞?
    dislike: { type: Number, default: 0 },                                        //踩?
    created_at: { type: String },                                                 //点赞时间
    article_id: { type: String },                                                 //评论文章
});

/**
 * 网页分享表
 */
const BlogHTMLShareSchema = new mongoose.Schema({
    imgUrl: { type: String },                                                     //图片封面
    url: { type: String },                                                        //网页地址
    title: { type: String },                                                      //网页标题
    create_at: { type: String },                                                  //创建时间
    describe: { type: String },                                                   //描述
    update_at: { type: String },                                                  //修改时间
    classname: { type: String },                                                  //分类
});
/**
 * 网页分享分类表
 */
const BlogWebCategoriesSchema = new mongoose.Schema({
    categories: { type: String },                                                 //分类
    update_at: { type: String },                                                  //修改时间
    create_at: { type: String },                                                  //创建时间
});

/**
 * 留言板
 */
const BlogMessageBoardSchema = new mongoose.Schema({
    username: { type: String },                                                   //用户名
    email: { type: String },                                                      //邮箱
    phone: { type: String },                                                      //手机号
    content: { type: String },                                                    //留言内容
    side: { type: String },                                                       //站点
    avatar: { type: String },                                                     //头像
    qqnumber: { type: String },                                                   //qq号
    islogin: { type: Boolean, default: false },                                   //是否登录留言
    pid: { type: String },                                                        //pid
    isread: { type: Boolean, default: false },                                    //是否已读
    create_at: { type: String },                                                  //创建时间
    replayuser: { type: String },                                                 //回复的用户
    admission: { type: Number }                                                   //权限
});

/**
 * 首页图片展示
 */
const BlogIndexImageShowSchema = new mongoose.Schema({
    avatar: { type: String },                                                      //图片链接
    title: { type: String },                                                       //标题
    url: { type: String },                                                         //图片跳转链接
    create_at: { type: String },                                                   //创建时间
    update_at: { type: String },                                                   //修改时间
});

/**  
 * 友链  
 */
const FriendChainSchema = new mongoose.Schema({
    chain_avatar: { type: String },                                                //友链头像
    chain_describe: { type: String },                                              //友链描述
    chain_side: { type: String },                                                  //站点地址
    chain_title: { type: String },                                                 //站点标题
    create_at: { type: String },                                                   //创建时间
    update_at: { type: String },                                                   //修改时间
});

const UserRegistMod = mongoose.model('user_collection', UserRegistSchema);
const UserAddMod = mongoose.model('user_add', UserAddSchema);
const UserFriendMsgMod = mongoose.model('user_friend_msg', UserFriendMsgSchema);
const BlogCategorieMod = mongoose.model('blog_categorie', BlogCategorieSchema);
const BlogArticleMod = mongoose.model('blog_article', BlogArticleSchema);
const BlogLabelMod = mongoose.model('blog_label', BlogLabelSchema);
const BlogDetailsMod = mongoose.model('blog_details', BlogDetailsSchema);
const GolbalUserMsgMod = mongoose.model('golbal_msg', GolbalUserMsgSchema);
const BlogCommentMod = mongoose.model('blog_comment', BlogCommentSchema);
const BlogHTMLShareMod = mongoose.model('blog_html_share', BlogHTMLShareSchema);
const BlogMessageBoardMod = mongoose.model('blog_msg_board', BlogMessageBoardSchema);
const BlogIndexImageShowMod = mongoose.model('blog_index_image', BlogIndexImageShowSchema);
const BlogCommentPraiseMod = mongoose.model('blog_comment_praise', BlogCommentPraiseSchema);
const FriendChainMod = mongoose.model('friend_chain', FriendChainSchema);
const BlogWebCategoriesMod = mongoose.model('blog_web_categories', BlogWebCategoriesSchema);

module.exports = {
    UserRegistMod,
    UserAddMod,
    UserFriendMsgMod,
    BlogCategorieMod,
    BlogArticleMod,
    BlogLabelMod,
    BlogDetailsMod,
    GolbalUserMsgMod,
    BlogCommentMod,
    BlogHTMLShareMod,
    BlogMessageBoardMod,
    BlogIndexImageShowMod,
    BlogCommentPraiseMod,
    FriendChainMod,
    BlogWebCategoriesMod
};
