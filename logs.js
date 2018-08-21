
var express = require('express');
var morgan = require('morgan');
var router = express.Router();
var serveIndex = require('serve-index')
var singleton = require('./database');


var fs = require('fs')
var path = require('path')
var rfs = require('rotating-file-stream')
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
router.use(morgan('combined', {stream: accessLogStream}))

// setup render engine
router.use('html', require('ejs').renderFile);

/*
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
    next();
  });
*/
  // define the logs route
  router.get('/', function(req, res) {
    (async function(){ 
      var mcnt=await getCount('messages');  
      var cnt=await getCount('counts');
      res.render( __dirname + '/public/logs.html', { messages :mcnt,counts:cnt});
    })();
//      res.send('Hier gibt es leider nichts zu sehen! :-)');
    
  });

  router.use('/serverlogs', express.static('logs'), serveIndex('logs', {'icons': true}))

  // define the about route
  router.get('/about', function(req, res) {
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


router.get('/cleardb', function (req, res) {
  // try to initialize the db on every request if it's not already initialized.
   db=singleton.DbConnection;
  if (db) {
    db.then(function(db) {
  //  console.log('messages,counts droppend')
    db.collection('messages').drop();
    db.collection('counts').drop();    
    });
    res.send('messages,counts droppend');
  }else{
  res.send('no database');
  }
});

function getCount(collection){
  return new Promise(function(res,rej){
  db=singleton.DbConnection;
   db.then(function(db) {
    var col = db.collection(collection);
    col.count(function(err, count ){
      console.log(count,collection)
      res(count);
    });
  })
})
}

/*
exports.logMessage=function(msg){
  console.log("logMessage:"+msg);
  //console.log("logMessage:"+msg.time+' '+msg.msg);
  db=singleton.DbConnection; 
  db.then(function(db) {
    var col = db.collection('messages');
    col.insert({date:msg.time,msg:msg.msg});
    col.count(function(err, count){
      console.log('MSGCOUNT:'+count)
  });
});
}
*/

module.exports = router;
module.exports.accessLogStream=accessLogStream;
//module.exports.logMessage=logMessage;
