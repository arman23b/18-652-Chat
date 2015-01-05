var os = require('os');
var mongoose = require('mongoose');
var Message = require('./models/message');
var User = require('./models/user');
var strftime = require("strftime");
var imageUrl = require('./image');

// Socket communication
exports.socketIO = function (app) {

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    io.on('connection', function (socket) {

        var userEmail = "";

        socket.on('user', function (data) {
            userEmail = data.name;
            console.log(userEmail + " is online");
            User.findOne({ 'email' :  userEmail }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username ' + userEmail);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    user.isOnline = true;
                    // save the user
                    user.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);  
                            throw err;  
                        }
                        io.emit('update', {});       
                        console.log(userEmail + ' is online succesful');    
                    });
                });
        });

        socket.on('typing', function (data) {
            console.log(userEmail + " is typing");       
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
            console.log(userEmail + ' disconnected');
            // check in mongo if a user with username exists or not
            User.findOne({ 'email' :  userEmail }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username ' + userEmail);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    user.isOnline = false;
                    // save the user
                    user.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);  
                            throw err;  
                        }
                        console.log(userEmail + ' is offline succesful');    
                    });
                }
                );
        });
});

var port = process.env.PORT || 3000;

http.listen(port, os.hostname(), function(){
    console.log('listening on ' + os.hostname() + ':' + port);
});
}