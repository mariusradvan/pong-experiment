class Ball {
    constructor(pong) {
        this._color = '#b09fca';

        this._pong = pong;

        this._canvas = this._pong.canvas;
        this._context = this._canvas.getContext('2d');
        this._bounds = this._computeInitialBounds();
        this._x = this._bounds.x;
        this._y = this._bounds.y;
        this._speed = {};

        this._randomizeInitialSpeed();

        this._image = new Image();
        this._image.src = '/public/pong-sun.png';
    }

    _randomizeInitialSpeed() {
        this._speed = {
            x: this.constructor.randomInRange(7, 12) * Math.pow(
                -1,
                this.constructor.randomInRange(0, 1)
            ),
            y: this.constructor.randomInRange(5, 10) * Math.pow(
                -1,
                this.constructor.randomInRange(0, 1)
            )
        };
    }

    static randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _computeInitialBounds() {
        let radius, x, y;

        // set ball size to 3% of the canvas
        radius = this._canvas.width * 3 / 100 / 2;

        // compute initial position (center of the canvas)
        x = this._canvas.width / 2;
        y = this._canvas.height / 2;

        return {
            radius: radius,
            x: x,
            y: y
        };
    }

    _updatePosition() {
        // let margin = this._bounds.radius / 2;
        let margin = 0;

        this._x += this._speed.x;
        this._y += this._speed.y;

        if (
            // hit bottom wall
        this._y + this._bounds.radius > this._canvas.height ||
        // hit top wall
        this._y - this._bounds.radius < 0
        ) {
            this._y -= this._speed.y;
            this._speed.y = -this._speed.y;
        }

        this._pong.paddles.forEach(paddle => {
            let paddleBounds = paddle.getBounds();

            if (
                // left paddle
            paddleBounds.x + paddleBounds.width > this._x - this._bounds.radius && paddle.position === 'left' ||
            // right paddle
            paddleBounds.x < this._x + this._bounds.radius && paddle.position === 'right'
            ) {
                if (paddleBounds.y < this._y + margin && paddleBounds.y + paddleBounds.height > this._y - margin) {
                    // the ball has hit the paddle
                    this._x -= this._speed.x;
                    this._speed.x = -this._speed.x;
                } else {
                    // game over
                    this._pong.registerWin(paddle.position);
                    this._pause = true;
                    setTimeout(() => {
                        this.restart();
                        this._pause = false;
                    }, 500);
                }
            }
        });
    }

    draw() {
        if (!this._pause) {
            this._updatePosition();
        }

        // this._context.beginPath();
        // this._context.arc(this._x, this._y, this._bounds.radius, 0, 2 * Math.PI, false);
        // this._context.fillStyle = this._color;
        // this._context.fill();

        this._context.drawImage(
            this._image,
            this._x - this._bounds.radius,
            this._y - this._bounds.radius,
            this._bounds.radius * 2,
            this._bounds.radius * 2
        )
    }

    restart() {
        this._x = this._bounds.x;
        this._y = this._bounds.y;

        this._randomizeInitialSpeed();
    }
}
