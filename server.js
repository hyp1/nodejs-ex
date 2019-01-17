const express = require('express');
const app     = express();
const http = require('http').Server(app);
var morgan = require('morgan');
var cors = require('cors');

var WEBLOG = process.env.WEBLOG || 0;
var DBLOG = process.env.DBLOG || 0;

const logs = require('./logs');

//var port=8080,ip='127.0.0.1';
const {ChatServer} = require('./chat/ChatServer');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;

  }
}
const LOGGING=0;

console.log(mongoURL, 'MONGO VORHER');
mongoURL = mongoURL || 'mongodb://userGJX:eipLOWYGuKqEIdet@172.30.50.100/sampledb';
console.log(mongoURL, 'MONGO_URL(constructed)');
console.log(ip, 'NODEJS_IP');
console.log(port, 'NODEJS_PORT');


var singleton = require('./database');
singleton.setup(mongoURL);

app.use(cors());

app.use('/logs', logs);
//Serverlogs für APP
//console.log('@module',logs.accessLogStream);
if(LOGGING)
app.use(morgan('combined', {stream: logs.accessLogStream,skip: function (req, res) { 
  return req.headers['user-agent'].indexOf('kube-probe/') > -1 
}}))


app.engine('html', require('ejs').renderFile); //console log modules unten!

app.use('/', express.static('public'), function (req, res) {
  //console.log(req.headers);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

  //res.sendFile(express.static('public')+'index.html');
  res.sendFile('index.html', { root: __dirname + '/public' });
  next();
});


http.listen(8080, function (req, res) {
  console.log('listening on *:' + port);
});
io = require('socket.io').listen(http);

/*
io.origins((origin, callback) => {
  if (origin !== '*:*') {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});
*/
chat=new ChatServer(io);


processCommand=function(cmd){
    console.log(cmd._cmd,'server.js: processCommand');
    if(cmd._cmd=='message')logMessage(cmd._data);
    if(cmd._cmd=='private message')logMessage(cmd._data);
    if(cmd._cmd=='connected')logMessage(cmd._data);
    if(cmd._cmd.startsWith('/')){
     parseCommand(cmd._data);
    }
}


function parseCommand(cmd){
  console.log("parsing command data"+cmd);
}

function logMessage(msg){
    var res=singleton.insert('messages',msg);
  }

  logKick=function(from,to){
    singleton.insert('kicks',{time:Date.now(),from:from,to:to});
  }
  
  delKick=function(uid){
    var db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {  
      db.collection('kicks').remove({ to:uid }, true)         
    });
  }
  }

  clearKicks=function(){
    var db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
      db.collection('kicks').drop();      
    });
  }
  }


listKicks = function(){
    return new Promise(function(resolve,reject){
  var db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
      db.collection('kicks').find({}).toArray(function(err, resultArray){
       return resolve(resultArray);
        });
    });
  }
});
}

isKicked=function(to){
  return new Promise(function(resolve,reject){
  var db=singleton.DbConnection;
  if (db) {
  db.then(function(db) {
    db.collection('kicks').findOne({to:to}, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  })
}
 });  
}

logBan = function(from,to,ip){
    var res=singleton.insert('bans',{time:Date.now(),from:from,to:to,ip:ip});
  }

delBan = function(to){
    var db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {  
      db.collection('bans').remove({ to:to }, true)         
    });
}
}

listBans = function(){
    return new Promise(function(resolve,reject){
  var db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
      db.collection('bans').find({}).toArray(function(err, resultArray){
       return resolve(resultArray);
        });
    });
  }
});
}


isBanned=function(ip){
  return new Promise(function(resolve,reject){
  var db=singleton.DbConnection;
  if (db) {
  db.then(function(db) {
    db.collection('bans').findOne({ip:ip}, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  })
}
 });  
}

clearBans=function(){
  var db=singleton.DbConnection;
  if (db) {
  db.then(function(db) {
    db.collection('bans').drop();      
  });
}
}
  

// muss unten stehen wegen der Module exports 
chat.start(processCommand);


module.exports = app;

