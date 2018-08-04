var express = require('express');
var router = express.Router();
var singleton = require('./database');
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
//    db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
      col.insert({ip: req.ip, date: Date.now()});
      })

      res.send('Chat Server Log Page');
    }else{
      res.send('Fehler,');
    }
    console.log("closeDB"); 
  });
  // define the about route
  router.get('/about', function(req, res) {
    var app=  require('./server');
    app.dataLog('Hurra :-)');
  //  serverLog('About Chat Server called');
    res.send('About Chat Server');
  });


router.get('/count', function (req, res) {
    // try to initialize the db on every request if it's not already initialized.
//    db=singleton.DbConnection;
    if (db) {
    db.then(function(db) {
      db.collection('messages').find({}).toArray(function(err, resultArray){
        res.json( resultArray );  
        });
    });
  }else{
    res.send('{ pageCount: -1 }');
  }
});
  
router.get('/list', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
   
db=singleton.DbConnection;

if (db) {
db.then(function(db) {
  db.collection('counts').find({}).toArray(function(err, resultArray){
    res.json( resultArray );  
    console.log( resultArray );  
    });
});
} else {
  res.send('[]');
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