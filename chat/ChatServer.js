/*
Socket io websockets chat _server
socket.ui library
https://socket.io/docs/

->connect 
<-connected name {uid,name}
->connection name {uid,name}
->message {cmd:'message' data:{from:'',txt:'',}
->private message {cmd:'privatemessage' data:{from:'',to:'':txt:'',}
->command {name:'',params:''}
*/

'use strict';
const express = require('express');
const app     = express();
const http = require('http').Server(app);  

const {LogMessage,ChatMessage} = require('./ChatMessage');
const {ChatCommand} = require('./ChatCommand');
const {ChatUser} = require('./ChatUser');

app.use('/', express.static('public'), function (req, res) {
  //  res.sendFile('index.html', { root: __dirname + '/public' });
  });


var _server=null;
var _clients=null;
var _msgBufferSize=3;

class ChatServer {
    constructor(io) {   
        this.clients; 
      if(_server)return _server;
      this.time = Date.now();
      this._sockets=io;
      _server=this;
      _clients=[];
      console.log("Chat_server on port %s constructed.",this._io);
    } 
  
    stop(){
    var cmd =new ChatCommand('chatserver stopped','');
    io.disconnect();
    if(callb)callb(cmd);
    }
 
    start(proc){
        let io=  this._sockets;

        var MsgBuffer = [];
 
        let user = ChatUser;                
        var _msg=new ChatMessage();
        var _cmd=new ChatCommand();
        io.of('/')
            .on('connection', function (socket) { 
          //  console.log("rooms: ", io.nsps["/"].adapter.rooms);  
            _connection();  //connect
            _userlist();
            _flushMsgBuffer();
            
            socket.on('connection name',function(name){              //{uid,name}
               _connection_name(name);                                      
               _userlist();
      //         _flushMsgBuffer();    // wird nicht geflusht wenn sich der User direkt einloggt, sonst bekommt er die Daten 2x 
            });     
             
             socket.on('message',function(msg){
                console.log(msg);
                _msg=new ChatMessage();
                _cmd=new ChatCommand();        
                _msg.txt=msg.data.txt;
                _msg.from=msg.data.from;
                if(msg.color !== undefined)_msg.setColor(msg.color);
                _cmd.cmd='message';
                _cmd.data=_msg;                
                _server.broadcastCommand(_cmd)              
                _addToMsgBuffer(_cmd);                               
            });
              
              //{ from: 'ME', to: 3, txt: 'asdasdasdasd' } 
            socket.on('private message',function(privcmd){ 
               _cmd=new ChatCommand();
               _msg=new ChatMessage();
               var dat=privcmd;              
               var sid=   _server._getSidByUid(dat._data.to); 
               _cmd.cmd="private message",
               _msg.setText(dat._data.txt);
               _msg.setFrom(dat._data.from);
               _msg.setColor(dat._data.color);
               _msg.setParam({to:_clients[dat._data.to].name});
               _cmd.data=_msg;
               _server.sendMessage(sid,_cmd);
               _addToMsgBuffer(_cmd);                               
               //_server.sendMessage(_clients[dat.data.to].sid,_cmd);
            });  
            
            socket.on('userlist',function(){   
               _userlist();
            })

            socket.on('disconnect',function(){  
                console.log(user.name+ 'disconnected'); 
                _clients.pop(user);
             })
 

             socket.on('command',function(cmddata){   
                if(cmddata.data.name=='listusers'){
                    _cmd=new ChatCommand();
                    _cmd.cmd='userlist';
                    _cmd.data=_server.userList();
                    _server.broadcastCommand(_cmd);
                     }          
    
                if(processCommand)processCommand(cmddata); 
            });        

   

        function  _connection(){
            user=new ChatUser();
            user._sid=socket.id;
         //   _clients.push(user); //KEINE SOCKET ID WEITERGEBEN AN ANONOYMOUS????
            _clients[user.uid]=user;
            var _cmd=new ChatCommand();
            _cmd.cmd='connected';
            _cmd.data={uid:user.uid,name:user.name};            
           _server.broadcastCommand(_cmd);
        };

        function _connection_name(newuser){
            _clients.pop(user);
            user.uid=newuser.uid;
            user.name=newuser.name;
            user.fbid=newuser.fbid;
            user.picture=newuser.picture;
            user._roles=newuser.roles;
            user._sid=socket.id;
            var _cmd=new ChatCommand();       
            _cmd.cmd='connected';
            _cmd.data={uid:user.uid,name:user.name,picture:user.picture};
            _clients[user.uid]=user;
            _server.broadcastCommand(_cmd);
        }
        
        function _userlist(){
            _cmd=new ChatCommand();
            _cmd.cmd='userlist';
            _cmd.data=_server.userList();
            _server.broadcastCommand(_cmd);
        }

        function _flushMsgBuffer(){
            console.log('_flushMsgBuffer')
            MsgBuffer.forEach(_cmd => {
               _server.sendMessage(user._sid,_cmd);
            });
        }
       
        function _addToMsgBuffer(cmd){
            console.log('_addToMsgBuffer')
            if(MsgBuffer.length>_msgBufferSize)MsgBuffer.shift();
            MsgBuffer.push(cmd);
        }

    }) //connection socket

   
    } //run
 
    broadcastCommand(_cmd){
    console.info('chat:broadcastCommand');  
        io.emit(_cmd.cmd,_cmd);
       if(processCommand)processCommand(_cmd);
           
    }

    sendCommand(sid,_cmd){
        console.info('chat:sendCommand');  
        io.to(sid).emit(_cmd.cmd,_cmd);
        if(processCommand)processCommand(_cmd);
    }

    broadcastMessage(_cmd){
        console.info('chat:broadcastMessage');  
        io.emit(_cmd.cmd,_cmd);
        if(processCommand)processCommand(_cmd);
    }

    sendMessage(sid,_cmd){
        console.info('chat:sendMessage'); 
        io.to(sid).emit(_cmd.cmd,_cmd);
        if(processCommand)processCommand(_cmd);
    }

    replyClient(sid,_cmd){
        io.to(sid).emit(_cmd.cmd,_cmd);
        if(processCommand)processCommand(_cmd);
    }

    replyServer(reply){
        io.send(reply);
        if(processCommand)processCommand(reply);
    }

    error(sid,error){
        io.to(sid).send(error);
        if(processCommand)callb(error);
    }

    _getSidByUid(uid){
    var sid=null;
        _clients.forEach(client => {
            if(uid==client._uid){
                sid =client._sid
            }      
        });
    return sid;   
    }

    userList(){
        console.info('chat:userList'); 
        var ret=[];
        _clients.forEach(client => {
       if(client)ret.push(client);    
        });
        return ret;
    }
}//class

exports.userList=ChatServer.userList;
module.exports= {_server,ChatServer};
