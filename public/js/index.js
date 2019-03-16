var socket= io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

socket.emit('createMessage', {
    from: 'Rahi Bilal',
    text: 'Hey Shubh! how are you doing.'
});

socket.on('newMessage', function(message) {
    console.log(message);
});
