const server = require('http').createServer();
const http = require('../server').http;
const {ChatCommand} = require('./ChatCommand');
const {ChatMessage} = require('./ChatMessage');
/*
const io = require('socket.io')(http, {
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});
*/
var kicks=[];
var bans=[];

var clients=[];
var MsgBuffer=[];
var _msgBufferSize=15; //15 Zeilen

class ChatServer{

    constructor(io){
        io=io;       
         }

    start(){

   var web= io.of("/web").on('connect', (socket) => {
            web.emit('event',"Willkommen");
            var admin=clientByUID(3);
            if(!admin)return;
            sendMessageTo({_uid:3,_name:"Admin",_picture:"app/anonymous.png"},admin,"Ein Benutzer ist auf der Webseite")            
              socket.on('message', function (msg) {
                console.log(msg);
                web.emit('event',msg);

                sendMessageTo({_uid:0,_name:"WebUser",_picture:"app/anonymous.png"},admin,msg)            
      
                io.to(admin._sid).emit(new ChatCommand("error",msg));
            })
        })

    var chat=io.of("/").on('connect', (socket) => {

        socket.on('connection name', function (user) {
            
            user._sid = socket.conn.id;
            if(user._uid<1)
            {
                socket.emit('connect name','Sie sind anonym verbunden. Bitte geben sie einen Benutzernamen ein.',function(answer){                             
                    //give random user uid
                    var rand=''+ Date.now();
                    rand=rand.substr(7,rand.length);
                    user._uid =  rand;
                    user._name=answer._name;
                    user._sid = socket.conn.id;
                    user._ip = socket.handshake.address;
                    clients[user._uid]=user;
                    socket._uid=user._uid;
                    socket.emit('connected', clients[user._uid]);
                    _broadcastUserlist();
                    _flushMsgBuffer(socket);
                    console.log(user);
                })//connect name 
            } 
            else //authenticated user 
            {
                user._ip = socket.handshake.address;

                console.log(isinKicks(user._uid),"ISKICKED");
                if(isinKicks(user._uid))return sendError(user._ip+" wurde gekickt!");
                if(isinBans(user._ip))return sendError(user._ip+" wurde gebannt!");

                clients[user._uid]=user;
                socket._uid=user._uid;
                if(_user_has_role(user,'administrator'))user._name='⚔️'+user._name;
                if(_user_has_role(user,'moderator'))user._name='🛡️'+user._name;
                socket.emit('connected', clients[user._uid]);
                _broadcastUserlist();
                _flushMsgBuffer(socket);
            }

        socket.on('command', function (cmd) {
            console.log(cmd._cmd);
            if (cmd._cmd == 'kick') {
                var to=clientByUID(cmd._data);
                if(!to)return sendError("Kein Empfänger mit der ID ["+cmd._data+"]");
                var fr=clientByUID(socket._uid);
                sendMessage(fr,to._name+" wurde gekickt!");
                kicks.push(cmd._data);
                delete clients[to._uid];
                console.log(cmd,"KICK++++"+cmd._data);
            }
            if (cmd._cmd == 'unkick') {
                console.log(cmd._data,"unkick");
                var fr=clientByUID(socket._uid);
                var to=clientByUID(cmd._data);
                removeItem(kicks,cmd._data);
                sendMessage(fr,"Benutzer mit der ID ["+cmd._data+"] wurde aus der kickliste entfernt!");
            }
            if (cmd._cmd == 'kicks') {
                var fr=clientByUID(socket._uid);
                var msg=new ChatMessage(socket._uid,kicks); 
                msg.setFrom({ uid: fr._uid, name: fr._name, picture: fr._picture });
                socket.emit('command data', new ChatCommand("message",msg));
            }

            if (cmd._cmd == 'ban') {
                var to=clientByUID(cmd._data);
                if(!to)return sendError("Kein Empfänger mit der ID ["+cmd._data+"]");
                var fr=clientByUID(socket._uid);
                sendMessage(fr,to._name+"'s IP Adresse "+to._ip+" wurde gebannt!");
                bans.push(to._ip);
            }
            if (cmd._cmd == 'unban') {
                removeItem(bans,cmd._data);
                console.log(bans,"UNBANNES++++"+cmd._data);
            }
            if (cmd._cmd == 'bans') {
                var fr=clientByUID(socket._uid);
                var msg=new ChatMessage(socket._uid,bans); 
                msg.setFrom({ uid: fr._uid, name: fr._name, picture: fr._picture });
                socket.emit('command data', new ChatCommand("message",msg));
            }

            if (cmd._cmd == 'message') {
                var fr=clientByUID(cmd._data._from);            
                if(!fr)return sendError("Kein Sender mit der ID ["+cmd._data._from+"]");      
                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }
                io.emit('command data', cmd);       
                _addToMsgBuffer(cmd);
            } else 
            if (cmd._cmd == 'private message') {
                console.log(cmd._data);
                var fr=clientByUID(cmd._data._from);
                if(!fr)return sendError("Kein Sender mit der ID ["+cmd._data._from+"]");      

                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }            
                var to=clientByUID(cmd._data._to);
                if(!to){
                    console.log("kein empfänger");
                    _sendError(fr._sid,'Kein empfänger');
                    return;
                }            
          
                cmd._data._to = { uid: to._uid, name: to._name, picture: to._picture }

                socket.to(to._sid).emit('command data', cmd);
                _addToMsgBuffer(cmd); 
            } else
            if (cmd._cmd == 'private command') {
             //   console.log(cmd._data);
                var fr=clientByUID(cmd._data._from);
                if(!fr){
                    console.log("kein Sender")
                    return;
                }            
                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }            
                var to=clientByUID(cmd._data._to);
                if(!to){
                    console.log("kein empfänger");
                    _sendError(fr._sid,'kein empfänger');
                    return;
                }       
                   
                cmd._data._to = { uid: to._uid, name: to._name, picture: to._picture }

                socket.to(to._sid).emit('command data', cmd);
              
            } else
            if (cmd._cmd == 'userlist') {
                // var _cmd=new ChatCommand(cmd._cmd,cmd._data);
                var clts = _getClients();
                console.log(clts,'clients');
                cmd._data = clts;
              // socket.emit('command data',cmd);        
            } 
            else io.emit('command data', cmd);
            if(processCommand)processCommand(cmd); 
        });//command

    }); //connection name
    
