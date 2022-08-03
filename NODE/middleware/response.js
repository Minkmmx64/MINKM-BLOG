/**
 * 统一响应处理
 * state:401 请求要求身份验证。对于登录后请求的网页，服务器可能返回此响应。
 * state:403 服务器拒绝请求。可能是您的服务器或主机拒绝了访问。
 * state:404 服务器找不到请求的网页。例如，对于服务器上不存在的网页经常会返回此代码。
 * 
 */
class Response {

    static state; //状态码
    static message; //相应消息
    static data; //响应数据
    static meta;  //标签
    static res;  //相应结果
    static msg = '';
    constructor(state, message, data, meta, res) {
        this.state = state;
        this.message = message;
        this.data = data;
        this.meta = meta;
        this.res = res;
    }

    getStateCode(state) {
        switch (state) {
            case 401: {
                this.msg = '[身份验证失败]' + this.message;
                break;
            }
            case 403: {
                this.msg = '[服务器拒绝请求。可能是您的服务器或主机拒绝了访问。]:' + this.message;
                break;
            }
            case 404: {
                this.msg = '[404 Not Found]:' + this.message;
                break;
            }
            case 201: {
                this.msg = '[部分异常，可能有些参数错误]:' + this.message;
                break;
            }
            case 200: {
                this.msg = '[请求成功]:' + this.message;
                break;
            }
            case 500: {
                this.msg = '[服务器遇到错误，无法完成请求]:' + this.message;
                break;
            }
            case 400: {
                this.msg = '[数据检验不通过]:' + this.message;
                break;
            }
        }
    }

    sendResponse() {
        this.getStateCode(this.state);
        this.res.send(this.ResponseData());
    }

    ResponseData() {
        return {
            state: this.state,
            msg: this.msg,
            data: this.data,
            meta: this.meta
        };
    }
}

const ApiResponse = (Response) => {
    Response.sendResponse();
};

const ApiNotFound = (req, res) => {
    ApiResponse(new Response(404, '找不到服务器', null, null, res));
};

module.exports = {
    ApiResponse,
    ApiNotFound,
    Response
};