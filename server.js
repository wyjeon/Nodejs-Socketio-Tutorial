var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('chat');
})

var count = 1;

//connect
io.on('connection', function(socket) {
    console.log('user connceted: ', socket.id);
    var name = "id#" + count++;
    socket.name = name;
    io.to(socket.id).emit('create name', name);

    //disconnect
    socket.on('disconect', function() {
        console.log('user disconncected: ' + socket.id + ' ' + socket.name);
    });

    //send message
    socket.on('send message', function(name, text) {
        var msg = name + ' : ' + text;
        socket.name = name;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

http.listen(3000, function() {
    console.log('server on...');
});