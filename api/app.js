const express = require('express');
const app = express();
const api = express.Router();
const database = require('./dbconfig/database');
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./socket')(io);
// database.connect()

require('./config')(app, express);

module.exports ={
    app, 
    server
}