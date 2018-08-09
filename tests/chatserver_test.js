require("../server");

var express = require('express');
var app     = express();
var server = require('http').Server(app);

var chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

      
chai.use(chaiHTTP);
reqServer = process.env.HTTP_TEST_SERVER || server


var io = require('socket.io-client');
var socketURL = 'http://localhost:8080';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'uid':'1','name':'Tom'};
var chatUser2 = {'uid':'1','name':'Sally'};
var chatUser3 = {'uid':'1','name':'Dana'};


describe("Websockets Chat Server Tests",function(){

    it('should be able to connect  "'+socketURL+'" should be true', function(done){
      var chat = io.connect(socketURL,options);
      chat.on('connect', function(){
      chat.connected.should.equal(true);
      chat.disconnect();
      done();

      });          
    });

    it('should be able to send connection name  "'+socketURL+'"', function(done){
      var chat = io.connect(socketURL,options);
      chat.on('connect', function(){
      chat.connected.should.equal(true);
      chat.disconnect();
      done();
      });          
    });


    it('Should be able to broadcast messages', function(done){
        var client1, client2, client3;
        var message = 'Hello World';
        var messages = 0;
        var completeTest = function(){
           messages.should.equal(0);
           client1.disconnect();
           client2.disconnect();
           client3.disconnect();
           done();
           server.disconnect()
         };
       
        var checkMessage = function(client){      
          client.on('message', function(msg){
            console.log('message',msg);
            message.should.equal(msg._msg);
            client.disconnect();
            messages++;
            if(client === client1){
              setTimeout(completeTest, 40);
            };/*
            if(messages === 3){
              chat.disconnect();
              done();
            };
            */
          });
        };

        var chat = io.connect(socketURL,options);
        chat.on('connect', function(){
            chat.emit('connection name test');        
            chat.on('message', function(msg){
            console.log(msg)
            })
        })
        chat.disconnect();
        done();    
    }); 

});
  
  /*
   
      it('Should be able to send private messages', function(done){
        var client1, client2, client3;
        var message = {to: chatUser1.name, txt:'Tome conected'};
        var messages = 0;
      
        var completeTest = function(){
         // messages.should.equal(0);
          client1.disconnect();
          client2.disconnect();
         // client3.disconnect();
          done();
        };
      
        var checkPrivateMessage = function(client){
          client.on('private message', function(msg){
            console.log(msg);            
            message.txt.should.equal(msg._msg);
            msg.from.should.equal(chatUser1.name);
            messages++;
            console.log(messages)
            if(client === client1){
              setTimeout(completeTest, 40);
            };
          });
        };
      
        client1 = io.connect(socketURL, options);
        checkPrivateMessage(client1);
        client1.on('connect', function(data){
          client1.emit('connection na me', chatUser1);
          client2 = io.connect(socketURL, options);
          checkPrivateMessage(client2);
          client2.on('connect', function(data){
            client2.emit('connection name', chatUser2);
            client3 = io.connect(socketURL, options);
            checkPrivateMessage(client3);      
              client3.on('connect', function(data){
              client3.emit('connection name', chatUser3);
              client3.emit('private message', message)
            });
          });
        });   
      });
*/