    socket.on('disconnect', function (data){
        console.log(data,'disconnect');
        console.log(socket._uid,'disconnect uid');
        if(socket._uid!=='undefined')delete clients[socket._uid];
        _broadcastUserlist();
    }); //disconnect

}); //connect


function _sendError(to,msg){
    var _cmd=new ChatCommand('error',msg);
    io.emit('command data',_cmd);
  }

function _broadcastUserlist(){
    var clts=_getClients();
    var _cmd=new ChatCommand('userlist',clts);
    io.emit('command data',_cmd);
  }

function  _getClients() {
    var clts = []
    clients.forEach(client => {
        clts.push(client);
    });
    return clts;
}

function _user_has_role(user,hasrole){
    console.log(user);
      var k=Object.keys(user._roles);
      let r=false;
      k.forEach(role => {
          if(hasrole==user._roles[role])r=true;
      });
  return r;
  }
}//start
 
}

function clientByUID(uid){
    var client=null;
    clients.forEach(c => {
      if(uid==c._uid)client=c;
    });      
    return client;
}

function _flushMsgBuffer(socket){
    console.info(MsgBuffer.length,'ChatServer._flushMsgBuffer');
    MsgBuffer.forEach(_cmd => {
        if(_cmd._cmd=='message')    socket.emit('command data',_cmd)
        else 
       if(_cmd._cmd="private message"){
        var fr=clientByUID(_cmd._data._from.uid);
        var to=clientByUID(_cmd._data._to.uid);    

        if(to&&socket._uid==to._uid)   io.to(to._sid).emit('command data',_cmd);
       // _cmd._data._to = { uid: to._uid, name: to._name, picture: to._picture }
    if(fr&&socket._uid==fr._uid)io.to(fr._sid).emit('command data',_cmd);

      
        }    
   
    }); //foreach
}

function sendError(text){
      var msg=new ChatMessage({uid:0,name:"Server", picture:"app/anonymous.png"},text);
      msg.setColor("red"); 
      io.emit('command data', new ChatCommand("error",msg));
}

function sendMessage(from,text,color="#333"){
    var msg=new ChatMessage({uid:from._uid,name:from._name, picture:from._picture},text);
    msg.setColor(color); 
    io.emit('command data', new ChatCommand("message",msg));
}

function sendMessageTo(from,to,text,color="#333"){
    var msg=new ChatMessage({uid:from._uid,name:from._name, picture:from._picture},text);
    msg.setColor(color);
    msg.setTo({uid:to._uid,name:to._name, picture:to._picture}); 
  
    io.emit('command data', new ChatCommand("private message",msg));
}
function _addToMsgBuffer(cmd){
    console.log(cmd,"ADDED"+MsgBuffer.length);
   if(MsgBuffer.length>_msgBufferSize)MsgBuffer.shift();
    MsgBuffer.push(cmd);
}

function isinKicks(uid){
var ret=false;
    kicks.forEach(kicked => {
        if(uid==kicked)ret=true;
    });
return ret;
}

function isinBans(ip){
var ret=false;
    bans.forEach(banned => {
        if(ip==banned)ret=true;
    });
return ret;
}
    


function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}

module.exports= {ChatServer,clientByUID};