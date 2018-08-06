const request = require('request')

const AGENT = 'AWRI-Bot/1.0';
const HOST = 'https://awri.ch';
const ENDPOINT = 'drupalgap';

class User {
    constructor(uid=0,username='Unbekannt') {
      this.uid= uid;
      this.username = username;  
      this._session= null;
      this._token = null;
    }    
};

class UFactory {

    static async show(nid) {
        return new Promise(function(resolve,reject){
              var options = {
                  url: 'https://awri.ch/drupalgap/node/'+nid+'.json',
                  headers: {
                      'User-Agent': AGENT,
                      'Content-Type': 'application/json',
                  },                            
                };
              request.get(options, function (error, r, body) {
                //console.log(r.statusCode)
                  if(r.statusCode===200){                     
                   var obj=JSON.parse(body)
                      resolve(obj)                    
                  }
                      else reject(r.statusCode)
                })
             
          })    
      }

      static async show(nid) {
        return new Promise(function(resolve,reject){
              var options = {
                  url: 'https://awri.ch/drupalgap/node/'+nid+'.json',
                  headers: {
                      'User-Agent': AGENT,
                      'Content-Type': 'application/json',
                  },                            
                };
              request.get(options, function (error, r, body) {
                //console.log(r.statusCode)
                  if(r.statusCode===200){                     
                   var obj=JSON.parse(body)
                      resolve(obj)                    
                  }
                      else reject(r.statusCode)
                })
             
          })    
      }

      static async comments(nid) {
        return new Promise(function(resolve,reject){
              var options = {
                  //https://awri.ch/?q=drupalgap/comment.json&parameters[nid]=18262&parameters[status]=1&pagesize=150
                  url: 'https://awri.ch/drupalgap/comment.json?parameters[nid]='+nid+'&parameters[status]=1&pagesize=150',
                  headers: {
                      'User-Agent': AGENT,
                      'Content-Type': 'application/json',
                  },                            
                };
              request.get(options, function (error, r, body) {
                //console.log(r.statusCode)
                  if(r.statusCode===200){                     
                   var obj=JSON.parse(body)
                      resolve(obj)                    
                  }
                      else reject(r.statusCode)
                })
             
          })    
      }

    static async search(txt) {
        console.log(txt);
        return new Promise(function(resolve,reject){
              var options = {
                  url: 'https://awri.ch/drupalgap/search_node/retrieve.json?keys='+txt,
                  headers: {
                      'User-Agent': AGENT,
                      'Content-Type': 'application/json',
              //        'X-CSRF-TOKEN': token,
              //        'Cookie': session           
                  },                            
                };
              request.get(options, function (error, r, body) {
                //console.log(r.statusCode)
                  if(r.statusCode===200){                     
                   var obj=JSON.parse(body)
                 //  console.log(obj.snippet)
                //   this._user=obj.user
                      resolve(obj)
                    
                  }
               //       else reject(r.statusCode)
                })
             
          }).catch(function(err){
              console.log('Fehler '+err)
          })      
      }
  


    static async connect(token,session) {
      return new Promise(function(resolve,reject){
            var options = {
                url: 'https://awri.ch/drupalgap/system/connect.json',
                headers: {
                    'User-Agent':  AGENT,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'Cookie': session           
                },                            
              };
            request.post(options, function (error, r, body) {
                if(r.statusCode===200){
                 var obj=JSON.parse(body);
                    resolve(obj.user);
                  
                }
             //       else reject(r.statusCode)
              })
           
        }).catch(function(err){
    
            console.log('Fehler '+err)

        })
    
    }

    static async login(username,password) {
//var p1   new Promise(function(resolve,reject){
    return new Promise(function(resolve,reject){
            var url='https://awri.ch/drupalgap/user/login.json'            
            var options = {
                url: url,
                username: username,
                password: password,
                headers: {
                  'User-Agent': AGENT,
                  'content-Type': 'application/json',
                },                            
              };
              var postData = {        
                    username: username,
                    password: password
                  }               
            request.post(options, function (error, response, body) {
                this._uid=0;
                this._username='Unbekannt';
            
                if(response.statusCode===200){
                  var obj=JSON.parse(body);
                  var user=new User(obj.user.uid,obj.user.name);
             //   var  user.uid=obj.user.uid;
              //  var  user.username=obj.user.name

                    user._token=obj.token,
                    user._session=obj.session_name+'='+obj.sessid;

                   // this._uid=obj.user.uid;
                   // this._username=obj.user.name;
                   // this._token=obj.token;
                   // this._session=obj.session_name+'='+obj.sessid; 
                    resolve(user);               
                } else console.error(response.statusCode,'ERROR')           
                   // reject(response.statusCode);

              }).form(postData);     

            }).catch(function(e){
                console.log('LOGIN ERROR:'+e); 
            })
//        return new User(await  p1);
    }
  }//UFavtory
  
  module.exports={UFactory,User}