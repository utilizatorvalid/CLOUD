$(document).ready(function(){
    
    console.log('am here')
    // io = require("/socket.io/socket.io.js");
    var socket = io.connect();

        
    socket.on('news',(data)=>{
        console.log(data);
        var news = `<div class="col s12 m6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">${data.news_title}</span>
              <p>${data.description}</p>
            </div>
            <div class="card-action">
            <a id ="${data.id}"class="right btn-floating btn-large waves-effect waves-light red"><i class="material-icons">thumb_up</i></a>
            </div>
          </div>
        </div>`

        $("#news_container").append(news);

        setInterval(loong_pooling('subscribe', socket),
                    30000);

    });


    // socket.emit('new_rating',{id_liked:0});

    

});

loong_pooling = (subscribed_event, socket)=>{

    socket.emit(subscribed_event,{});
}