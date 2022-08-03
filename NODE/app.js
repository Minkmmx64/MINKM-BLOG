(async () => {
    const express = require('express');
    const app = express();
    const childProcess = require("child_process");
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const CustomMiddle = require('./middleware/middleware');
    const { ApiNotFound } = require('./middleware/response');
    const Router = require('./router.js/index');
    const mongoodb = require('mongoose');
    const Client = require('./config/redisServer');
    const { MONGOD_URL,/* MONGO_CONFIG,*/ BASE_PORT } = require('./config/baseUrl');
    const path = require("path");
    const dir = path.join(__dirname, "SOCKET", "socket.js");
    app.set('trust proxy', true);
    app.use(cors());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use(CustomMiddle.AuthRouter);
    app.use(CustomMiddle.AdmissionAction);
    app.use(CustomMiddle.ApiCollection);
    app.use('/', Router);
    app.use(ApiNotFound);
    app.listen(BASE_PORT, async () => {
        console.log(`------------------------------- start node server -------------------------------`);
        console.log(`EXPRESS connect success`);
        try {
            await Client.ClientConnect();
            try {
                await mongoodb.connect(MONGOD_URL/**, MONGO_CONFIG */);
                console.log('MONGODB connect success');
                console.log(`------------------------------- child process socket server -------------------------------`);
                const child = childProcess.fork(dir);
                child.on('error', (err) => {
                    console.log('子进程 socket server 启动失败');
                    console.log("[ERRORMSG]:");
                    console.log(err);
                });
                child.on("message", (Event) => {
                    if (Event.Msg !== "SUCCESS") {
                        console.warn("子进程MongoDB连接错误，进程关闭");
                    }
                });
            } catch (error) {
                console.log('MONGODB connect error');
                console.log(error);
            }
        } catch (error) {
            console.log("REDIS SERVER FAILED");
            console.log(error);
        }
    });
})();