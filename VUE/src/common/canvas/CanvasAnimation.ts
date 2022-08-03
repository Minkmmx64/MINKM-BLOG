//定义复数
interface Icomplex {
  x: number,
  z: number
}
//定义坐标 
interface Ipoint {
  x: number,
  y: number
}

export function mandelbrotSet(canvasItem: HTMLCanvasElement) {
  let ctx = undefined as CanvasRenderingContext2D;
  let BaseHeight = 0;
  let BaseWidth = 0;
  let scale = 0;
  let canvasImgData = null as ImageData;
  let iteration = 35;
  let rgbColors = {
    r: 240,
    g: 240,
    b: 240
  };

  function init() {
    //BaseHeight = (window.innerHeight - 60) / 5;
    //BaseWidth = window.innerWidth / 5;
    canvasItem.width = 500;
    canvasItem.height = 300;
    scale = canvasItem.height / 2.5;
    ctx = canvasItem.getContext("2d");
  }
  init();
  //初始化图片
  function MandelbrotSet(Statistics: number) {

    canvasImgData = new ImageData(canvasItem.width, canvasItem.height);
    for (let i = 0; i < canvasImgData.data.length; i += 4) {
      let x = Math.floor(i / 4 % canvasItem.width);
      let y = Math.floor((i / 4 / canvasItem.width));
      let C = getComplexlocation(x, y);
      let Point: Ipoint = {
        x: 0,
        y: 0
      };
      let count = 0;
      /**
       * C = x + yi
       * Zn+1 = Zn ^ 2 + C
       */
      while (count < iteration && complexModel(Point)) {
        //let temp = complexSquare(dx, dy);
        let temp = complexPower({
          x: Point.x,
          z: Point.y
        } as Icomplex, Statistics);
        Point.x = C.x + temp.x;
        Point.y = C.z + temp.z;
        count++;
      }
      canvasImgData.data[i + 0] = Math.round(rgbColors.r * (count / iteration));
      canvasImgData.data[i + 1] = Math.round(rgbColors.g * (count / iteration));
      canvasImgData.data[i + 2] = Math.round(rgbColors.b * (count / iteration));
      canvasImgData.data[i + 3] = 255;
    }
    ctx.putImageData(canvasImgData, 0, 0);
  }

  /*((Statistics:number) => {
    return setInterval(() => {
      MandelbrotSet(Statistics);
      Statistics += 1;
      if (Statistics >= 15) Statistics = 1;
    },2000);
  })(1)*/
  MandelbrotSet(2);

  function findCenterOfCircle(): Ipoint {
    return {
      x: Math.round(canvasItem.width / 1.5),
      y: Math.round(canvasItem.height * 0.5)
    } as Ipoint;
  }

  function getComplexlocation(x: number, y: number): Icomplex {
    let center = findCenterOfCircle();
    return {
      x: (x - center.x) / scale,
      z: (center.y - y) / scale
    } as Icomplex;
  }

  /** 
  function complexSquare(complex:Icomplex) :Icomplex {
    return {
      x: (complex.x * complex.x - complex.z * complex.z),
      z: 2 * complex.x * complex.z
    };
  }
  */

  function complexModel(P: Ipoint): boolean {
    return (P.x * P.x + P.y * P.y < 2 * 2);
  }

  function complexPower(A: Icomplex, Statistics: number): Icomplex {
    let ans: Icomplex = {
      x: 1,
      z: 0
    };
    while (Statistics) {
      if (Statistics & 1) {
        ans = complexMul({
          x: ans.x,
          z: ans.z
        } as Icomplex, A);
      }
      A = complexMul(A, A);
      Statistics >>= 1;
    }
    return {
      x: ans.x,
      z: ans.z
    } as Icomplex;
  }

  function complexMul(A: Icomplex, B: Icomplex): Icomplex {
    return {
      x: A.x * B.x - (A.z * B.z),
      z: A.x * B.z + A.z * B.x
    } as Icomplex;
  }
}
