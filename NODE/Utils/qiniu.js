const qiniu = require('qiniu');
const dotenv = require('dotenv');
dotenv.config('./env');

const { QINIU_AK, QINIU_SK, QINIU_BK } = process.env;

const QiniuUpload = (req, res) => {
  
  qiniu.conf.ACCESS_KEY = QINIU_AK;
  qiniu.conf.SECRET_KEY = QINIU_SK;
  const Mac = qiniu.auth.digest.Mac();
  const options = {
    scope: QINIU_BK,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(Mac);

  res.json({ uploadToken });
};

module.exports = QiniuUpload;