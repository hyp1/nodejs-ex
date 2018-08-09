'use strict';

class ChatMessage {
  constructor() {
      this._type    = 0;
      this._time    = Date.now();
      this._from     = "Unbekannt";
  }
  get color() {
    return this._color;
  }

  set color(color) {
        this._color= color;
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
   setFrom(from) {
         this._from = from;
    }; 

    getFrom() {
        return this._from;
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
  
}
   
class LogMessage extends ChatMessage {
    constructor(ip,msg) {
          super()
          this.ip = ip;
          this.msg=msg
    }
    set msg(msg) {
      this._msg = msg
    }
    get msg() {
      return this._msg;      
    }     
    set ip(ip) {
        this._ip = ip
    }
    get ip() {
        return this._ip;
    }
}
module.exports = {ChatMessage,LogMessage}