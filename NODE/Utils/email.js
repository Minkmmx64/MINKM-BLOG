const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config('./env');

const { EMAIL_WANGYI_PASS, EMAIL_QQ_PASS, EMAIL_ROOT } = process.env;

const myemail = EMAIL_ROOT;
const pass = {
  wangyi: EMAIL_WANGYI_PASS,
  qq: EMAIL_QQ_PASS
};

const transport = nodemailer.createTransport({
  service:"qq",  //  邮箱
  secure:true,    //  安全的发送模式
  auth:{
    user:myemail, //  发件人邮箱
    pass:pass.qq//  授权码
  }
});

function sendEmail(sendemail, content) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: myemail,
      to: sendemail,
      subject: "MinkM的邮件",
      html: content
    };
    transport.sendMail(mailOptions, (error, success) => {
      if (error) {
        reject(error);
      } else resolve(success);
    });
  });
}

module.exports = {
  sendEmail
};