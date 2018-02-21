let constants = require('../constants');

class PongHost {
    constructor(socket) {
        this._socket = socket;

        this._socket.emit(constants.events.spec, {
            teams: constants.teams,
            backgroundColor: constants.backgroundColor
        });
    }

    notifyClient(event, data) {
        this._socket.emit(event, data);
    };
}

module.exports = PongHost;