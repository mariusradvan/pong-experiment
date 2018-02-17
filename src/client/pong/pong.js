let animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


class Pong {
    constructor(hostname) {
        this._hostname = hostname;

        // public constants
        this.CONST_POSITION_LEFT = 'left';
        this.CONST_POSITION_RIGHT = 'right';

        this.events = {
            register: 'register-host',
            move: 'move',
            spec: 'spec'
        };

        // teams
        this._teams = null;

        // canvas
        this._width = 0;
        this._height = 0;

        this._canvas = document.createElement('canvas');
        document.body.appendChild(this._canvas);

        this._context = this._canvas.getContext('2d');

        // set canvas dimensions
        this._updateDimensions();

        // watch for window resize
        window.addEventListener('resize', () => {
            this._updateDimensions();
        });

        // initialize the socket
        this._initSocket();
    }

    _addPaddles() {
        if (this._teams === null) {
            return;
        }
        this._paddles = [];
        this._teams.forEach(team => {
            this._paddles.push(
                new Paddle(
                    team,
                    {
                        width: this._width,
                        height: this._height
                    },
                    this._context
                )
            )
        });
    }

    _addBall() {
        this._ball = new Ball({
            context: this._context,
            paddles: this._paddles,
            game: this
        });
    }

    _updateDimensions() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        this._canvas.width = windowWidth;
        this._canvas.height = windowHeight;
        this._width = windowWidth;
        this._height = windowHeight;
    }

    _render() {
        this._context.fillStyle = this._backgroundColor;
        this._context.fillRect(0, 0, this._width, this._height);
    }

    _animateCanvas() {
        let self = this;
        animate(function () {
            self._step();
        });
    }

    _step() {
        this._render();
        this._paddles.forEach(paddle => {
            paddle.render();
        });
        this._ball.render();

        // one more time
        this._animateCanvas();
    }

    _initSocket() {
        this._socket = io(this._hostname, {
            transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
        });

        // register as a game host
        this._socket.emit(this.events.register);

        // subscribe for team data
        this._socket.on(this.events.spec, (spec) => {
            this._teams = spec.teams;
            this._backgroundColor = spec.backgroundColor;

            this._addPaddles();
            this._addBall();

            // render the game
            this._animateCanvas();
        });

        // subscribe to move event
        this._socket.on(this.events.move, (data) => {
            this._paddles.forEach(paddle => {
                data[paddle.name] !== undefined && paddle.updatePosition(
                    data[paddle.name]
                );
            });
        });
    }

    getBounds() {
        return {
            width: this._width,
            height: this._height
        };
    }
}
