//importing node modules
const path= require('path');
const http= require('http');

//importing npm modules
const express= require('express');
const socketIO= require('socket.io');


var publicPath= path.join(__dirname, '../public');
var port= process.env.PORT || 3000;
var app= express();
var server= http.createServer(app);
var io= socketIO(server);

io.on('connection', (socket)=> {
    console.log('New User Connected');
    
    socket.on('disconnect', (socket)=> {
        console.log('User Disconnected');
    });

    // Event handler when connected socket emit 'createMessage' event
    socket.on('createMessage', (message)=> {
        //io.emit for broadcasting message to every connected socket to io
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });



});





app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});