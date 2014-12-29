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

        var user = "";

        socket.on('user', function (data) {
            user = data.name;
            console.log(user + " is online");       
        });

        socket.on('typing', function (data) {
            console.log(user + " is typing");       
        });
        
        socket.on('msg', function (data) {
            var newMsg = new Message();
            newMsg.author = data.author;
            newMsg.text = data.text;
            var now = new Date();
            var utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            newMsg.time = strftime("%T %F", utc);
            newMsg.url = data.url;
            newMsg.save(function (err, newMsg) {
                if (err) return console.error(err);
                io.emit('msg', newMsg);
            });       
        });

        socket.on('disconnect', function(){
            console.log(user + ' disconnected');
        });
    });

    var port = process.env.PORT || 3000;

    http.listen(port, os.hostname(), function(){
        console.log('listening on ' + os.hostname() + ':' + port);
    });
}