type SortMethodsType = "shell" | "bubble" | "select" | "quick" | "merge" | "heap" | "bucket" | "insert" | "radix"
export const SortMethodsName = ["select", "shell", "bubble", "heap", "merge", "quick", "bucket", "insert", "radix"] as SortMethodsType[];
//希尔排序 | 冒泡排序 | 选择排序 | 快速排序 | 归并排序 | 堆排序 | 桶排序 | 插入排序 | "基数排序"
class CanvasItem extends Array {
    constructor(...arr) {
        super(...arr);
    }

    public swap(a: number, b: number) {
        let k = this[b];
        this[b] = this[a];
        this[a] = k;
    }
}
export function getCanvas(canvasItem: HTMLCanvasElement) {

    const BaseHeight = window.innerHeight - 60;
    const BaseWidth = window.innerWidth;
    canvasItem.width = BaseWidth;
    canvasItem.height = BaseHeight;
    const BaseItemWidth = 30;
    const rectCollection = new CanvasItem();
    const rectCollection_2 = new CanvasItem();
    const dataPool = [];
    const ctx = canvasItem.getContext("2d") as CanvasRenderingContext2D;
    const dataLength = Math.ceil(canvasItem.width) / (BaseItemWidth + 1);
    let currentCount = 0;
    let access = 0;
    let Animation = null;

    function init() {
        for (let i = 0; i < dataLength; i++) {
            rectCollection[i] = Math.floor((Math.random() * (canvasItem.height) / 1.5) + 2);
            ctx.fillRect(i * (BaseItemWidth + 1), canvasItem.height - rectCollection[i], BaseItemWidth, rectCollection[i]);
            ctx.fillStyle = "#aaa";
        }
        for (let i = 0; i < dataLength; i++) {
            rectCollection_2[i] = rectCollection[i];
        }
    }

    window.addEventListener('resize', () => {
        canvasItem.width = window.innerWidth;
        canvasItem.height = window.innerHeight - 60;
        stop();
    });

    function stop() {
        Animation = null;
        currentCount = 0;
        access = 0;
        setTimeout(() => {
            init();
            star();
        }, 1000);
    }

    function star() {
        let current = 0;
        for (let i = 0; i < dataLength; i++) {
            for (let j = 0; j < dataLength - 1 - i; j++) {
                dataPool[current] = {
                    a: j,
                    b: j,
                    c: "set",
                };
                if (rectCollection[j] > rectCollection[j + 1]) {
                    rectCollection.swap(j, j + 1);
                    dataPool[current] = {
                        a: j,
                        b: j + 1,
                        c: "swap",
                    };
                }
                current++;
            }
        }
        Anim();
    }
    let nowTime = new Date().getTime();
    let count = 0;
    function Anim() {
        count++;
        if (currentCount < dataPool.length) {
            ctx.clearRect(0, 0, canvasItem.width, canvasItem.height);
            for (let i = 0; i < dataLength; i++) {
                if (dataPool[currentCount].c === "set") {
                    ctx.fillStyle = "rgba(0,0,0,0.1)";
                } else if (dataPool[currentCount].c === "swap") {
                    if (i === dataPool[currentCount].a) {
                        ctx.fillStyle = "rgba(245,88,123,1)";
                        rectCollection_2.swap(dataPool[currentCount].a, dataPool[currentCount].b);
                    } else ctx.fillStyle = "rgba(0,0,0,0.1)";
                }
                ctx.fillRect(i * (BaseItemWidth + 1), canvasItem.height - rectCollection_2[i], BaseItemWidth, rectCollection_2[i]);
            }
            currentCount += 1;
            let lastTime = new Date().getTime();
            let fps = lastTime - nowTime;
            if (fps >= 10) {
                ctx.font = "20px Arial";
                ctx.fillStyle = "#000";
                ctx.fillText(`FPS:${((count / fps) * 1000).toFixed(2)}`, 10, 60);
                count = 0;
                nowTime = new Date().getTime();
            }
            Animation = requestAnimationFrame(Anim);
        } else {
            ctx.fillStyle = "green";
            if (access < dataLength) {
                ctx.clearRect(0, 0, canvasItem.width, canvasItem.height);
                for (let j = 0; j <= access; j++) {
                    ctx.fillRect(j * (BaseItemWidth + 1), canvasItem.height - rectCollection_2[j], BaseItemWidth, rectCollection_2[j]);
                }
                access++;
                Animation = requestAnimationFrame(Anim);
            } else {
                cancelAnimationFrame(Animation);
                stop();
            }
        }
    }
    init();
    star();
}