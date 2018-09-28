/**
 *  class ChatUser
 *  class ChatCommand
 *  class ChatMessage
 *  class LogMessage extends Chatmessage
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatClient = function () {
    function ChatClient(protocol, host, port) {
        var ns = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';

        _classCallCheck(this, ChatClient);

        this._host = host;
        this._protocol = protocol;
        this._port = port;
        this._ns = ns;
        this._socket;
        //someElement.addEventListener('click', () => { this.myMethod(); /* 'this' refers to the instance! */ })   
    }

    _createClass(ChatClient, [{
        key: 'connected',
        value: function connected() {
            return this._socket.connected;
        }
    }, {
        key: 'connect',
        value: function connect() {
            var user = new ChatUser();
            this.connect(user);
        }
    }, {
        key: 'connect',
        value: function connect(user) {

            if (this._protocol && this._host && this._port && this._ns) {
                console.info(this._protocol + '//' + this._host + ':' + this._port + this._ns, 'CHAT SERVER URL');
                this._socket = io.connect(this._protocol && this._host + ':' + this._port + this._ns);
            }
            if (this._protocol && this._host && this._port && this._ns) {
                console.info(this._protocol + '//' + this._host + ':' + this._port, 'CHAT SERVER URL');
                this._socket = io.connect(this._protocol && this._host + ':' + this._port);
            } else if (this._protocol && this._host) {
                console.info(this._protocol + '//' + this._host, 'CHAT SERVER URL');
                this._socket = io.connect(this._protocol && this._host);
            } else {
                console.info('CHAT SERVER NO URL AUTODISCOVERY');
                this._socket = io.connect();
            }

            this._socket.emit('connection name', user);

            //anonymus user connected server asks for username
            this._socket.on('connect name', function (question, callback) {
                //Async Dialog Promise
                showDialog(question).then(function (answer) {
                    user.name = answer;
                    return callback(user);
                }).catch(function (err) {
                    alert(err);
                });
            });

            this._socket.on('connected', function (user) {
                if (typeof onchatconnected === 'function') onchatconnected(user);
            });

            this._socket.on('command data', function (cmd) {
                console.log(cmd);
                if (cmd._cmd == 'error') onchatmessage(cmd._data);
                if (typeof onchatcommand === 'function') onchatcommand(cmd);
                if (cmd._cmd == 'userlist') if (typeof onchatuserlist === 'function') onchatuserlist(cmd._data);
                if (cmd._cmd == 'message') if (typeof onchatmessage === 'function') onchatmessage(cmd._data);
                if (cmd._cmd == 'private message') if (typeof onchatmessage === 'function') {
                    if ($("#user").attr('uid') == cmd._data._from.uid) cmd._data._from.name = "Du";
                    if ($("#user").attr('uid') == cmd._data._to.uid) cmd._data._from.name += ' an dich';else cmd._data._from.name += ' an ' + cmd._data._to.name;
                    //alert(cmd._data._from.name);                    
                    onchatmessage(cmd._data);
                }
            });

            this._socket.on('error', function (error) {
                if (typeof onchaterror === 'function') onchaterror(error);
                console.error(error);
            });
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(msg) {
            //msg.setFrom(variable_get('user')._uid);
            var cmd = new ChatCommand('message', msg);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendPrivateMessage',
        value: function sendPrivateMessage(to, msg) {
            msg.setTo(to);
            msg.setFrom(variable_get('user')._uid);
            var cmd = new ChatCommand('private message', msg);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendPrivateCommand',
        value: function sendPrivateCommand(to, msg) {
            msg.setTo(to);
            msg.setFrom(variable_get('user')._uid);
            var cmd = new ChatCommand('private command', msg);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendKick',
        value: function sendKick(to) {
            //msg=new ChatMessage()
            //msg.setTo(to);
            //msg.setFrom($("#user").attr("uid"));
            var cmd = new ChatCommand('kick', to);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendBan',
        value: function sendBan(to) {
            var cmd = new ChatCommand('ban', to);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendCommand',
        value: function sendCommand(cmd) {
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'sendCommand',
        value: function sendCommand(cmd, data) {
            var cmd = new ChatCommand(cmd, data);
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'userList',
        value: function userList() {
            var cmd = new ChatCommand('userlist');
            this._socket.emit('command', cmd);
        }
    }, {
        key: 'disconnect',
        value: function disconnect() {
            this._socket.close();
        }
    }]);

    return ChatClient;
}(); //class