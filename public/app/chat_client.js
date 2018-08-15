class ChatClient{

    constructor(protocol,host,port,ns='/'){
    this._host=host;
    this._protocol=protocol;
    this._port=port;
    this._ns=ns;
    this._socket;
    //someElement.addEventListener('click', () => { this.myMethod(); /* 'this' refers to the instance! */ })   
    }
    
    connected(){
        return this._socket.connected;
    }

    connect(){
        var user = variable_get('user');
        this.connect(user);
    }    

    connect(user){
    
    if(this._protocol&&this._host&&this._port&&this._ns){
        console.info(this._protocol + '//' + this._host + ':'+this._port+this._ns,'CHAT SERVER URL')
        this._socket=io.connect(this._protocol&&this._host + ':'+this._port+this._ns);
    }
    if(this._protocol&&this._host&&this._port&&this._ns){
        console.info(this._protocol + '//' + this._host + ':'+this._port,'CHAT SERVER URL')
        this._socket=io.connect(this._protocol&&this._host + ':'+this._port);
    } else 
    if(this._protocol&&this._host){
        console.info(this._protocol + '//' + this._host,'CHAT SERVER URL')
        this._socket=io.connect(this._protocol&&this._host);
    }
    else{
        console.info('CHAT SERVER NO URL AUTODISCOVERY')
        this._socket=io.connect();
    }  
    this._socket.emit('connection name',user);      
    
        this._socket.on('connect name', function (question, callback) {
              //  var user = variable_get('user');
                var answer = "", cnt = 0;
                do {
                    if (cnt > 2) { alert("Tschüss! :-)"); return false; };
                    answer = prompt(question);
                    cnt++;
                } while (answer == "")
                user.name = answer;
              //  variable_set('user', user);
                return callback(user);            
        });
        this._socket.on('connected', function (user) {
                    if(typeof onchatconnected === 'function')onchatconnected(user);  
            })
                            
            this._socket.on('command data', function (cmd) {
                    if(typeof onchatcommand === 'function')onchatcommand(cmd);
                    if (cmd._cmd == 'userlist') if(typeof onchatuserlist === 'function')onchatuserlist(cmd._data);
                    if (cmd._cmd == 'message') if(typeof onchatmessage === 'function')onchatmessage(cmd._data);
                    if (cmd._cmd == 'private message') if(typeof onchatmessage === 'function'){
                        cmd._data._from.name+=' an dich'
                        //alert(cmd._data._from.name);                    
                        onchatmessage(cmd._data);
                    }
                });

            this._socket.on('error', function (error) {
                    alert(error);
            })     
    }
    
    sendMessage(msg){
        //msg.setFrom(variable_get('user')._uid);
        var cmd=new ChatCommand('message',msg);
        this._socket.emit('command',cmd)
    }
    
    sendPrivateMessage(to,msg){
        msg.setTo(to);
        msg.setFrom(variable_get('user')._uid);
        var cmd=new ChatCommand('private message',msg);
        this._socket.emit('command',cmd)
    }
    
    sendCommand(cmd){
        this._socket.emit('command',cmd)
    }
    
    userList(){
        var cmd=new ChatCommand('userlist');
        this._socket.emit('command',cmd)
    }
      
    disconnect(){
        this._socket.close();
    }

}//class
    
    
class ChatMessage {
    constructor(from = null, txt = "") {
        this._time = Date.now();
        this._from = from;
        this._to = 0;
        this._type = 0;
        this._txt = txt;
        this._color = '#333';
    }
    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
    }

    set type(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }
    set txt(txt) {
        this._txt = txt;
    }
    get txt() {
        return this._txt;
    }
    set params(params) {
        this._params = params;
    }
    get params() {
        return this._params;
    }

    set from(from) {
        this._from = from;
    }
    get from() {
        return this._from;
    }

    set to(to) {
        this._to = to;
    }
    get to() {
        return this._to;
    }
    setFrom(from) {
        this._from = from;
    };

    getFrom() {
        return this._from;
    };

    setTo(to) {
        this._to = to;
    };

    getFrom() {
        return this.to;
    };

    setType(type) {
        this._type = type
    };

    getType() {
        return this._type;
    };

    setColor(color) {
        this._color = color;
    };

    getColor() {
        return this._color;
    };

    setText(txt) {
        this._txt = txt;
    };

    getText() {
        return this._txt;
    };

    setParam(params) {
        this._params = params;
    };

    getParam() {
        return this._params;
    };
};
    

class ChatCommand {
    constructor(cmd = null, data = null) {
        this._cmd = cmd;
        this._data = data;
        this._time = Date.now();
    };
    get cmd() {
        return this._cmd;
    };
    set cmd(cmd) {
        this._cmd = cmd;
    };
    get data() {
        return this._cmd;
    };
    set data(data) {
        this._data = data;
    };
    getCmd() {
        return this._cmd;
    };
    getData() {
        return this._data;
    };
};
    
class ChatUser {
    constructor(uid=0,name='Unbekannt') {
      var rand=''+ Date.now();
      rand=rand.substr(7,rand.length);
      this._uid = (uid ==0) ? rand:uid;
      this._time = Date.now();
      this._name = (name == 'Unbekannt')?'User'+rand:name;
      this._picture ='app/anonymous2.png';  
      this._roles={'1':'anonymous user'}
      this._email = null;
      this._fbid = null;
      this._session= null;
      this._token = null;
      this._sid = null;
    }    
    get sid(){
      return this._sid;
    };
    
    set sid(sid){
       this._sid=sid;
    };
    
    get uid(){
      return this._uid;
    };
  
    set uid(uid){
     this._uid=uid;
    };
  
    get fbid(){
      return this._fbid;
    };
  
    set fbid(fbid){
     this._fbid=fbid;
    };
  
    get email(){
      return this._email;
    };
  
    set uid(email){
      this._email=email;
    };
  
    get name(){
      return this._name;
    };
  
    set name(name){
      this._name=name;
    };
  
    get picture(){
      return this._picture;
    };
  
    set picture(picture){
      this._picture=picture;
    };
  
    setName(name){
      this._name=name;
    }
  };
  