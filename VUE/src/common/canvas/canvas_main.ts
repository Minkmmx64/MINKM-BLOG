export default function main() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas2');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 300;
    let BallArray = [];
    let mov = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    let colorArray = [
        '#fff7f7',
        '#f4f0e6',
        '#FDFDEB',
        '#d4edf4',
        '#a3daff',
        '#fffff5',
        '#cfe0f9',
        '#a3daff',
        '#41D3BD'
    ];

    window.addEventListener('resize', () => {
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (E) => {
        mov.x = E.clientX;
        mov.y = E.clientY;
    });

    for (let i = 0; i < 30; i++) {
        let w = Math.random() * canvas.width;
        let h = Math.random() * canvas.height;
        let r = Math.random() * 10 + 1;
        let dx = Math.random() * 2;
        if (dx < 0.3) dx += 0.2;
        let dy = Math.random() * 2;
        if (dy < 0.3) dy += 0.2;
        let l = Math.random() * 80;
        let lineW = Math.random() * 0.5;
        let color = colorArray[Math.floor(Math.random() * colorArray.length)];
        BallArray.push(
            new Ball(w, h, dx, dy, r, color, l, lineW)
        );
    }

    resizeCanvas();

    //主函数
    function resizeCanvas() {
        //清除前一帧动画
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        BallArray.forEach((ele: { Update: Function }) => {
            ele.Update();
        });

        for (let i = 0; i < BallArray.length; i++) {

            for (let j = 0; j < BallArray.length; j++) {
                let x = BallArray[i].x;
                let y = BallArray[i].y;
                let xx = BallArray[j].x;
                let yy = BallArray[j].y;

                if (L(x, xx, y, yy) - BallArray[i].line <= 0) {
                    // 设置线条的颜色
                    ctx.strokeStyle = '#FFFFFF';
                    // 设置线条的宽度

                    ctx.lineWidth = BallArray[i].lw;
                    // 绘制直线
                    ctx.beginPath();
                    // 起点
                    ctx.moveTo(x, y);
                    // 终点
                    ctx.lineTo(xx, yy);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }

        //每一帧执行函数
        requestAnimationFrame(resizeCanvas);
    }

    function L(x: number, xx: number, y: number, yy: number) {
        return Math.abs(Math.sqrt((x - xx) * (x - xx) + (y - yy) * (y - yy)));
    }

    function Ball(x: number, y: number, dx: number, dy: number, r: number, color: string, line: number, lw: number) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.color = color;
        this.line = line;  //连线半径
        this.lw = lw; //连线宽度
        this.Draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };

        this.Update = function () {
            if ((this.x + this.r) > canvas.width || (this.x - this.r) < 0) {
                this.dx = -this.dx;
            }
            if ((this.y + this.r) > canvas.height || (this.y - this.r) < 0) {
                this.dy = -this.dy;
            }

            if ((Math.abs(this.y + 360 - mov.y) < 100 && Math.abs(this.x - mov.x) < 100) && this.r < 20) {
                this.r += 1;
            }
            else {
                if (this.r > r && this.r - 1 > 0) this.r--;
            }

            this.x += this.dx;
            this.y += this.dy;

            this.Draw();
        };
    }
}