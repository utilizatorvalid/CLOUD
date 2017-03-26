$(document).ready(function () {

        //Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
        var socket = io();
        $('form').submit(function () {
                socket.emit('chat message', $('#m').val());
                $('#m').val('');
                return false;
        });

        socket.on('chat message', (msg)=>{
                console.log('on chat message', msg)
                $('#messages').append($('<li>').text(msg));
        });

});