var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('GET to / should return 200', function(done){
        chai.request(reqServer)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })
    })

})




var io = require('socket.io-client');

var socketURL = 'http://'+ip+':'+port;

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'uid':'1','name':'Tom'};
var chatUser2 = {'uid':'1','name':'Sally'};
var chatUser3 = {'uid':'1','name':'Dana'};


describe("Websockets Chat Server",function(){

    it('Should be able to broadcast messages', function(done){
        var client1, client2, client3;
        var message = 'Hello World';
        var messages = 0;
      
        var checkMessage = function(client){
          console.log('message',client);
          client.on('message', function(msg){
            message.should.equal(msg._msg);
            client.disconnect();
            messages++;
            if(messages === 3){
              done();
            };
          });
        };
      
        client1 = io.connect(socketURL, options);
        checkMessage(client1);
      
        client1.on('connect', function(data){
          client2 = io.connect(socketURL, options);
          checkMessage(client2);
      
          client2.on('connect', function(data){
            client3 = io.connect(socketURL, options);
            checkMessage(client3);
      
            client3.on('connect', function(data){
              client2.send(message);
            });
          });
        });
        done();
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
});