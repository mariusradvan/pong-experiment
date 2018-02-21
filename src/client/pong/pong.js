let animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


class Pong {
    constructor(hostname, container) {
        this._hostname = hostname;
        this._container = container || document.body;

        this.events = {
            register: 'register-host',
            move: 'move',
            spec: 'spec',
            info: 'info'
        };

        // teams
        this._teams = null;
        this._score = {};


        this._registerDomElements();

        // create canvas
        this._createCanvas();

        // initialize the socket
        this._initSocket();
    }

    _registerDomElements() {
        this._pongElem = this._container.querySelector('.pong-container');
        if (!this._pongElem) {
            throw Error('Invalid container template');
        }

        this._scoreElem = this._container.querySelector('.pong-header .pong-score');
        if (!this._scoreElem) {
            throw Error('Invalid container template');
        }

        this._resetElem = this._container.querySelector('.pong-header .pong-reset');
        if (!this._resetElem) {
            throw Error('Invalid container template');
        }
        this._resetElem.addEventListener('click', () => {
            this._resetScore();
        })
    }

    //<editor-fold desc="Canvas">
    get canvas() {
        return this._canvas;
    }

    _createCanvas() {
        this._canvas = document.createElement('canvas');
        this._pongElem.appendChild(this._canvas);
        this._context = this._canvas.getContext('2d');

        // set canvas size
        this._setCanvasSize();

        // watch for window resize
        // and update the canvas size
        window.addEventListener('resize', () => {
            this._setCanvasSize();
        });
    }

    _setCanvasSize() {
        let width = this._pongElem.clientWidth;
        let height = this._pongElem.clientHeight;

        this._canvas.width = width;
        this._canvas.height = height;
    }

    draw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);


        // then the ball and paddles
        this._paddles.forEach(paddle => {
            paddle.draw();
        });
        this._ball.draw();
    }

    _animateCanvas() {
        let self = this;
        animate(function () {
            self._step();
        });
    }

    _step() {
        // let's add some color
        this.draw();

        // and repeat
        this._animateCanvas();
    }

    //</editor-fold>

    //<editor-fold desc="WebSocket">
    _initSocket() {
        this._socket = io(this._hostname, {
            transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
        });

        // register as a game host
        this._socket.emit(this.events.register);

        // subscribe for team data
        this._socket.on(this.events.spec, (spec) => {
            this._initGame(spec);

            this._socket.off(this.events.spec);
        });

        // subscribe to move event
        this._socket.on(this.events.move, (data) => {
            this._updatePaddles(data);
        });

        // stats event
        // do not handle this at this time
        /*
        this._socket.on(this.events.info, (stats) => {
            // do nothing
        });
        */
    }

    //</editor-fold>

    //<editor-fold desc="Init Game">
    _initGame(spec) {
        this._teams = spec.teams;
        this._resetScore();

        this._addPaddles();
        this._addBall();


        // yey
        this._animateCanvas();
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
                    this._canvas
                )
            )
        });
    }

    get paddles() {
        return this._paddles;
    }

    _addBall() {
        this._ball = new Ball(this);
    }

    _updatePaddles(deviation) {
        this._paddles.forEach(paddle => {
            deviation[paddle.name] !== undefined && paddle.updatePosition(
                deviation[paddle.name]
            );
        });
    }

    //</editor-fold>

    //<editor-fold desc="Score">
    _getTeamByPosition(position) {
        const filtered = this._teams.filter(team => {
            return team.position === position;
        });
        return filtered[0] || null;
    }

    registerWin(position) {
        const team = this._getTeamByPosition(position);
        this._score[team.name] += 1;

        this._drawScore();
    }

    _resetScore() {
        this._teams.forEach(team => {
            this._score[team.name] = 0;
        });

        this._drawScore();
    }

    _drawScore() {
        if (!this._scoreElem) {
            return;
        }

        const leftScore = this._score[
            this._getTeamByPosition('left').name
            ];
        const rightScore = this._score[
            this._getTeamByPosition('right').name
            ];

        this._scoreElem.innerText = `${leftScore} - ${rightScore}`;
    }

    //</editor-fold>
}
