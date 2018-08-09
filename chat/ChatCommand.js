class ChatCommand {
    constructor(cmd=null,data=null) {
      this._cmd= cmd;
      this._data = data;
      this._log=console.log();
      this._time=Date.now();    
    }     
    get cmd() {
        return this._cmd;          
    }
    set cmd(cmd) {
        this._cmd = cmd;
    }
    get data() {
        return this._cmd;      
    
    }
    set data(data) {
        this._data = data;
    }
};

module.exports = {ChatCommand};
