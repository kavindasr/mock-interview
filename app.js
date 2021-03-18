var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');

var authenticate = require('./middleware/authenticate');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);

app.use(authenticate.verifyUser);

require('./routes/routes')(app);

var server = require('http').Server(app);

var io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
	maxHttpBufferSize: 1024, 
    pingInterval: 60 * 1000, 
    pingTimeout: 4 * 60 * 1000 
});

io.on('connection', (client) => {
	client.on('subscribe', (room, panelID = [-1]) => {
		client.join(room);
		if (panelID[0] != -1) {
			client.panelID = panelID;
		}
	});

	client.on('unsubscribe', (room) => {
		client.leave(room);
	});

});
app.set('socket', io);

module.exports = { app: app, server: server };
