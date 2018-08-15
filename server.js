const express = require('express');
const app     = express();
const http = require('http').Server(app);
var morgan = require('morgan');

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

//console.log(mongoURL, 'MONGO VORHER');
//mongoURL = mongoURL || 'mongodb://userTR5:nmdym2aLFpT70Gqi@172.30.130.83/sampledb';
console.log(mongoURL, 'MONGO_URL(constructed)');
console.log(ip, 'NODEJS_IP');
console.log(port, 'NODEJS_PORT');


var singleton = require('./database');
singleton.setup(mongoURL);


app.use('/logs', logs);
//Serverlogs für APP
//console.log('@module',logs.accessLogStream);
app.use(morgan('combined', {stream: logs.accessLogStream}))

app.use('/', express.static('public'), function (req, res) {
  //console.log(req.headers);
  //res.sendFile(express.static('public')+'index.html');
  res.sendFile('index.html', { root: __dirname + '/public' });
});


http.listen(8080, function (req, res) {
  console.log('listening on *:' + port);
});
io = require('socket.io').listen(http)
chat=new ChatServer(io);


processCommand=function(cmd){
    console.log(cmd,'server.js: processCommand');
    if(cmd._cmd=='message')logMessage(cmd._data);
    if(cmd._cmd=='private message')logMessage(cmd._data);
    if(cmd._cmd=='connected')logMessage(cmd._data);
    console.log(cmd._cmd);
    if(cmd._cmd.startsWith('/')){
     parseCommand(cmd._data);
    }
    if(cmd.data=='userlist'){
    //    console.log("**************LIST****************");
      /*        var users =  chat.userList();
        console.log(users,'processCommand');
    */
    }    
}
chat.start(processCommand);

function parseCommand(cmd){
  console.log("parsing command data"+cmd);
}

function logMessage(msg){
    var res=singleton.insert('messages',msg);
  }

module.exports = app;
