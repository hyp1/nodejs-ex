'use strict';
//var http = require('http').Server();
const express = require('express');
const app     = express();
const http = require('http').Server(app);
//const io = require('socket.io').listen(http)
const {LogMessage,Message} = require('./message')


const {AWRIBot} = require('./awribot');
const {User} = require('./drupalconnect');

const bot=new AWRIBot;




var _server=null;
var _io=null;

var clients=[];

class Server {
    constructor(io) {   
      if(_server)return _server;
      this.time = Date.now();
      this._sockets=null;
      var  _clients;
      _server=this;
      _io=io;
         
      console.log(_io,"Chatserver constructed: ");
    } 
    
    get time() {
        return this._time;      
    
    }
    set time(time) {
        this._time= time
    }      
     
   set name(name) {
      this._name = name.charAt(0).toUpperCase() + name.slice(1);
   }

  get name() {
      return this._name;
  }
 
  set clients(clients) {
    this._clients = clients;
}

 get clients() {
    return this._clients;
}
 
   
  set info(info) {
        this._info = info;
  }

  get info() {
        return this._indo;
  }

    log(msg) {
       // this._sockets.emit('message',msg);
      console.log(this.time+', ' + this.name + ', : ' + this.info);
    }


    setName(name) {
        this.name = name.charAt(0).toUpperCase() + name.slice(1)
    };
      
    setInfo(info) {
        this.info = info;
    };
    
    setClients(clietns) {
        this.clients=clients;
    };
      
    getClients() {
        this.clients;
    };

   static log(msg) {
    sockets.emit('message',msg)
        console.log('SERVER:\time:'+ this.time+'\nid:'+ this.id+'\ntype:'+ + this.name+'\info:'+ + this.info+'\nparams:'+ + this.params + '' );
      };

 run(proc){
  

     console.log('Chatserver running: '+this._port)
    this._sockets=_io.sockets;
   
    let sequenceNumberByClient = new Map();

 _io.on("connection", (socket) => {
    var uid=-1;
    var userName= ''+new Date().getTime();
    var user=new User(1,'BLAH');
    userName='User'+userName.substring(6,userName.length);
    
   //socket.emit('ping',new Date().getTime());

    socket.on('connection name',function(client){
  //  console.log(client);  
     userName=client.name;
     uid=client.uid;
     user.uid=uid;
     user.name=userName;
     user.socket=socket;
     bot.run(user);

//    console.log(bot)
    
    client.socket=socket;
    clients[uid]=client;
    const  msg=new Message()
    msg.setParams({from:uid,name:userName});   
    msg.setMsg(userName+' connected')  
    broadcastMessage(msg)
    if(proc) proc(msg)
    })

   socket.on('disconnect',function(){
   //console.log(userName,'disconnect');
  //ACHTUNG this._clients nicht initialisiert in Mocha TEsts
    if(this._clients)delete  this._clients[uid];
})

socket.on('list',function(list){
    sendList(list);
    if(proc)proc(list);
})

socket.on('message',function(txt){
    console.info(txt,"MESSAGE");
  //  if(txt.startsWith('/bot'))_parseBotCommand(txt.substring(5,txt.length));
    const  msg=new Message();
    msg.setMsg(txt);
    msg.setParams({from:uid,name:userName})
   //msg.setMsg(client.name+ ' connected')
     broadcastMessage(msg);
     if(proc)proc(msg);
})

socket.on('private message',function(data){
   //   console.log(data)
   sendMessageTo(data);
   if(proc)proc(data);
})

socket.on('get-seq',function(){
})

function sendMessageTo(data){
    const  msg=new Message()
    msg.setType(-1)
    msg.setMsg('Error sending private message to  '+data.to)  
    msg.setParams({from:uid,name: userName})
    for (var k in clients){
        if (data.to==k) {             
        msg.setType(2)
        msg.setMsg(data.msg)
     //   data.from=k 
     msg.setParams({from:k,name: userName +' > '+clients[k].name})
      clients[k].socket.emit('private message',msg)
     
        }
    }
    // uid not found
 //   const  logmsg=new LogMessage(socket,msg)
//    console.info(logmsg)
    socket.emit('private message',msg)
 //   console.info(msg);
}

function sendMessage(txt){    
    socket.emit('message',txt);
}

function broadcastMessage(msg){
    msg.setType(0)
    msg.setParams({from:uid,name:userName})
    io.emit('message', msg)    
}    

function sendList(list){
    socket.emit('userlist',  _makeList());
}
      
function broadcastList(){
    this.io.sockets.emit('userlist',_makeList());
}
      

function _makeList(){
    var users=[]
    for (var k in clients)
//        if (!clients.hasOwnProperty(k)) 
       users.push({uid:k,name:clients[k].name});          
    return users    
}

})//connection





function _parseBotCommand(cmd){
  
}

}//run
 
}




module.exports = {Server,http}