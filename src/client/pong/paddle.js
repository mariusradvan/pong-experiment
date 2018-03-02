class Paddle {
    constructor(team, canvas) {

        this._name = team.name;
        this._color = team.color;
        this._team = team;

        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        const image = new Image();
        image.src = '/public/pattern.png';
        image.onload = () => {
            this._pattern = this._context.createPattern(image, 'repeat');
        };

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
        this._draw(
            this._x,
            this._y,
            this._bounds.width,
            this._bounds.height,
            this._bounds.width / 2.5
        )
    }

    _draw(x, y, w, h, radius) {
        const gradient = this._context.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, '#00ab84');
        gradient.addColorStop(0.2, this._color);
        gradient.addColorStop(0.8, this._color);
        gradient.addColorStop(1, '#a74145');

        this._context.beginPath();
        this._context.moveTo(x + radius, y);
        this._context.lineTo(x + w - radius, y);
        this._context.quadraticCurveTo(x + w, y, x + w, y + radius);
        this._context.lineTo(x + w, y + h - radius);
        this._context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this._context.lineTo(x + radius, y + h);
        this._context.quadraticCurveTo(x, y + h, x, y + h - radius);
        this._context.lineTo(x, y + radius);
        this._context.quadraticCurveTo(x, y, x + radius, y);

        [gradient, this._pattern].forEach((fillStyle) => {
            this._context.fillStyle = fillStyle;
            this._context.fill();
        });
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
