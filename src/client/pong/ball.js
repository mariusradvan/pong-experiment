class Ball {
    constructor(spec) {
        this._paddles = spec.paddles;
        this._game = spec.game;

        this._bounds = this._computeInitialBounds();
        this._context = spec.context;
        this._x = this._bounds.x;
        this._y = this._bounds.y;
        this._defaultSpeed = {
            x: 3,
            y: 3
        };

        this._speed = this._defaultSpeed;
    }

    _computeInitialBounds() {
        let radius, x, y;

        // set ball radius to 2.5% of the canvas
        radius = this._game._width / 40;

        // compute initial position (center of the canvas)
        x = this._game._width / 2;
        y = this._game._height / 2;

        return {
            radius: radius,
            x: x,
            y: y
        };
    }

    render() {
        this._updatePosition();

        this._context.beginPath();
        this._context.arc(this._x, this._y, this._bounds.radius, 2 * Math.PI, false);
        this._context.fillStyle = '#B09FCA';
        this._context.fill();
    }

    _updatePosition() {
        let gameBounds = this._game.getBounds();
        let margin = this._bounds.radius / 2;

        this._x += this._speed.x;
        this._y += this._speed.y;

        if (
            // hit bottom wall
            this._y + this._bounds.radius > gameBounds.height ||
            // hit top wall
            this._y - this._bounds.radius < 0
        ) {
            this._y -= this._speed.y;
            this._speed.y = -this._speed.y;
        }

        this._paddles.forEach(paddle => {
            let paddleBounds = paddle.getBounds();

            if (
                // left paddle
            paddleBounds.x + paddleBounds.width > this._x - this._bounds.radius && paddle.name == 'first' ||
            // right paddle
            paddleBounds.x < this._x + this._bounds.radius && paddle.name == 'second'
            ) {
                if (paddleBounds.y < this._y + margin && paddleBounds.y + paddleBounds.height > this._y - margin) {
                    // the ball has hit the paddle
                    this._x -= this._speed.x;
                    this._speed.x = -this._speed.x;
                } else {
                    // game over
                    this.restart();
                }
            }
        });
    }

    restart() {
        this._x = this._bounds.x;
        this._y = this._bounds.y;
        this._speed = this._defaultSpeed;
    }
}
