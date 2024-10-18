
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var backgroundCanvas = document.getElementById('background-canvas');
        var ctx = backgroundCanvas.getContext('2d');

        function resizeCanvas() {
            backgroundCanvas.width = window.innerWidth;
            backgroundCanvas.height = window.innerHeight;
        }

        resizeCanvas();
        class Tool {
            static randomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            static randomColorHSL(hue, saturation, lightness) {
                return (
                    "hsl(" +
                    hue +
                    ", " +
                    saturation +
                    "%, " +
                    lightness +
                    "%)"
                );
            }
        }

        class Angle {
            constructor(a) {
                this.a = a;
                this.rad = (this.a * Math.PI) / 180;
            }

            incDec(num) {
                this.a += num;
                this.rad = (this.a * Math.PI) / 180;
            }
        }

        let canvasManager;

        class CanvasManager {
            constructor() {
                this.canvas = backgroundCanvas;
                this.ctx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.width < 768 ? this.heartSize = 180 : this.heartSize = 250;
                this.hearts = [];
                this.offHeartNum = 1;
                this.offHearts = [];
                this.data = null;
            }

            onInit() {
                let index = 0;
                for (let i = 0; i < this.height; i += 12) {
                    for (let j = 0; j < this.width; j += 12) {
                        let oI = (j + i * this.width) * 4 + 3;
                        if (this.data[oI] > 0) {
                            index++;
                            const h = new Heart(this.ctx, j + Tool.randomNumber(-3, 3), i + Tool.randomNumber(-3, 3), Tool.randomNumber(6, 12), index);
                            this.hearts.push(h);
                        }
                    }
                }
            }

            offInit() {
                this.ctx.clearRect(0, 0, this.width, this.height);
                for (let i = 0; i < this.offHeartNum; i++) {
                    const s = new Heart(this.ctx, this.width / 2, this.height / 2.3, this.heartSize);
                    this.offHearts.push(s);
                }
                for (let i = 0; i < this.offHearts.length; i++) {
                    this.offHearts[i].offRender(i);
                }
                this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;
                this.onInit();
            }

            render() {
                this.ctx.clearRect(0, 0, this.width, this.height);
                for (let i = 0; i < this.hearts.length; i++) {
                    this.hearts[i].render(i);
                }
            }

            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.width < 768 ? this.heartSize = 180 : this.heartSize = 250;
                this.offHearts = [];
                this.hearts = [];
            }
        }

        class Heart {
            constructor(ctx, x, y, r, i) {
                this.ctx = ctx;
                this.init(x, y, r, i);
            }

            init(x, y, r, i) {
                this.x = x;
                this.xi = x;
                this.y = y;
                this.yi = y;
                this.r = r;
                this.i = i * 0.5 + 200;
                this.l = this.i;
                this.c = Tool.randomColorHSL(Tool.randomNumber(-5, 5), 80, 60);
                this.a = new Angle(Tool.randomNumber(0, 360));
                this.v = {
                    x: Math.random(),
                    y: -Math.random()
                };
                this.ga = Math.random();
            }

            draw() {
                const ctx = this.ctx;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = this.ga;
                ctx.beginPath();
                ctx.fillStyle = this.c;
                ctx.moveTo(this.x, this.y + this.r);
                ctx.bezierCurveTo(
                    this.x - this.r - this.r / 5,
                    this.y + this.r / 1.5,
                    this.x - this.r,
                    this.y - this.r,
                    this.x,
                    this.y - this.r / 5
                );
                ctx.bezierCurveTo(
                    this.x + this.r,
                    this.y - this.r,
                    this.x + this.r + this.r / 5,
                    this.y + this.r / 1.5,
                    this.x,
                    this.y + this.r
                );
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            updateParams() {
                this.a.incDec(1);
                Math.sin(this.a.rad) < 0 ? this.r = -Math.sin(this.a.rad) * 20 : this.r = Math.sin(this.a.rad) * 20;
            }

            updatePosition() {
                this.l -= 1;
                if (this.l < 0) {
                    this.v.y -= 0.01;
                    this.v.x += 0.02;
                    this.y += this.v.y;
                    this.x += this.v.x;
                }
            }

            wrapPosition() {
                if (this.x > this.ctx.canvas.width * 1.5) {
                    this.init(this.xi, this.yi, Tool.randomNumber(6, 12), this.i);
                }
            }

            render() {
                this.wrapPosition();
                this.updateParams();
                this.updatePosition();
                this.draw();
            }

            offRender(i) {
                this.draw();
            }
        }

        function init() {
            canvasManager = new CanvasManager();
            canvasManager.offInit();

            function render() {
                requestAnimationFrame(render);
                canvasManager.render();
            }

            render();

            window.addEventListener("resize", function () {
                resizeCanvas();
                canvasManager.resize();
                canvasManager.offInit();
            }, false);
        }

        init();
        const textMessage = document.getElementById('text-message');
        const text = textMessage.textContent;
        textMessage.innerHTML = '';

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.position = 'relative';
            textMessage.appendChild(span);
        }

        const spans = textMessage.querySelectorAll('span');

        spans.forEach((span, index) => {
            span.style.animation = `flyAway 5s ease-in-out ${index * 0.1}s infinite`;
            span.style.display = 'inline-block';
        });

        function updateTextColors() {
            const textColor = Tool.randomColorHSL(Tool.randomNumber(-5, 5), 80, 60);
            spans.forEach(span => {
                span.style.color = textColor;
            });
        }

        setInterval(updateTextColors, 500);
    });
})();
