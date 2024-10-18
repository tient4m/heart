
(function () {
    'use strict';
    window.addEventListener('load', function () {
        var mouseCanvas = document.getElementById('mouse-canvas');
        var ctx = mouseCanvas.getContext('2d');

        function resizeCanvas() {
            mouseCanvas.width = window.innerWidth;
            mouseCanvas.height = window.innerHeight;
        }

        resizeCanvas();

        var width = mouseCanvas.width;
        var height = mouseCanvas.height;

        var mouseX = width / 2;
        var mouseY = height / 2;

        var particles = [];
        var particleNum = 100;
        var particleColors = ['rgb(255, 3, 131)', 'rgb(253, 191, 16)', 'rgb(237, 26, 36)', 'rgb(241, 87, 49)', 'rgb(246, 149, 153)'];

        var rad = Math.PI / 180;

        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function Particle(ctx, x, y, r) {
            this.ctx = ctx;
            this.init(x, y, r);
        }

        Particle.prototype.init = function (x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.l = rand(5, 10);
            this.a = 0.5;
            this.c = particleColors[rand(0, particleColors.length - 1)];
            this.v = {
                x: rand(-2, 2) * Math.random(),
                y: rand(-2, 2) * Math.random()
            };
        };

        Particle.prototype.updateParams = function () {
            this.l -= 0.1;
            this.r += 0.1;
        };

        Particle.prototype.updatePosition = function () {
            this.x += this.v.x;
            this.y += this.v.y;
        };

        Particle.prototype.wrapPosition = function () {
            if (this.l < 0.5) {
                var miniHeart = new MiniHeart(this.ctx, this.x, this.y, this.r, this.c);
                miniHearts.push(miniHeart);
                this.x = mouseX;
                this.y = mouseY;
                this.l = rand(10, 20);
                this.r = 1;
            }
        };

        Particle.prototype.draw = function () {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha = this.a;
            ctx.fillStyle = this.c;
            ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        };

        Particle.prototype.render = function () {
            this.updatePosition();
            this.updateParams();
            this.wrapPosition();
            this.draw();
        };

        for (var i = 0; i < particleNum; i++) {
            var particle = new Particle(ctx, mouseX, mouseY, 1);
            particles.push(particle);
        }

        var miniHearts = [];

        function MiniHeart(ctx, x, y, r, c) {
            this.ctx = ctx;
            this.init(x, y, r, c);
        }

        MiniHeart.prototype.init = function (x, y, r, c) {
            this.r = r;
            this.x1 = x;
            this.y1 = y;
            this.a = -90;
            this.c = c;
            this.num = 22.5;
            this.l = rand(10, 20);
            this.alpha = 0.8;
            this.v = {
                x: 0,
                y: 2
            };
            this.updateCoordinates();
        };

        MiniHeart.prototype.updateCoordinates = function () {
            this.x2 = this.x1 + this.r * Math.cos(this.a * rad);
            this.y2 = this.y1 + this.r * Math.sin(this.a * rad);
            this.cx1 = this.x1 + this.r * Math.cos((this.a + this.num) * rad);
            this.cy1 = this.y1 + this.r * Math.sin((this.a + this.num) * rad);
            this.cx2 = this.x1 + this.r * Math.cos((this.a - this.num) * rad);
            this.cy2 = this.y1 + this.r * Math.sin((this.a - this.num) * rad);
            this.chord = 2 * this.r * Math.sin(this.num * rad / 2);
        };

        MiniHeart.prototype.draw = function () {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.c;
            ctx.strokeStyle = this.c;
            ctx.moveTo(this.x2, this.y2);
            ctx.arc(this.cx1, this.cy1, this.chord, (270 + this.a) * rad, (270 + this.a + 225) * rad);
            ctx.lineTo(this.x1, this.y1);
            ctx.closePath();
            ctx.fill();
            ctx.moveTo(this.x2, this.y2);
            ctx.arc(this.cx2, this.cy2, this.chord, (90 + this.a) * rad, (90 + this.a + 135) * rad, true);
            ctx.lineTo(this.x1, this.y1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        };

        MiniHeart.prototype.updateParams = function () {
            this.l -= 0.1;
            this.r += 0.05;
            this.updateCoordinates();
        };

        MiniHeart.prototype.deleteHeart = function (i) {
            if (this.y1 < 0 || this.l < 0) {
                miniHearts.splice(i, 1);
            }
        };

        MiniHeart.prototype.updatePosition = function () {
            this.y1 -= this.v.y;
            this.y2 -= this.v.y;
            this.cy1 -= this.v.y;
            this.cy2 -= this.v.y;
        };

        MiniHeart.prototype.render = function (i) {
            this.updateParams();
            this.updatePosition();
            this.deleteHeart(i);
            this.draw();
        };

        function render() {
            ctx.clearRect(0, 0, mouseCanvas.width, mouseCanvas.height);
            for (var i = 0; i < particles.length; i++) {
                particles[i].render();
            }
            for (var i = 0; i < miniHearts.length; i++) {
                miniHearts[i].render(i);
            }
            requestAnimationFrame(render);
        }

        render();

        function onResize() {
            resizeCanvas();
            width = mouseCanvas.width;
            height = mouseCanvas.height;
        }

        window.addEventListener('resize', function () {
            onResize();
        });

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('touchmove', function (e) {
            var touch = e.targetTouches[0];
            mouseX = touch.pageX;
            mouseY = touch.pageY;
        }, false);
    });
})();
