const constants = require('../constants');
const PongTeam = require('./pong_team');
const PongPlayer = require('./pong_player');
const PongHost = require('./pong_host');
const ip = require('ip');

class PongServer {

    constructor(io, spec) {
        this.io = io;

        this._ip = ip.address();

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
        let gameHost = new PongHost(socket);
        this._gameHosts.push(gameHost);

        this.sendPlayerInfo([gameHost]);
    }

    _notifyHosts() {
        let deviation = {};

        this._teams.forEach(team => {
            deviation[team.name] = team.deviation;
        });
        this._gameHosts.forEach(gameHost => {
            gameHost.notifyClient(constants.events.move, deviation);
        });
    }

    _registerPlayer(socket) {
        let player = new PongPlayer(socket, this);
        let team = this.constructor.selectTeam(this._teams);

        team.addPlayer(player);

        this.sendPlayerInfo();
    }

    sendPlayerInfo(hosts) {
        let info = {
            teams: [],
            ip: this._ip
        };
        this._teams.forEach(team => {
            info.teams.push({
                name: team.name,
                count: team.count
            });
        });

        this._gameHosts.forEach(gameHost => {
            if (hosts && hosts.length) {
                if (!hosts.includes(gameHost)) {
                    return;
                }
            }
            gameHost.notifyClient(constants.events.info, info);
        })
    }

    static selectTeam(teams) {
        let _teams = teams.slice();

        return _teams.sort((t1, t2) => {
            return t1.count - t2.count;
        })[0];
    }
}

module.exports = PongServer;