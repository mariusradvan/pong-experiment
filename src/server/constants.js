module.exports = {
    defaultInterval: 1000 / 60,

    events: {
        registerHost: 'register-host',
        registerPlayer: 'register-player',
        move: 'move',
        disconnect: 'disconnect',
        team: 'team',
        spec: 'spec',
        playerSignal: 'signal',
        info: 'info'
    },

    teams: [{
        name: 'first',
        color: '#f6d155',
        position: 'left'
    }, {
        name: 'second',
        color: '#74d1ea',
        position: 'right'
    }],

    backgroundColor: '#63666A'
};