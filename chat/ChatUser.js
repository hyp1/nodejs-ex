class ChatUser {
  constructor(uid=0,name='Unbekannt') {
    var rand=''+ Date.now();
    rand=rand.substr(7,rand.length);
    this.uid = (uid ==0) ? rand:uid;
    this.name = (name == 'Unbekannt')?'User'+rand:name;
    this.picture ='app/anonymous2.png';  
    this._roles=['anonymous user']
    this._session= null;
    this._token = null;
    this._sid = null;
  }    

get uid(){
  return this._uid;
};

set uid(uid){
   this._uid=uid;
};

get name(){
  return this._name;
};

set name(name){
  this._name=name;
};

};

module.exports = {ChatUser};