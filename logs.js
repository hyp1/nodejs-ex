var express = require('express');
var morgan = require('morgan');
var router = express.Router();
var serveIndex = require('serve-index')
var singleton = require('./database');

var fs = require('fs')
//var morgan = require('morgan')
var path = require('path')
 
var exp=require('./server');

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
var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), {flags: 'a'})
 
// setup the logger
Object.assign = require('object-assign');
//router.use(morgan('combined', {stream: accessLogStream}))
app.use(morgan('combined', {stream: accessLogStream}))



router.use('/serverlogs', express.static('logs'), serveIndex('logs', {'icons': true}))

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
 // console.log("openDB"); 
 // console.log('Time: ', Date.now());
  //console.log(process.env.WEBLOG,"WEBLOG");
  //console.log(DBLOG,"DBLOG");
  
    next();
  });
  // define the home page route
  router.get('/', function(req, res) {
      res.send('Hier gibt es leider nichts zu sehen! :-)');
    
  });
  // define the about route
  router.get('/about', function(req, res) {
  console.log(req.query.tagId);
    //  serverLog('About Chat Server called');
    res.send('About Chat Server');
  });

router.get('/messages', function (req, res) {
    // try to initialize the db on every request if it's not already initialized.
    db=singleton.DbConnection;
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
  db=singleton.DbConnection;
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

router.get('/stats', function (req, res) {
  db=singleton.DbConnection;
if (db) {
db.then(function(db) {
  var col = db.collection('messages');
  // Create a document with request IP and current time of request
var msgcnt,hitcnt=0;
col.count(function(err, count){
   msgcnt=count;
   console.log(count);
});
col2 = db.collection('counts');
col2.count(function(err, count){
 hitcnt=count;
 console.log(hitcnt);
});
res.json({messages:msgcnt,hits:hitcnt});

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

module.exports = function(app, db, conf){
  return function performTest() {
    var test = require('./server')(app, db, conf);
    test();
  }
}
module.exports = router;