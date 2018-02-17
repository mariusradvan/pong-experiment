const constants = require('../constants');
const PongTeam = require('./pong_team');
const PongPlayer = require('./pong_player');
const PongHost = require('./pong_host');

class PongServer {

    constructor(io, spec) {
        this.io = io;

        // defaults
        const defaults = {
           interval: constants.defaultInterval
        };

        // set up teams
        this._teams = [];

        constants.teams.forEach(spec => {
            this._teams.push(
                new PongTeam(spec)
            );
        });

        this._spec = {};
        Object.assign(
            this._spec,
            defaults,
            spec
        );

        // set up interval for notifying clients
        this._interval = setInterval(() => {
            this._notifyHosts();
        }, this._spec.interval);

        // game
        this._gameHosts = [];
        this._players = {};

        // set up socket.io
        this._setupSocket();
    }

    _setupSocket() {
        this.io.on('connection', socket => {
            this._socket = socket;

            socket.on(constants.events.registerHost, () => {
                this._registerHost(socket);
            });

            socket.on(constants.events.registerPlayer, () => {
                this._registerPlayer(socket);
            });
        });

        this.io.on('disconnect', () => {
            clearInterval(this._interval);
            this._interval = null;
        });
    }

    _registerHost(socket) {
        this._gameHosts.push(
            new PongHost(socket)
        );
    }

    _notifyHosts() {
        let deviation = {};

        this._teams.forEach(team => {
           deviation[team.name] = team.deviation;
        });
        this._gameHosts.forEach(gameHost => {
            gameHost.notifyClient(deviation);
        });
    }

    _registerPlayer(socket) {
        let player = new PongPlayer(socket);
        let team = this.selectTeam(this._teams);

        team.addPlayer(player);
    }

    selectTeam(teams) {
        let _teams = teams.slice();

        return _teams.sort((t1, t2) => {
            return t1.count - t2.count;
        })[0];
    }
}

module.exports = PongServer;