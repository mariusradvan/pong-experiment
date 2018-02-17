module.exports = {
    defaultInterval: 1000 / 60,

    events: {
        registerHost: 'register-host',
        registerPlayer: 'register-player',
        move: 'move',
        disconnect: 'disconnect',
        team: 'team',
        spec: 'spec',
        playerSignal: 'signal'
    },

    teams: [{
        name: 'first',
        color: '#f6d155',
        position: 'left'
    }, {
        name: 'second',
        color: '#0085ca',
        position: 'right'
    }],

    backgroundColor: '#63666A'
};