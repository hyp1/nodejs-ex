class ChatUser {
  constructor(uid=0,name='Unbekannt') {
    this._uid = uid;
    this._time = Date.now();
    this._name = name;
    this._picture ='img/anonymous.png';  
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

module.exports = {ChatUser};