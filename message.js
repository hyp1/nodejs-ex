'use strict';

class Message {
    constructor() {
      this.type = 0
      this.time = Date.now()
    } 
    
    get time() {
        return this._time;      
    
    }
    set time(time) {
        this._time= time
    }           

    set name(name) {
      this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    get name() {
      return this._name;
    }
    set type(type) {
        this._type = type;
      }
      get type() {
        return this._type;
      }
      set msg(msg) {
        this._msg = msg;
      }
      get msg() {
        return this._msg;
      }
      set params(params) {
        this._params = params;
      }
      get params() {
        return this._params;
      }

    print() {
      console.log(this.id+', ' + this.name + ', : ' + this.id);
    }


    setType(type) {
        this.type = type
     }; 
    
    setName(name) {
        this.name = name.charAt(0).toUpperCase() + name.slice(1)
    };
      
    setMsg(msg) {
        this.msg = msg;
    };
    
    setParams(params) {
        this.params = params;
    };
    
    print() {
        console.log('debug Message:\time:'+ this.time+'\nid:'+ this.id+'\ntype:'+ + this.name+'\nmsg:'+ + this.msg+'\nparams:'+ + this.params + '' );
      };

}
  

  
  class LogMessage extends Message {
    constructor(socket,msg) {
          super()
      this.id = 'id_0'
      this.ip = socket.handshake.address
      this.sid = socket.id
      this.msg=msg
    }

    set sid(sid) {
      this._sid = sid
    }
 
    get sid() {
      return this._sid;      
    }
     
    set ip(ip) {
        this._ip = ip
    }
 
    get ip() {
        return this._ip;
    }
}

module.exports = {Message,LogMessage}