//importing node modules
const path= require('path');
const http= require('http');

//importing npm modules
const express= require('express');
const socketIO= require('socket.io');

//importing in app modules
var {generateMessage}= require('./utils/message');

var publicPath= path.join(__dirname, '../public');
var port= process.env.PORT || 3000;
var app= express();
var server= http.createServer(app);
var io= socketIO(server);

io.on('connection', (socket)=> {
    console.log('New User Connected');
    //Send welcome message from io to connected socket
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //Broadcast to every other socket connected to io that some other socket is connected
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined chat.'));
    
    // Event handler when connected socket emit 'createMessage' event
    socket.on('createMessage', (message, callback)=> {
        callback({from: 'IO', text: 'Message Received.'});
        //io.emit for broadcasting message to every connected socket to io
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', (socket)=> {
        console.log('User Disconnected');
    });
});

//Express miiddeleware for hosting from static web pages
app.use(express.static(publicPath));

//Listen on the given port
server.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});