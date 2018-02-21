const constants = require('../constants');

class PongPlayer {
    constructor(socket, game) {
        this._id = socket.id;
        this._socket = socket;
        this._team = null;
        this._position = 0;
        this._game = game;
    }

    get id() {
        return this._id;
    }

    get position() {
        return this._position;
    }

    set team(_team) {
        this._team = _team;
    }

    start() {
        // do nothing if player is not assigned to a team yet
        if (this._team === null) {
            return;
        }

        // notify the user about the team
        this._socket.emit(constants.events.team, {
            name: this._team.name,
            color: this._team.color
        });

        // on button press
        this._socket.on(constants.events.playerSignal, data => {
            // update player choice
            const position = parseInt(data, 10);
            if ([-1, 0, 1].includes(position)) {
                this._position = position;
            }
        });

        // disconnect
        this._socket.on(constants.events.disconnect, () => {
            // remove player from the team
            this.quit();
        });
    }

    quit() {
        this._team.removePlayer(this);

        // reset
        this._id = null;
        this._socket = null;
        this._team = null;

        this._game.sendPlayerInfo();
    }
}

module.exports = PongPlayer;