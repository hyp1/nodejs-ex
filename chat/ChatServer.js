//const server = require('http').createServer();
//const http = require('../server').http;

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
//console.log(m.SimpleMessage,"LOGKICK");
//lk.requestP("https://awri.ch");

//clearKicks();
//logKick(3,802);
//delKick(802);
//listKicks().then(function(result){
//    console.log(result,"test kicks");
//});



   var web= io.of("/web").on('connect', (socket) => {
            web.emit('event',"Willkommen");
            var admin=clientByUID(3);
            if(!admin)return;
            sendMessageTo({_uid:3,_name:"Admin",_picture:"img/logo_blank_50x50.png"},admin,"Ein Benutzer ist auf der Webseite")            
              socket.on('message', function (msg) {
                console.log(msg);
                web.emit('event',msg);

                sendMessageTo({_uid:0,_name:"WebUser",_picture:"img/logo_blank_50x50.png"},admin,msg)            
      
                io.to(admin._sid).emit(new ChatCommand("error",msg));
            })
        })

    var chat=io.of("/").on('connect', (socket) => {
        console.info("connect name %s %s",socket.handshake.address,socket.conn.id);

        socket.on('connection name', function (user) {
            
            user._sid = socket.conn.id;
            user._ip = socket.handshake.address;
            isBanned(user._ip).then(function(res){
                if(res&&res.ip==user._ip){
                    sendError(res.ip+" wurde gebannt!");
                    socket.disconnect();                   
                    return;
                }
            });

            
            if(user._uid<1)
            {
                socket.emit('connect name','<p>Sie sind nicht auf AWRI angemeldet.Sie können dennoch mit eingeschränkten Funktionen teilnehmen.</p><p>Bitte geben sie einen Benutzernamen ein.</p>',function(answer){                             
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
                    console.info("connect name %s %s (anonymous).",user._uid,user._name);
                    sendMessage(user,"hat den Chat betreten","green")
                })//connect name 
                
            } 
            else //authenticated user 
            {
        

isKicked(user._uid).then(function(res){
    if(res&&res.to==user._uid){
        sendError(res.to+" wurde gekickt!");
        socket.disconnect();
        _broadcastUserlist();
        delete clients[res.to];
        return;
    }
});

                clients[user._uid]=user;
                socket._uid=user._uid;
                if(_user_has_role(user,'administrator'))user._name='⚔️'+user._name;
                if(_user_has_role(user,'moderator'))user._name='🛡️'+user._name;
                socket.emit('connected', clients[user._uid]);
                _broadcastUserlist();
                _flushMsgBuffer(socket);
                console.info("connect name %d %s.",user._uid,user._name);
                sendMessage(user,"hat den Chat betreten.","green")

            }
/***************************Commanfs *****************************/

        socket.on('command', function (cmd) {
            console.info("command %s(%d) %s  ",user._name,user._uid,cmd._cmd);  
            if (cmd._cmd == 'whois') {              
                var fr=clientByUID(socket._uid);
            if(!_user_is_in_role(fr,["administrator","moderator"]))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")
                //if()
                var who=clientByUID(cmd._data);
                if(!who)return sendErrorTo(fr,"User nicht online!")
                sendCommandTo(fr,'whois data',who);
                console.info("whois %s(%d) -> %s.",fr._name,fr._uid,cmd._data);
            }
            if (cmd._cmd == 'adminmsg') {
                var admins=[];
                var fr=clientByUID(socket._uid);
                clients.forEach(user => {
                    if(_user_has_role(user,'administrator'))admins.push(user);
                    if(_user_has_role(user,'moderator'))admins.push(user);
                });
                var str=""
                admins.forEach(admin => {
                    sendMessageTo(fr,admin,cmd._data,'red');
                    str+=admin._name+",";
                });
                if(admins.length==0)sendErrorTo(fr,"Es ist derzeit kein Admin oder Moderator online.")
                sendMessageTo(fr,fr,"Die Nachricht wurde an:"+str+" gesendet.")
                console.info("adminmsg %s(%d).",fr._name,fr._uid); 
            }
            if (cmd._cmd == 'kick') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")
                var to=clientByUID(cmd._data);
                if(!to)return sendError("Kein Empfänger mit der ID ["+cmd._data+"]");
                sendMessage(fr,to._name+" wurde gekickt!");
                logKick(fr._uid,to._uid);
                socket.disconnect();
                delete clients[to._uid];
            //    socket.close();
                console.info("kick %s(%d) -> %s(%d) %s.",fr._name,fr._uid,to._name,to._uid,cmd._data);
            }
            if (cmd._cmd == 'unkick') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")            
                delKick(cmd._data);
                sendMessage(fr,"Benutzer mit der ID ["+cmd._data+"] wurde aus der Kickliste entfernt!");
                console.info("unick %s(%d) -> %d.",fr._name,fr._uid,cmd._data);
            }
            if (cmd._cmd == 'kicks') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")

                var msg=new ChatMessage(socket._uid); 
                msg.setFrom({ uid: fr._uid, name: fr._name, picture: fr._picture });         
                listKicks().then(function(result){
                    msg.setText(result);
                    if(result.length==0)sendError("Keine Kicks vorhanden!");
                    else socket.emit('command data', new ChatCommand("kicks data",msg));    
                });              
                console.info("kicks %s(%d).",fr._name,fr._uid);                        
            }

            if (cmd._cmd == 'ban') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")

                var to=clientByUID(cmd._data);
                if(!to)return sendError("Kein Empfänger mit der ID ["+cmd._data+"]");

                sendMessage(fr,to._name+"'s IP Adresse "+to._ip+" wurde gebannt!");
                logBan(fr._uid,to._uid,to._ip);
                console.info("ban %s(%d) -> %s(%d) %s.",fr._name,fr._uid,to._name,to._uid,cmd._data);
            }
            if (cmd._cmd == 'unban') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")
            
                delBan(cmd._data);
                sendMessage(fr,"Benutzer mit der ID ["+cmd._data+"] wurde aus der Bannliste entfernt!");
       
                console.info("unban %s(%d) -> %s.",fr._name,fr._uid,cmd._data);
            }
            if (cmd._cmd == 'bans') {
                var fr=clientByUID(socket._uid);
                if(!_checkAccess(fr))return sendErrorTo(fr,"Sie sind kein Admin oder Moderator!")

                var msg=new ChatMessage(socket._uid); 
                msg.setFrom({ uid: fr._uid, name: fr._name, picture: fr._picture });         
                 listBans().then(function(result){
                    msg.setText(result);
                    if(result.length==0)sendError("Keine Banss vorhanden!");
                    else socket.emit('command data', new ChatCommand("bans data",msg));    
                });              
                console.info("bans %s(%d).",fr._name,fr._uid,cmd._data);
            }

            if (cmd._cmd == 'message') {
                var fr=clientByUID(cmd._data._from);            
                if(!fr)return sendError("Kein Sender mit der ID ["+cmd._data._from+"]");      
                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }
                io.emit('command data', cmd);       
                _addToMsgBuffer(cmd);
                console.info("message %s(%d).",fr._name,fr._uid);

            } else 
            if (cmd._cmd == 'private message') {
                var fr=clientByUID(cmd._data._from);
                if(!fr)return console.error("Kein Sender mit der ID[%d]",cmd._data._from);      

                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }            
                var to=clientByUID(cmd._data._to);
                if(!to)return console.error("Kein Empfänger mit der ID[%d]",cmd._data._to);            
          
                cmd._data._to = { uid: to._uid, name: to._name, picture: to._picture }

                socket.to(to._sid).emit('command data', cmd);
                _addToMsgBuffer(cmd); 
                console.info("private message %s(%d) -> %s(%d).",fr._name,fr._uid,to._name,to._uid);
            } else
            if (cmd._cmd == 'private command') {
             //   console.log(cmd._data);
                var fr=clientByUID(cmd._data._from);
                if(!fr)return console.error("Kein Sender mit der ID[%d]",cmd._data._from);      

                
                cmd._data._from = { uid: fr._uid, name: fr._name, picture: fr._picture }            
                var to=clientByUID(cmd._data._to);
                if(!to)return console.error("Kein Empfänger mit der ID[%d]",cmd._data._to);            
                                 
                cmd._data._to = { uid: to._uid, name: to._name, picture: to._picture }

                socket.to(to._sid).emit('command data', cmd);
                console.info("private command %s(%d) -> %s(%d)",fr._name,fr._uid,to._name,to._uid);
            } else
            if (cmd._cmd == 'userlist') {
                // var _cmd=new ChatCommand(cmd._cmd,cmd._data);
                var clts = _getClients();
                cmd._data = clts;
              // socket.emit('command data',cmd);        
              console.info("userlist %s(%d) length:%d.",user._name,user._uid,clts.length);
            } 
            else io.emit('command data', cmd);
            if(processCommand)processCommand(cmd); 
        });//command

    }); //connection name
    
    socket.on('disconnect', function (data){
        console.log(data,'disconnect');
        //console.info("disconnect socket  %s %s.",socket._uid,socket.sid);
      //  console.log(socket._uid,'disconnect uid');
      //  if(socket._uid!=='undefined')delete clients[socket._uid];
        _broadcastUserlist();
    }); //disconnect

}); //connect

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
//    console.info('_flushMsgBuffer',MsgBuffer.length);
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

