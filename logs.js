var express = require('express');
var router = express.Router();
var singleton = require('./database');

var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
 

var rfs = require('rotating-file-stream')
var app = express()
var logDirectory = path.join(__dirname, 'logs')
 // ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
 
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
 
// setup the logger
router.use(morgan('combined', {stream: accessLogStream}))

console.log(app.ACCESSLOG,"ACCESSLOG");

var db=singleton.DbConnection; 

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
 // console.log("openDB"); 
  console.log('Time: ', Date.now());
    next();
 //   console.log("closeDB"); 
  });
  // define the home page route
  router.get('/', function(req, res) {
    db=singleton.DbConnection;

    if (db) {
    db.then(function(db) {
    var col = db.collection('counts');
    var line={ip: req.ip, date: Date.now()};
      col.insert(line);
   var appLog=require('./server');
    appLog.serverLog(line);
      })

      res.send('Added Log Message'+{ip: req.ip, date: Date.now()});
    }else{
      res.send('Fehler,');
    }
    console.log("closeDB"); 
  });
  // define the about route
  router.get('/about', function(req, res) {
 
  //  serverLog('About Chat Server called');
    res.send('About Chat Server');
  });

router.get('/messages', function (req, res) {
    // try to initialize the db on every request if it's not already initialized.
//    db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
      db.collection('messages').find({}).toArray(function(err, resultArray){
        res.json( resultArray );  
        });
    });
  }else{
    res.send('no database');
  }
});
  
router.get('/counts', function (req, res) {
   
if (db) {
db.then(function(db) {
  db.collection('counts').find({}).toArray(function(err, resultArray){
    res.json( resultArray );  
    console.log( resultArray );  
    });
});
} else {
  res.send('no database');
}

});

router.get('/cleardb', function (req, res) {
  // try to initialize the db on every request if it's not already initialized.
   db=singleton.DbConnection;
  if (db) {
    db.then(function(db) {
  //  console.log('messages,counts droppend')
    db.collection('messages').remove();
    db.collection('counts').remove();    
    });
    res.send('messages,counts droppend');
  }else{
  res.send('no database');
  }
});

router.get('/messages', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  db=singleton.DbConnection;
  if (db) {
    db.then(function(db) {
      db.collection('messages').find({}).toArray(function(err, resultArray){
        res.json( resultArray );  
        console.log( resultArray );  
        });
    });
    } else {
      res.send('[]');
    }
});


exports.logMessage=function(msg){
  console.log("logMessage:"+msg);
  //console.log("logMessage:"+msg.time+' '+msg.msg);
  /*
  db=singleton.DbConnection;
 
  db.then(function(db) {
    var col = db.collection('messages');
    // Create a document with request IP and current time of request
    col.insert({date:msg.time,msg:msg.msg});
    col.count(function(err, count){
      console.log('MSGCOUNT:'+count)
  });

});
*/
}


module.exports = router;