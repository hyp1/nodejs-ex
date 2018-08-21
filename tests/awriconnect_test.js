var AWRI=require("../public/app/awriconnect.js");
var express = require('express');
var app     = express();
var http = require('http').Server(app);

var chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

    app.use('/', express.static('public'), function (req, res) {
        //res.sendFile(express.static('public')+'index.html');
        //res.sendFile('index.html', { root: __dirname + '/public' });
    });
      
chai.use(chaiHTTP);
reqServer = process.env.HTTP_TEST_SERVER || http


describe('Basic routes tests', function() {

 

  it('GET to /index.html should return 200', function(done){
        chai.request(reqServer)
        .get('/index.html')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
        AWRI.setLogger(console.log);
awri=new AWRI("http://localhost/stage.awri.ch","connect");

    });
});