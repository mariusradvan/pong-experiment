class PongTeam {
    constructor(spec) {
        this._players = {};
        this._position = 0;
        this._color = spec.color;
        this._name = spec.name;
    }

    get count() {
        return Object.keys(this._players).length;
    }

    get color() {
        return this._color;
    }

    get name() {
        return this._name;
    }

    get deviation() {
        let total = 0;
        const count = this.count;

        Object.keys(this._players).forEach(_id => {
            let player = this._players[_id];
            total += player.position;
        });

        return count > 0 ? total / count : 0;
    }

    addPlayer(player) {
        player.team = this;
        this._players[player.id] = player;

        player.start();
    }

    removePlayer(player) {
        player.team = null;
        delete this._players[player.id];
    }
}

module.exports = PongTeam;