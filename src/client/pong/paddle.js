class Paddle {
    constructor(team, container, context) {
        this.CONST_POSITION_LEFT = 'left';
        this.CONST_POSITION_RIGHT = 'right';

        this._name = team.name;
        this._color = team.color;
        this._team = team;
        this._bounds = this._computeInitialBounds(container);

        this._x = this._bounds.x;
        this._y = this._bounds.y;
        this._context = context;
    }

    get name() {
        return this._name;
    }

    _computeInitialBounds(container) {
        let margin = 10;
        let paddleWidth, paddleHeight, x, y;

        // set paddle width to 1.25% of the canvas
        paddleWidth = container.width / 80;
        // set paddle height to 30% of the canvas
        paddleHeight = container.height * 6 / 10;

        if (this._team.position === this.CONST_POSITION_LEFT) {
            x = margin;
        } else if (this._team.position === this.CONST_POSITION_RIGHT) {
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

    render() {
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

        this._y = this._bounds.y + delta;
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
