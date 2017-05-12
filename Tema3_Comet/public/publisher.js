
$(document).ready(function(){
    
    console.log('am here')
    // io = require("/socket.io/socket.io.js");
    var socket = io.connect();
    $("#submit").on('click',()=>{
        console.log("submit data");
        socket.emit('add_news',{
            news_title: $("#title").val(),
            description: $('#description').val()
        })
    })

});

