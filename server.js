//  OpenShift sample Node application
var ACCESSLOG = true;
var DBLOG = true;

var express = require('express'),
  app = express(),
  morgan = require('morgan');

var instance = require('./database');
var logs = require('./logs');


Object.assign = require('object-assign');
//app.engine('html', require('ejs').renderFile); //console log modules unten!

//if (ACCESSLOG) app.use(morgan('combined'));

app.use('/logs', logs);

app.use('/', express.static('public'), function (req, res) {
  //console.log(req.headers);
  //res.sendFile(express.static('public')+'index.html');
  res.sendFile('index.html', { root: __dirname + '/public' });
});

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
console.log(mongoURL, 'MONGO');
//console.log(process.env, 'MONGO VORHER');


var db = null;
function initDB() {
  instance.setup(mongoURL);
  db = instance.DbConnection;
  if (!db) console.error('Keine Datenbank!')
  //db.then(function(db) {
  // db.collection('counts').find({}).toArray(function(err, resultArray){console.log(resultArray)});
  //});
}


//app.listen(port, ip);
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(port, ip, function (req, res) {
  console.log('listening on *:' + port);
  console.log(process.env.MONGO_TEST,"MT")
});

console.log('Server running on http://%s:%s', ip, port);


sayHelloInSpanish = function () {
  return "Hola";
};

exports=function (app) {
  return function performTest() {
    var test = require('./file1')(app, db, conf);
    test();
  }
}

initDB();

var clients = {};
logs=[];

io.on('connection', function(socket){
  console.log('connection:' + socket);

  socket.on('connection name',function(user){
    console.log('ip:'+socket.handshake.address);
    userName = user.name;
    clients[user.name] = socket;
    console.log('clients['+user.name+']');
    io.sockets.emit('new user', user.name + " has joined.");

  });

  socket.on('message', function(msg){
    console.log(msg);
    var d = new Date();
    var n = d.getTime();
    var message = {time:n,msg:msg};
    io.emit('message', message);
  });  


  socket.on('private message', function(msg){
    io.emit('chat message', msg);
    console.log('chat message:' + msg);
  });

  socket.on('private message', function(msg){
    console.log(msg);
    var d = new Date();
    var n = d.getTime();
    fromMsg = {from:userName, txt:msg.txt,time:n,tag:'*'}
   // no client clients[NAME]);
    if(clients[msg.to]!=undefined)clients[msg.to].emit('private message', fromMsg);
    else    console.log("no recipient");
    console.log(fromMsg);
  });

  socket.on('disconnect', function(){
    var d = new Date();
    var n = d.getTime();
    var message = {time:n,msg:userName+ " has disconnected."};
    console.log('disconnected '+userName);
    io.sockets.emit('message',  message);
    delete clients[userName];

  });

});

module.exports = app; //express
//console.log(module);