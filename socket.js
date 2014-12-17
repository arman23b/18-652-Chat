var os = require('os');
var mongoose = require('mongoose');
var Message = require('./models/message');
var strftime = require("strftime");
var imageUrl = require('./image');

// Socket communication
exports.socketIO = function (app) {

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    io.on('connection', function (socket) {
        socket.on('msg', function (data) {
            var newMsg = new Message();
            newMsg.author = data.author;
            newMsg.text = data.text;
            newMsg.time = strftime("%T %F", new Date());
            newMsg.url = data.url;
            newMsg.save(function (err, newMsg) {
                if (err) return console.error(err);
                io.emit('msg', newMsg);
            });       
        });
    });

    http.listen(3000, os.hostname(), function(){
        console.log('listening on ' + os.hostname() + ':3000');
    });
}