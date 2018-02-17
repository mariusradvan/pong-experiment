class PongPlayer {

    constructor(hostname) {
        // constants
        this.events = {
            signal: 'signal',
            register: 'register-player',
            team: 'team'
        };

        this.CONST_SELECTED_CLASS = 'selected';
        this.CONST_UP = 1;
        this.CONST_DOWN = -1;

        this._buttons = [];
        this._state = 0;
        this._vibrateInterval = null;

        this._socket = io(hostname, {
            transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']
        });

        // connection callback
        this._socket.on('connect', () => {
            this._resetState();
        });

        // register as a player
        this._socket.emit(this.events.register);

        // get team info
        this._team = null;
        this._socket.on(this.events.team, (team) => {
            this._team = team;

            let elem = document.querySelector('#team-header');
            elem.style.backgroundColor = this._team.color;
        });
    }

    registerButton(element, value, vibrate) {
        // only -1 and 1 are allowed
        if ([-1, 1].indexOf(value) === -1) {
            return false;
        }

        // remove this button, if it already exists, in order to override its value
        this._buttons.filter(b => {
            return b.element !== element;
        });
        this._buttons.push({
            element: element,
            value: value,
            vibrate: vibrate
        });

        // add click handler
        element.addEventListener('click', () => {
           this._changeState(value);
        });
    }

    _changeState(value) {
        if (value === this._state) {
            return;
        }

        this._state = value;

        this._socket.emit(this.events.signal, value);

        this._buttons.forEach(b => {
            b.element.classList.remove(this.CONST_SELECTED_CLASS);
        });
        let button = this._buttons.find(b => {
            return b.value === value;
        });
        if (button) {
           if (button.vibrate) {
               this._startVibration();
           } else {
               this._stopVibration();
           }

           button.element.classList.add(this.CONST_SELECTED_CLASS);
        }
    }

    _resetState() {
        this._state = 0;

        this._buttons.forEach(b => {
            b.element.classList.remove(this.CONST_SELECTED_CLASS);
        });

        this._stopVibration();
    }

    _startVibration() {
        const duration = 3000;

        window.navigator.vibrate(duration);
        this._vibrateInterval = setInterval(() => {
            try {
                window.navigator.vibrate(duration);
            } catch(e) {
                // do nothing
            }

        }, duration);
    }

    _stopVibration() {
        clearInterval(this._vibrateInterval);
        try {
            window.navigator.vibrate(0);
        } catch (e) {
            // do nothing
        }

    }
}