import QniuApi from "@/api/Modules/Qiniu";
import { ElMessage } from "element-plus";
import * as qiniu from "qiniu-js";
const Snowflake = function () {
  let T = new Date().getTime();
  let char = "HelloWorld";
  let strForTime = T.toString().split("");
  let strForChar = char.split("");
  let result = "";
  while (strForTime.length || strForChar.length) {
    if (strForTime.length) {
      let random = Math.floor(Math.random() * strForTime.length);
      result += strForTime[random];
      strForTime.splice(random, 1);
    }
    if (strForChar.length) {
      let random = Math.floor(Math.random() * strForChar.length);
      result += strForChar[random];
      strForChar.splice(random, 1);
    }
  }
  return result;
};

export const qiNiuCdn = "http://cdn.minkm.top";

type FilePrefix = "base/" | "chat/" | "article/";
export async function useQiniuUpload(file: File, key: string, callback: (res) => void, prefix: FilePrefix) {
  const type = file.name.split(".")[1];
  if(type !== "png" && type !== "jpeg" && type !== "jpg" && type !== "svg" && type !== "webp" && type !== "ico"){
    ElMessage.error("图片格式错误");
    return;
  }
  const { data } = await QniuApi.qiniuAuth();
  const { uploadToken } = data;
  const putExtra = {};
  const config = {
    useCdnDomain: true,
    region: null,
  };
  const observable = qiniu.upload(
    file,
    prefix + new Date().getTime() + Snowflake() + key,
    uploadToken,
    putExtra,
    config
  );
  const observer = {
    next(res) {
      console.log(res);
    },
    error(err) {
      console.log(err);
    },
    complete(res) {
      (typeof callback === "function" && callback !== null) ? callback(res) : {};
    },
  };
  const subscription = observable.subscribe(observer); // 上传开始
}