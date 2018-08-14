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
      this._user = null; 
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
 
                
        var _msg=new ChatMessage();
        var _cmd=new ChatCommand();
        io.of('/').on('connection', function(socket){

            socket.on('connection name',function(user){
                 
                  this._user=new ChatUser(); 
                  this._user._sid=socket.id;
                  this._user._ip=socket.handshake.address;
                  console.info(user._name,'ChatServer.connection name');
                if(user._uid==undefined||user._uid==0){socket.emit('connect name','Sie sind anonym verbunden. Bitte geben sie einen Benutzernamen ein.',function(answer){
                  this._user._uid;
                  this._user.setName(answer.name);

                  socket.emit('connected',this._user);  
                //addClient(_user);
                
                _clients[this._user._uid]=this._user;
             //   console.log(_user,'connected');
                _server._broadcastUserlist();
                _server._flushMsgBuffer(socket);  
               
                _msg.setText(' hat den Chat betreten.');
                _msg.setFrom({uid:this._user._uid,name:this._user._name,picture:this._user._picture})
                _server.sendMessage(_msg);
                var cmd=new ChatCommand();
                cmd._cmd='message';
                cmd._data=_msg; 
                _server._addToMsgBuffer(cmd);
               if(processCommand)processCommand(cmd); 
              

              });
              } else{

            this._user=new ChatUser(); 
                console.info(user._name,'ChatServer.connection name(authenticated)');
                console.log(socket.id,'SOCKET?ID?' );
                this._user.setName(user._name);
                this._user._sid=socket.id;
                this._user._ip=socket.handshake.address;
                this._user._uid=user._uid;
                this._user._token=user._token;
                this._user._session=user._session;
                this._user._roles=user._roles;
                this._user._email=user._email;
                this._user._fbid=user._fbid;
                if(user.fbid)this._user._picture='https://graph.facebook.com/'+user.fbid+'/picture?type=small';
                if(user.picture)this._user._picture=user.picture.url;
                socket.emit('connected',this._user);   
                _clients[this._user._uid]=this._user;
               console.log(this._user,'connected' );
               
                _server._broadcastUserlist();
                _server._flushMsgBuffer(socket);

                _msg.setText(' hat den Chat betreten.');
                _msg.setFrom({uid:this._user._uid,name:this._user._name,picture:this._user._picture})
                _server.sendMessage(_msg);
                var cmd=new ChatCommand();
                cmd._cmd='message';
                cmd._data=_msg; 
                _server._addToMsgBuffer(cmd);
                if(processCommand)processCommand(cmd); 

              }    
             // user=new ChatUser();
             
          })//connection name
          
          socket.on('disconnect',function(cli){
            console.log(cli,'disconnected');
           // delete _clients[this._user._uid];
            })
          
            socket.on('command',function(cmd){
              _server.execute(socket,cmd); //class ChatCommand
            });   

        }) //connection socket
   
    } //start

    execute(socket,cmd){
        console.info(cmd._cmd,'ChatServer.execute');
        if(cmd._cmd=='kick'){
        var from=this.clientByUID(cmd._data._from);
        var to=this.clientByUID(cmd._data._to);
        if(!from){
            console.error('Kein sender','kick');  
          return;
          }
        if(!to){
          var msg=new ChatMessage();
          msg.setFrom({uid:from._uid,name:from._name,picture:from._picture});
          msg.setColor('red');
          msg.setText('Keinen Empfänger gefunden!');
          this.sendPrivateMessage(from._uid,msg);
            console.error('Keinen Empfänger gefunden!','kick');  
          return;
          }
        console.log(from);
        if(this.user_has_role(from,'administrator')||this.user_has_role(from,'moderator'))
        {
          var msg=new ChatMessage();
          msg.setFrom({uid:from._uid,name:from._name,picture:from._picture});
          msg.setTo({to:to._uid,name:to._name});
          msg.setColor('red');
          msg.setText(to._name+' wurde gekickt!')
         // this.sendCommandToUID(to._uid,new ChatCommand('message',msg));
         if(processCommand)processCommand(new ChatCommand('message',msg)); 
          this.sendMessage(msg);
          console.info(msg._txt,from._name);
          delete _clients[to._uid];
          this._broadcastUserlist();
      }
        else {
          console.log("KEIN ADMIN");
        this.sendErrorTo(from._uid,'Sie sind kein Admin oder Moderator!')
        }
          console.log(from.name,'kick von:');
          console.log(from.roles,'roles:');
          console.log(cmd._data,'data:');
        }

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
          this.sendCommand(cmd);
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
              this.sendErrorTo(f.uid,'Fehler; keinen Empfänger gefunden.')
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


      
    getClients(){
      var clts=[];
      _clients.forEach(c => {
          var clt={uid:c._uid,
                name:c._name,
                picture:c._picture,
                roles:c._roles,}
          if(clt)clts.push(clt);
          });
    return clts;  
    }


    clientByUID(uid){
        var client=null;
        _clients.forEach(c => {
          if(uid==c._uid)client=c;
        });      
        return client;
    }

    clientBySID(sid){
      var client=null;
      var clts=this.getClients();
      clts.forEach(c => {
        if(sid==c._sid)client=c;
      });      
      return client;
  }

sendError(txt){
  io.emit('error',txt);
}

sendErrorTo(uid,txt){
  var t=_server.clientByUID(uid);
  io.to(t._sid).emit('error',txt);
}


sendMessage(msg){
    var cmd=new ChatCommand('message',msg);
    this.sendCommand(cmd);
  }

  sendPrivateMessage(uid,msg){
    var cmd=new ChatCommand('private message',msg);
    this.sendCommandToUID(uid,cmd);
  }

  sendCommand(cmd){
    io.emit('command data',cmd);  
  }

  sendCommandToUID(uid,cmd){
    var t=_server.clientByUID(uid);
    io.to(t._sid).emit('command data',cmd);  
  }

    user_has_role(user,hasrole){
      console.log(user);
        var k=Object.keys(user._roles);
        let r=false;
        k.forEach(role => {
            if(hasrole==user._roles[role])r=true;
        });
    return r;
    }
}//class

module.exports= {_server,ChatServer};