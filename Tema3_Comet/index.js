var http = require("http")
var express = require("express");
var app = express();
var server = http.createServer(app);
var newsFeed = require("./news")

var io = require("socket.io").listen(server)

port = port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'))



app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')


});


app.get('/publisher',(req, res)=>{
    res.sendFile(__dirname+ '/public/publisher.html');
});

io.on('connection', (socket)=>{
    console.log("a user conected");
    socket.emit('news',{ id:0,
                         news_title:"Welcome to our Page",
                         description:"This is awesome comet news fetcher"
                        });
    
    socket.on('new_rating',(data)=>{
        console.log(data);
    });

    socket.on('add_news',(data)=>{
        newsFeed.publish(data);
    })
    socket.on('subscribe',(data)=>{
        newsFeed.subscribe(data, socket);
    })
    socket.on('disconnect',(_)=>{
        console.log('a user disconect')
        newsFeed.client_disconnect(socket)
    })

});



server.listen(port, ()=>{
    console.log("listening on port",port);
});