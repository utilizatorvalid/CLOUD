var clients = [];

exports.subscribe = (data, socket)=>{
    console.log("a user has subscribed to news");
    clients.push(socket);
    
}
exports.publish = (news)=>{

    console.log("A news apeared publish",news);
    clients.forEach((socket)=>{
        socket.emit('news',news);
    });

    clients = [];
}

exports.client_disconnect =(socket)=>{
    clients.splice(clients.indexOf(socket),1);

}

// setInterval(()=>{
//     console.log(clients.length);
// },3000)