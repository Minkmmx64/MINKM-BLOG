import { ElMessage } from "element-plus";

export default {
  randomNum(minNum: number, maxNum: number): number {
    switch (arguments.length) {
      case 1:
        return Math.floor(Math.random() * minNum + 1);
      case 2:
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
      default:
        return 0;
    }
  },
  getTimeStringSec,
  getSettings(key: string, defaultValue: string): string {
    const v = localStorage.getItem(key);
    if (v)
      return v;
    return defaultValue;
  },
  getSettingsBoolean(key: string, defaultValue: boolean): boolean {
    const v = localStorage.getItem(key);
    if (v)
      return v === 'true';
    return defaultValue;
  },
  getSettingsNumber(key: string, defaultValue: number): number {
    const v = localStorage.getItem(key);
    if (v)
      return parseFloat(v);
    return defaultValue;
  },
  setSettingsNumber(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  },
  setSettings(key: string, value: string): void {
    localStorage.setItem(key, value);
  },
  setSettingsBoolean(key: string, value: boolean): void {
    localStorage.setItem(key, value ? 'true' : 'false');
  },
};

/**
 * 将秒转换为 分:秒
 * @param s 秒数
*/
export function getTimeStringSec(s: string): string {
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  const h = Math.floor(parseInt(s) / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = Math.floor(parseInt(s) % 60).toString();
  //将变量转换为字符串
  let hS = h + '';
  let sS = s + '';
  //如果只有一位数，前面增加一个0
  hS = (hS.length === 1) ? '0' + hS : hS;
  sS = (sS.length === 1) ? '0' + sS : sS;
  return hS + ':' + sS;
}

//http://stackoverflow.com/a/9493060
//HSL颜色模式转换成RGB
export function hslToRgb(h, s, l) {
  var r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
//深拷贝
export function deepClone(O) {
  let o = null;
  if (Object.prototype.toString.call(O) === "[object Object]") {
    o = {};
    for (const e in O) o[e] = deepClone(O[e]);
  } else if (Object.prototype.toString.call(O) === "[object Array]") {
    o = [];
    O.map(k => o.push(deepClone(k)));
  } else {
    o = O;
  }
  return o;
}

/**
 * 压缩图片
 * @param src 源图URL
 * @param quality 压缩质量
 * @param width 压缩宽度
 * @param height 压缩搞度
 * @returns 返回压缩后图片的 data URL
 */
export function compressImage(src: string, quality: number, width: number, height: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // 创建Canvas对象(画布)
    const canvas = document.createElement("canvas");
    // 获取对应的CanvasRenderingContext2D对象(画笔)
    const context = canvas.getContext("2d");
    if (!context) {
      reject('getContext FAILED');
      return;
    }

    // 创建新的图片对象
    const img = new Image();
    // 指定图片的DataURL(图片的base64编码数据)
    img.src = src;
    // 监听浏览器加载图片完成，然后进行进行绘制
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      context.drawImage(img, 0, 0, width, height);
      // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
      src = canvas.toDataURL('image/jpeg', quality);
      resolve(src);
    };
    img.onerror = (e) => reject(e);
  });
}
/**
 * 
 * @param OriginArray 原始数组
 * @param Pname 需要转换的字段
 * @param PRoot 转换字段的根节点
 */
export function convertPidToChildren(OriginArray: [{ pid: string }], Pname: string, PRoot: "root" | string | number) {
  let convertedArray = []; //存放pid数组
  let NOriginArray = deepClone(OriginArray) as []; //存放子数组

  function checkPnameIsExist(...param) {
    for (let i = 0; i < arguments.length; i++) {
      if (!arguments[i]) return false;
    }
    return true;
  }

  if (checkPnameIsExist(...NOriginArray.map(item => item[Pname] === undefined ? false : true))) {
    for (let i = 0; i < NOriginArray.length; i++) {
      if (NOriginArray[i][Pname] === PRoot) {
        convertedArray.push(NOriginArray[i]);
        NOriginArray.splice(i, 1);
        i--;
      }
    }

  } else ElMessage.error("数据中" + Pname + "字段不存在");

  for (let i = 0; i < convertedArray.length; i++) {
    convertedArray[i].children = [];
    for (let j = 0; j < NOriginArray.length; j++) {
      if (NOriginArray[j][Pname] === convertedArray[i]._id) {
        convertedArray[i].children.push(NOriginArray[j]);
        NOriginArray.splice(j, 1);
        j--;
      }
    }
  }

  return convertedArray;
}

export const randomColorList = [
  "rgba(255,114,96,1)", "rgba(247,23,53,1)", "rgba(232,160,184,1)", "rgba(255,75,104,1)", "rgba(163,218,255,1)", "rgba(167,232,189,1)",
  "rgba(8,255,200,1)", "rgba(65,182,230,1)", "rgba(87,209,201,1)"
];