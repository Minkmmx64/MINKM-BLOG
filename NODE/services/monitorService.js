const CommonApiMonitor = require("../dao/CommonApiMonitor");
const { logger } = require("../Utils/log");
const { Response, ApiResponse } = require('../middleware/response');
const path = require("path");
const { UserRegistMod } = require("../config/mongoDbServer");
const fs = require("fs");
const { convertApiName } = require("../common");
const IpLimit = require("../dao/IpLimit");
const ApiMethodAndTime = require("../dao/ApiMethodAndTime");
const moment = require("moment");
exports.monitorService = {
  ApiCount: async (ApiName, Time) => {
    let queue = new CommonApiMonitor();
    let data = {
      ApiName,
      Time
    };
    try {
      let queueLen = await queue.LLEN();
      if (queueLen < 2000) {
        try {
          queue.LPUSH(JSON.stringify(data));
          logger.debug(`[redis ${queue.key}] 插入 ${data}数据成功 [SUCCESS]`);
        } catch (error) {
          logger.error(`[redis ${queue.key}] 插入 ${data}数据失败 [ERROR::${error}]`);
        }
      } else {
        try {
          let pop = await queue.LRPOP(1);
          try {
            queue.LPUSH(JSON.stringify(data));
            logger.debug(`[redis ${queue.key}] 插入数据成功 [SUCCESS]`);
          } catch (error) {
            logger.error(`[redis ${queue.key}] 插入 ${data}数据失败 [ERROR::${error}]`);
          }
          logger.debug(`[redis ${queue.key}] 删除 ${pop}数据成功 [SUCCESS::${pop}]`);
        } catch (error) {
          logger.error(`[redis ${queue.key}] 删除数据失败 [ERROR::${error}]`);
        }
      }
    } catch (error) {
      logger.error(`[redis读取错误] [ERROR::${error}]`);
    }
  },
  MonitorList: async (req, res) => {
    let queue = new CommonApiMonitor();
    try {
      //获取队列100条请求
      let queueList = await queue.LRANGE();
      let baseUrl = path.resolve(__dirname, '../SOCKET');
      try {
        //获取最大在线人数
        let MaxOnlineCount = fs.readFileSync(baseUrl + '/MaxOnlineUserCount.txt');
        //获取总人数
        let MaxUser = await UserRegistMod.estimatedDocumentCount();
        //获取当前在线人数
        let OnLineCount = await queue.Smembers();
        let ApiSet = new Set();
        let ApiTimesCount = {};
        for (let i = 0; i < queueList.length; i++) {
          let { ApiName, Time } = JSON.parse(queueList[i]);
          convertApiName[ApiName] = convertApiName[ApiName] === undefined ? "其他" : convertApiName[ApiName];
          if (!ApiSet.has(convertApiName[ApiName])) {
            ApiSet.add(convertApiName[ApiName]);
            ApiTimesCount[convertApiName[ApiName]] = Time;
          } else {
            ApiTimesCount[convertApiName[ApiName]] = Math.max(ApiTimesCount[convertApiName[ApiName]], Time);
          }
        }
        //获取每日请求Api
        //2022-05-04:10:GET
        const MethodCollection = ["GET", "POST", "PUT", "DELETE"];
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const TableName = currentTime.split(" ")[0];
        const ApiTime = currentTime.split(" ")[1];
        const CurrentTime = ApiTime.split(":")[0];
        const Time = parseInt(CurrentTime);
        //插入数据
        const Data = new Map();
        const ApiTable = new ApiMethodAndTime(TableName);
        try {
          for (let i = 0; i < MethodCollection.length; i++) {
            let method = MethodCollection[i];
            Data[method] = new Array();
            for (let j = 0; j <= Time; j++) {
              let l = await ApiTable.LLEN(j, method);
              Data[method][j] = parseInt(l);
            }
          }
          ApiResponse(new Response(200, "读取数据成功", { ApiCount: ApiTimesCount, Max: MaxOnlineCount.toString(), User: MaxUser, onLine: OnLineCount.length, Data: Data }, null, res));
        } catch (error) {
          logger.error(`[读取Redis->${TableName}错误] [ERROR::${error}]`);
        }
      } catch (error) {
        logger.error(`[文件读取错误] [ERROR::${error}]`);
      }
    } catch (error) {
      logger.error(`[redis读取错误] [ERROR::${error}]`);
      ApiResponse(new Response(500, error, null, null, res));
    }
  },
  IpLimit: async (k, res) => {
    let ip = new IpLimit();
    if (await ip.gk(k) === null) {
      ip.sk(k);
      ip.ek(k, 1);
      return Promise.resolve(true);
    } else {
      ApiResponse(new Response(500, "频繁请求", null, null, res));
      return Promise.resolve(false);
    }
  },
  ApiMethodsAndTime: async (Methods, Time, ConvertApi) => {
    let convertTime = Time.split(" ");
    let Day = convertTime[0];
    let ApiTable = new ApiMethodAndTime(Day);
    if (convertTime[1] !== undefined || convertTime[1] !== null) {
      let currentTime = convertTime[1].split(":");
      currentTime = parseInt(currentTime[0]);
      ApiTable.LPUSH(currentTime, Methods, ConvertApi);
    }
  },
};