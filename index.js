const fetch = require("node-fetch");
const ejs = require('ejs');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.static("public"));
const users = {};
let map = new Map();
server.listen(PORT, function(){
    console.log("server started");
});



app.get('/', function(req,res){
    res.render("main");
});

app.get("/chat", function(req,res){
    res.render("index");
})


app.get("/live", function(req,res){
    res.render("Live", {map : map, users : users});
});

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
       socket.on('disconnect',function(){
           map.delete(socket.id);
           socket.broadcast.emit('dis-user', users[socket.id]);
       });
       socket.on('lati-long', function(data){
        let url =  "https://api.opencagedata.com/geocode/v1/json?q=" + data.lati + "+" + data.long + "&key=3f973de1de964040b40d211d05515e0d";
        fetch(url)
             .then(result => {return result.json()})
             .then(function(data){
                map.set(socket.id,data.results[0].formatted);
                /////console.log("hello everyone i am fine");
            });
       });
});

