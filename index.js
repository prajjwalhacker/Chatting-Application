const express = require("express");
const socket = require("socket.io");
const fetch = require("node-fetch");

app = express();


app.use(express.static("public"));
const users = {};

server  = app.listen(8000, function(){
    console.log("server started");
});



io = socket(server);




/////console.log("hello");  

io.on('connection', function(socket){
       socket.on('new-user-joined', function(name){
           console.log(name);
           users[socket.id] = name;
           socket.broadcast.emit('user-joined', name);
       });
       socket.on('chat', function(msg){
        io.sockets.emit('receive', msg);
       });
       socket.on('send',function(msg){
           socket.broadcast.emit('receive', {data : msg.message , name : msg.name , pos : "right"});
       });
       socket.on('lati-long', function(data){
        let url =  "https://api.opencagedata.com/geocode/v1/json?q=" + data.lati + "+" + data.long + "&key=3f973de1de964040b40d211d05515e0d";
        fetch(url)
             .then(result => {return result.json()})
             .then(function(data){
                  console.log(data.results[0].formatted);
            });
       });
});