function sendCommand(cmd,data){
    var msg=new ChatMessage({uid:0,name:"Server", picture:"img/logo_blank_50x50.png"},data);
    msg.setColor("red"); 
    io.emit('command data', new ChatCommand(cmd,data));
}
function sendCommandTo(to,cmd,data){
    //var msg=new ChatMessage({uid:0,name:"Server", picture:"img/logo_blank_50x50.png"},data);
    //msg.setColor("red"); 
    io.to(to._sid).emit('command data', new ChatCommand(cmd,data));
}

function sendError(text){
      var msg=new ChatMessage({uid:0,name:"Server", picture:"img/logo_blank_50x50.png"},text);
      msg.setColor("red"); 
      io.emit('command data', new ChatCommand("error",msg));
      console.info("error %s.",text);
}

function sendErrorTo(to,text){
    var msg=new ChatMessage({uid:0,name:"Server", picture:"img/logo_blank_50x50.png"},text);
    msg.setColor("red"); 
    io.to(to._sid).emit('command data', new ChatCommand("error",msg));
    console.info("errorto %s(%d) -> %s.",to._name,to._uid,text);
}

function sendMessage(from,text,color="#333"){
    var msg=new ChatMessage({uid:from._uid,name:from._name, picture:from._picture},text);
    msg.setColor(color); 
    var cmd=new ChatCommand("message",msg);
    if(processCommand)processCommand(cmd);
    io.emit('command data',cmd);
}

function sendMessageTo(from,to,text,color="#333"){
    var msg=new ChatMessage({uid:from._uid,name:from._name, picture:from._picture},text);
    msg.setColor(color);
    msg.setTo({uid:to._uid,name:to._name, picture:to._picture}); 
  
    io.to(to._sid).emit('command data', new ChatCommand("private message",msg));
}
function _addToMsgBuffer(cmd){
   if(MsgBuffer.length>_msgBufferSize)MsgBuffer.shift();
    MsgBuffer.push(cmd);
}
    

function _user_has_role(user,hasrole){
      var k=Object.keys(user._roles);
      let r=false;
      k.forEach(role => {
          if(hasrole==user._roles[role])r=true;
      });
  return r;
  }

function _user_is_in_role(user,arr){
    let r=false;
 arr.forEach(has => {     
      var k=Object.keys(user._roles);
      k.forEach(role => {
          if(has==user._roles[role])r=true;
      });
    });//arr
  return r;
  }

  function _addKick(uid){
      logs.insert();
  }

function _checkAccess(user){
return  _user_is_in_role(user,["administrator","moderator"]);
}

module.exports= {ChatServer,clientByUID};