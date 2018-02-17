let express = require('express');
let path = require('path');
let http = require('http');
let socketio = require('socket.io');
let consolidate = require('consolidate');
let ip = require('ip');

let PongServer = require('./server/game/pong_server');

let app = express();
let server;
let io;
let game;

const PORT = 8080;
const IP = ip.address();

const VIEW_PARAMS = {
    ip: IP,
    port: PORT
};

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});

app.use('/javascript', express.static(path.join(__dirname, '../compiled/javascript')));
app.use('/style', express.static(path.join(__dirname, '../compiled/style')));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');
app.engine('.hbs', consolidate.handlebars);

// register routes
app.get('/', (req, res) => {
    res.render('player.hbs', VIEW_PARAMS);
});
app.get('/pong', (req, res) => {
    res.render('pong.hbs', VIEW_PARAMS);
});

server = http.Server(app).listen(PORT, () => {
    console.log('app listening at http://%s:%s', IP, PORT);
});

io = socketio(server);
game = new PongServer(io);