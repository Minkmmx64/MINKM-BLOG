const config = {
    //后端数据api
    dataUrl: {
        dev: {
            NODE_BACK: 'http://localhost:8080',
            WS_BACK: 'ws://localhost:8082'
        },
        prod: {
            NODE_BACK: 'http://139.224.247.147:8000',
            WS_BACK: 'ws://139.224.247.147:8002'
        },
        test: {
            NODE_BACK: 'http://localhost:8000',
            WS_BACK: 'ws://localhost:8002'
        }
    },
    //是不是测试环境
    ISdevelop: false,
    //强制使用测试环境
    Istest: true,
};

export const NODE_BASE_URL = config.Istest ? config.dataUrl.test.NODE_BACK : (config.ISdevelop ? config.dataUrl.dev.NODE_BACK : config.dataUrl.prod.NODE_BACK);
export const WS_BASE_URL = config.Istest ? config.dataUrl.test.WS_BACK : (config.ISdevelop ? config.dataUrl.dev.WS_BACK : config.dataUrl.prod.WS_BACK);