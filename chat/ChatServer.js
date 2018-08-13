/*
Socket io websockets chat _server
socket.ui library
https://socket.io/docs/

-> connect 
-> connection name {_uid,_name}
<- connected name {_uid,_name}
-> message {cmd:'message' data:{from:'',txt:'',}
-> private message {cmd:'privatemessage' data:{from:'',to:'':txt:'',}
-> command {cmd:'',data:''}
<- command data{cmd:'',data:''}
*/
'use strict';
const express = require('express');
const app     = express(); 


const {LogMessage,ChatMessage} = require('./ChatMessage');
const {ChatCommand} = require('./ChatCommand');
const {ChatUser} = require('./ChatUser');

app.use('/', express.static('public'), function (req, res) {
  //  res.sendFile('index.html', { root: __dirname + '/public' });
  });


var _server=null;
var _clients=[];

var MsgBuffer=[];
var _msgBufferSize=15; //15 Zeilen

class ChatServer {
    constructor(io) {   
        this.clients; 
      if(_server)return _server;
      this.time = Date.now();
      this._sockets=io;
      _server=this;
      //_clients=[];
      console.log("AWRI Chat Server constructed and running...");
    } 
  
    stop(){
    var cmd =new ChatCommand('chatserver stopped','');
    io.disconnect();
    if(callb)callb(cmd);
    }
 
    start(proc){
        let io=  this._sockets;

        var MsgBuffer = [];
 
        let _user = ChatUser;                
        var _msg=new ChatMessage();
        var _cmd=new ChatCommand();
        io.of('/').on('connection', function(socket){

            _user=new ChatUser(); 
            _user.sid=socket.id;
                socket.on('connection name',function(user){
                  console.info(user._name,'ChatServer.connection name');
                if(user._uid==undefined||user._uid==0){socket.emit('connect name','Sie sind anonym verbunden. Bitte geben sie einen Benutzernamen ein.',function(answer){
                
                  _user.setName(answer.name);

                socket.emit('connected',_user);  
                //addClient(_user);
                _clients[_user._uid]=_user;
             //   console.log(_user,'connected');
                _server._broadcastUserlist();
                _server._flushMsgBuffer(socket);  
              });
              } else{
                console.info(user._name,'ChatServer.connection name(authenticated)');
           //     console.log(user,'connected' );
                _user.setName(user._name);
                _user._uid=user._uid;
                _user._token=user._token;
                _user._session=user._session;
                _user._roles=user._roles;
                _user._email=user._email;
                _user._fbid=user._fbid;
                if(user.fbid)_user._picture='https://graph.facebook.com/'+user.fbid+'/picture?type=small';
                if(user.picture)_user._picture=user.picture.url;
                socket.emit('connected',_user);   
                _clients[_user._uid]=_user;
         //       console.log(_user,'connected' );

                _server._broadcastUserlist();
                _server._flushMsgBuffer(socket);
              }    
             // user=new ChatUser();
             
          })//connection name
          
          socket.on('disconnect',function(cli){
            console.log(cli,'disconnected');
            delete _clients[_user._uid];
            })
          
            socket.on('command',function(cmd){
              _server.execute(socket,cmd); //class ChatCommand
            });
   
        }) //connection socket
   
    } //run

    execute(socket,cmd){
        console.info(cmd._cmd,'ChatServer.execute');
        if(cmd._cmd=='userlist'){
       // var _cmd=new ChatCommand(cmd._cmd,cmd._data);
        var clts=_server.getClients();
        cmd._data=clts;
        socket.emit('command data',cmd);
      
        }else
        if(cmd._cmd=='message'){
          var f=_server.clientByUID(cmd._data._from);
            if(f==null){
              //sendError(socket,'Sorry, keinen empfänger gefunden!');
              console.log('message: Kein sender! : '+ cmd._data._from);
            return; 
              //throw new Exception("Fehler beim verpacken der privaten Nachricht");     
            }
        var  _msg=new ChatMessage();
          _msg.setText(cmd._data._txt)
          _msg.setFrom({uid:f._uid,name:f._name,picture:f._picture})
          _msg.setColor(cmd._data._color)
          cmd._data=_msg;
          io.emit('command data',cmd);
          this._addToMsgBuffer(cmd);
          }
          else
          if(cmd._cmd=='private message'){
          var  _msg=new ChatMessage();
            _msg.setText(cmd._data._txt);
            var f=_server.clientByUID(cmd._data._from);
            var t=_server.clientByUID(cmd._data._to);
            if(f==null){
              console.log('private message: Kein sender! : '+ cmd._data._from);
            return; 
            }    
            if(t==null){
              io.to(f.sid).emit('error','Fehler; keinen Empfänger gefunden.')
              console.log('private message: Kein empfänger! : '+ cmd._data._to);
            return; 
              //throw new Exception("Fehler beim verpacken der privaten Nachricht");     
            }
            _msg.setTo({uid:t._uid,name:t._name,picture:t._picture});
            _msg.setFrom({
              uid:f._uid,
              name:f._name,
              picture:f._picture});
              _msg.setColor(cmd._data._color);
              cmd._data=_msg;
            console.log("sendin from:",f._sid);
            console.log("sendin to:",t._sid);
            _server.sendCommandToUID(t._uid,cmd);
            }else
            socket.emit('command data',cmd);
            if(processCommand)processCommand(cmd); 
            //else socket.emit('error','Befehl nicht erkannt'); //private msg 
      }  
    
    _flushMsgBuffer(socket){
        console.info(MsgBuffer.length,'ChatServer._flushMsgBuffer');
        MsgBuffer.forEach(_cmd => {
            socket.emit('command data',_cmd);
        });
    }
   
    _addToMsgBuffer(cmd){
       if(MsgBuffer.length>_msgBufferSize)MsgBuffer.shift();
        MsgBuffer.push(cmd);
    }
    
    _broadcastUserlist(){
        var clts=this.getClients();
        var _cmd=new ChatCommand('userlist',clts);
        io.emit('command data',_cmd);
      }

    sendCommandToUID(uid,cmd){
        var t=clientByUID(uid);
        io.to(t._sid).emit('command data',cmd);      
      }
      
      
    getClients(){
      var clts=[];
      _clients.forEach(c => {
          var clt={uid:c._uid,
                name:c._name,
                picture:c._picture}
          if(clt)clts.push(clt);
          });
    return clts;  
    }


    clientByUID(uid){
        var client=null;;
        _clients.forEach(c => {
          if(uid==c._uid)client=c;
        });      
        return client;
    }

    sendCommandToUID(uid,cmd){
        var t=_server.clientByUID(uid);
        io.to(t._sid).emit('command data',cmd);  
      }

}//class

module.exports= {_server,ChatServer};