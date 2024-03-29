var socket= io();

function scrollToBottom() {
    //selectors
    var messages= jQuery('#messages');
    var newMessage= messages.children('li:last-child');
    //heights
    var clientHeight= messages.prop('clientHeight');
    var scrollTop= messages.prop('scrollTop');
    var scrollHeight= messages.prop('scrollHeight');
    var newMessageHeight= newMessage.innerHeight();
    var lastMessageHeight= newMessage.prev().innerHeight();
    
    if(clientHeight+ scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function(message) {
    var formattedTime= moment(message.createdAt).format('h:mm a');
    var template= `<li class="message"><div class="message__title"><h4>{{from}}</h4><span>{{createdAt}}</span></div><div class="message__body"><p>{{text}}</p></div></li>`;
    var html= Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(location) {
    var formattedTime= moment(location.createdAt).format('h:mm a');
    var template= `<li class="message"><div class="message__title"><h4>{{from}}</h4><span>{{createdAt}}</span></div><div class="message__body"><p><a href= "{{url}}" target="_blank">My current location</a></p></div></li>`
    var html= Mustache.render(template, {
        from: location.from,
        createdAt: formattedTime,
        url: location.url
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox= jQuery('[name= message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});

var locationButton= jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    setTimeout(function() {
        navigator.geolocation.getCurrentPosition(function(position){
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function(err){
            locationButton.removeAttr('disabled').text(`Code: ${err.code}, Message: ${err.message}`);
            console.log(err);
        });
    }, 500);
   
});