class Paddle {
    constructor(team, canvas) {

        this._name = team.name;
        this._color = team.color;
        this._team = team;

        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this._bounds = this._computeInitialBounds({
            width: this._canvas.width,
            height: this._canvas.height
        });

        this._x = this._bounds.x;
        this._y = this._bounds.y;
    }

    get name() {
        return this._name;
    }

    get position() {
        return this._team.position;
    }

    _computeInitialBounds(container) {
        let margin = 10;
        let paddleWidth, paddleHeight, x, y;

        // set paddle width to 1.25% of the canvas
        paddleWidth = container.width / 80;
        // set paddle height to 35% of the canvas
        paddleHeight = container.height * 3.5 / 10;

        if (this._team.position === 'left') {
            x = margin;
        } else if (this._team.position === 'right') {
            x = container.width - margin - paddleWidth;
        }
        y = (container.height - paddleHeight) / 2;

        return {
            width: paddleWidth,
            height: paddleHeight,
            parentWidth: container.width,
            parentHeight: container.height,
            x: x,
            y: y
        };
    }

    draw() {
        this._context.fillStyle = this._color;
        this._context.fillRect(
            this._x,
            this._y,
            this._bounds.width,
            this._bounds.height
        );
    }

    updatePosition(percent) {
        let distance = (this._bounds.parentHeight - this._bounds.height) / 2;
        let delta = distance * percent;

        this._y = this._bounds.y - delta;
    }

    getBounds() {
        return {
            x: this._x,
            y: this._y,
            width: this._bounds.width,
            height: this._bounds.height
        };
    }
}
