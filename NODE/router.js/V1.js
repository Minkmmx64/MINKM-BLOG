const multer = require("multer");
const { QiniuUpload } = require('../common/index');
//文件储存路径
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); //文件存储目录
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); //文件名
    }
});
// 添加配置文件到muler对象。
const upload = multer({ storage: storage });

const C = require('../controller/index');

module.exports = function (app) {

    app.all('/test', (req, res) => {            //测试
        C.testController(req, res);
    });

    app.get('/qiniu/upoad', (req, res) => {    //七牛上传凭证
        QiniuUpload(req, res);
    });

    app.get('/chat/friend/list', (req, res) => {         //获取用户好友列表 
        C.chatController.findFriendList(req, res);
    });

    app.get('/chat/firend/apply', (req, res) => {          //获取好友申请 
        C.chatController.findApply(req, res);
    });

    app.get('/chat/friend/msg', (req, res) => {             //获取历史记录 
        C.chatController.findFriendMsg(req, res);
    });

    app.get('/chat/golbal/message', (req, res) => {       //全局聊天消息
        C.chatController.findGolbalUserMsg(req, res);
    });

    app.post('/chat/upload/img/head', upload.single('img'), function (req, res) {  // 用户头像上传 
        C.chatController.postUserimg(req, res);
    });

    app.post('/blog/post/categorie', (req, res) => {                  //博客文章添加分类
        C.blogCategorieController.addCategorie(req, res);
    });

    app.get('/blog/get/categorie', (req, res) => {                    //获取博客分类列表
        C.blogCategorieController.getCategorie(req, res);
    });

    app.put('/blog/put/categorie', (req, res) => {                    //修改博客分类列表
        C.blogCategorieController.editCategorie(req.body, res);
    });

    app.delete('/blog/delete/categorie', (req, res) => {               //删除分类
        C.blogCategorieController.deleteCategorie(req, res);
    });

    app.post('/blog/post/article', (req, res) => {                     //添加文章
        C.blogArticleController.addArticle(req, res);
    });

    app.get('/blog/get/hot/article', (req, res) => {                   //Id获取文章
        C.blogArticleController.getHotArticle(req, res);
    });

    app.get('/blog/get/all/article', (req, res) => {                   //所有文章
        C.blogArticleController.selectEffectiveArticle(req, res);
    });

    app.put('/blog/put/:id/article', (req, res) => {                   //修改文章
        C.blogArticleController.updateOneArticle(req, res);
    });

    app.get('/blog/get/label', (req, res) => {             //查看标签
        C.blogLabelController.selectLabel(req, res);
    });

    app.post('/blog/post/label', (req, res) => {         //增加标签
        C.blogLabelController.addLabel(req, res);
    });

    app.delete('/blog/delete/label', (req, res) => {    //删除标签
        C.blogLabelController.deleteLabel(req, res);
    });

    app.put('/blog/put/label', (req, res) => {         //修改标签
        C.blogLabelController.updateLabe(req, res);
    });

    app.put('/blog/put/recovery/:id/article', (req, res) => { //软删除文章
        C.blogArticleController.recoveryArticle(req, res);
    });

    app.get('/blog/get/recovery/article', (req, res) => {  //获取软删除文章
        C.blogArticleController.selectRecoveryArticle(req, res);
    });

    app.delete('/blog/delete/:id/article', (req, res) => {    //硬删除文章
        C.blogArticleController.deleteArticle(req, res);
    });

    app.post('/user/regist', (req, res) => {            //注册 
        C.UserController.userRegist(req.body, res);
    });

    app.post('/user/login', (req, res) => {             //登录 
        C.UserController.userLogin(req.body, res);
    });

    app.post('/user/verify_name', (req, res) => {    //判断用户名重复 
        C.UserController.verifyUsername(req.body.param, res);
    });

    app.get('/chat/upload/img/chat_head/:url', function (req, res) {   //获取图片 
        C.UserController.getUserImg(req.params.url, res);
    });

    app.get('/user/info', (req, res) => {         //用户信息
        C.UserController.userInfo(req, res);
    });

    app.get('/client/get/article', (req, res) => {                            //客户端文章列表
        C.blogClientController.selectBlogClientArticle(req, res);
    });

    app.post('/blog/article/comment', (req, res) => {                     //评论文章
        C.blogClientController.insertSendBlogArticle(req, res);
    });

    app.get('/blog/article/comment/:id', (req, res) => {                  //根据文章id获取评论
        C.blogClientController.selectCommentByArticleId(req, res);
    });

    app.put('/blog/comment/parise', (req, res) => {                       //用户点赞
        C.blogClientController.praiseArticleComment(req, res);
    });

    app.get('/blog/comment/parise', (req, res) => {                       //获取用户点赞
        C.blogClientController.selectUserPraiseFromArticleId(req, res);
    });

    app.get('/blog/detail/article', (req, res) => {                       //获取文章详情
        C.blogArticleController.selectArticleDetails(req, res);
    });

    app.post('/blog/post/webshare', (req, res) => {                     //上传网页分享
        C.blogWebShareController.addWebShare(req, res);
    });

    app.get('/blog/get/webshare', (req, res) => {                       //获取网页分享
        C.blogWebShareController.selectWebShare(req, res);
    });

    app.put('/blog/put/webshare', (req, res) => {                       //修改网页分享
        C.blogWebShareController.updateWebShare(req, res);
    });

    app.delete('/blog/delete/webshare', (req, res) => {                 //删除网页分享
        C.blogWebShareController.deleteWebShare(req, res);
    });

    app.get('/blog/get/client/webshare', (req, res) => {
        C.blogWebShareController.getClientWebShare(req, res);
    });
};