const path = require('path');
const fs = require('fs');

exports.getUserimgService = function (imgUrl, res) {
    let baseUrl = path.join('uploads', imgUrl);

    /**
     * 二进制读取图片
     */
    fs.readFile(baseUrl, 'binary', function (err, data) {
        if (data) {
            //console.log(data);
            res.write(data, 'binary');
            res.end();
        }
    });
};