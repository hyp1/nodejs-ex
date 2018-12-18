"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AWRI = function () {
    function AWRI(host, endpoint) {
        _classCallCheck(this, AWRI);

        this.host = host;
        this.endpoint = endpoint;
        this._uid = null;
        this._name = null;
        this._token = null;
        this._session = null;
        console.log('AWRI constructed:' + host + endpoint);
    }

    _createClass(AWRI, [{
        key: "connect",
        value: function connect() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/system/connect.json", false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                        var response = JSON.parse(xmlhttp.responseText);
                        var user = response.user;
                        awri._session = response.session_name + "_" + response.sessid;
                        resolve(user);
                        if (typeof awriconnect_user_connected == 'function') awriconnect_user_connected(user);
                    }
                    if (xmlhttp.status == 404) return reject( new AWRIError(xmlhttp.status+' Nicht gefunden.'));
                    if (xmlhttp.status != 200) return reject(new AWRIError(xmlhttp.status + ' Fehler connect.'));
                };
                xmlhttp.send();
            });
        }
    }, {
        key: "token",
        value: function token() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/services/session/token", false);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                        awri._token = xmlhttp.responseText;
                        //AWRI.log('connect:'+awri._token);
                        console.log(awri._token);

                        resolve(awri._token);
                    }

                    if (xmlhttp.status != 200) reject(new AWRIError(xmlhttp.status + ' Fehler in connect.'));
                };
                xmlhttp.send(null);
            });
        }        
    },{  //Func
        key: "awriconnect_load_user",
        value: function  awriconnect_load_user(uid) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/user/" + uid + ".json", true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var res = xmlhttp.responseText;            
                    var err=new AWRIError(xmlhttp.status+' User '+uid+' nicht gefunden.');
                     
                    if(xmlhttp.status == 200 ){
                        var user=JSON.parse(res);
                        if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_load_user',user);                                                                                  
                        resolve(user);
                    }else
                    if(xmlhttp.status == 404){
                        reject(new AWRIError(xmlhttp.status+' User '+uid+' nicht gefunden.'));

                    } else
                    return  new AWRIError(xmlhttp.status+' unbekannter Fehler.');    
                    }
                    
                };
                xmlhttp.send(null);
            });
        } //Func

    }, { //Func
        key: "awriconnect_search_node",
        value: function awriconnect_search_node(txt) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/search_node/retrieve.json?keys="+txt+'&parameters[status]=1', true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText);                                                           
                     if (xmlhttp.status == 200){
                        if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_search_node',result);                                                                                     
                         resolve(result);
                     }
                    if (xmlhttp.status == 404) reject( new AWRIError('Nichts gefunden auf:'+txt));
                    if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_search_node'));
                    }//readyState = 4
                };
                xmlhttp.send(null);
            });        
        } //Func

    }, { //Func
        key: "awriconnect_search_user",
        value: function awriconnect_search_user(txt) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/search_user/retrieve.json?keys="+txt, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText);                                                           
                     if (xmlhttp.status == 200){
                        if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_search_user',result);                                                                                     
                         resolve(result);
                     }
                    if (xmlhttp.status == 404) reject( new AWRIError('Nichts gefunden auf:'+txt));
                    if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_search_user'));
                    }//readyState = 4
                };
                xmlhttp.send(null);
            });        
        } //Func
    
    }, { //Func
        key: "awriconnect_load_node",
        value: function awriconnect_load_node(nid) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/node/"+nid+".json", true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText);  
                                                               
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_load_node',result);                                                                   
                            resolve(result);
                        } else reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_load_node'));
                    }    
                };
                xmlhttp.send(null);
            });
        } //Func

    }, { //Func
        key: "awriconnect_comments",
        value: function awriconnect_comments(nid) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/comment.json?parameters[nid]="+nid+"&parameters[status]=1&pagesize=150", false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                        
                        var result= JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){  
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_comments',result);                                                                   
                           return resolve(result);
                            } else
                           return reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_comments'));
                        }
                    }                
                xmlhttp.send(null);
            });
        } //Func

  

    }, { //Func
        key: "awriconnect_is_bookmark",
        value: function awriconnect_is_bookmark(flag_name,nid) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                var data={
                    "flag_name":flag_name,
                    "entity_id":nid,
                //    "uid":3
                }
                xmlhttp.open("POST", awri.host +"/"+awri.endpoint +"/flag/is_flagged.json", false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText); 
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_is_bookmark',result);                                                                   
                          return  resolve(result);
                        }
                        else  return reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_is_bookmark'));
                    };
                };
                xmlhttp.send(JSON.stringify(data));
            });
        } //Func

    }, { //Func
        key: "awriconnect_bookmarks",
        value: function awriconnect_bookmarks(uid,page) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                if(!page||page=='undefined')page=0;
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("GET", awri.host + "/user/bookmarks/"+uid+"?page="+page, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText); 
                        if(xmlhttp.status == 200){
                        if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_bookmarks',result);                                                                   
                         resolve(result);
                        }
                        else reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_bookmarks'));
                    }
                };
                xmlhttp.send(null);
            });
        } //Func

    }, { //Func
        key: "awriconnect_bookmark_action",
        value: function awriconnect_bookmark_action(name,nid,action) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                var postData={
                    flag_name:name,
                    entity_id:nid,
                    uid:uid,
                    action:action,
                    skip_permission_check:true
                }

                xmlhttp.open("POST", awri.host +"/"+awri.endpoint +"/flag/flag.json", true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var result= JSON.parse(xmlhttp.responseText); 
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_bookmark_action',result);                                                                   
                            resolve(result);
                            }
                            else 
                            reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_bookmark_action'));
                        }
                    };
                xmlhttp.send(JSON.stringify(postData));
            });
        }//func

    }, { //Func
        key: "awriconnect_login",
        value: function awriconnect_login(username,password) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                var postData = {        
                    username: username,
                    password: password
                  }   
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/login.json",true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);             
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var response = xmlhttp.responseText;          
                        if(xmlhttp.status == 200){
                            var obj = JSON.parse(response);                        
                            var user=obj.user;
                            awri._session=obj.session_name + '_' + obj.sessid;
                            awri._token=obj.token;
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_login',user);                                                                                 
                            resolve(awri.awriconnect_load_user(user.uid));
                        }                                                           
                        if (xmlhttp.status == 401) reject( new AWRIError('Sie sind schon eingeloggt','awriconnect_login'));            
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_login'));
                    };
                };  
                xmlhttp.send(JSON.stringify(postData));
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('login',err);
            });
        }//func

    }, { //Func
        key: "awriconnect_logout",
        value: function awriconnect_logout() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();                  
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/logout.json",true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");                
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var response = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){ 
                        if(typeof awriconnect_data == 'function')awriconnect_data('logout',response[0]);                                                                   
                         resolve(response[0]);
                        } 
                        if (xmlhttp.status == 406) reject( new AWRIError('Sie sind nicht eingeloggt!','awriconnect_logout'));
                        if (xmlhttp.status == 0)  reject( new AWRIError('Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status));    
                    }
                };  
                xmlhttp.send(null);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('logout',err);
            });      
        }//func

    }, { //Func
        key: "awriconnect_register",
        value: function awriconnect_register(username,password,mail,mail_conf)  {
            return new Promise(function (resolve, reject) {
                if(mail!==mail_conf) reject( new AWRIError('Die Email Adressen müssen überein stimmen.'));
                var xmlhttp = new XMLHttpRequest();
                var postData = {        
                    name: username,
                    pass: password,
                    mail:mail,
                    status:1
                  };

                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;
                xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/register.json",true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);                      
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        var response = xmlhttp.responseText;
                        if(xmlhttp.status == 200){
                        var obj = JSON.parse(response);                        
                        user.uid=obj.uid;
                        user.link=obj.uri;
                        if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_register',user);                                                                                     
                         resolve(awri.awriconnect_load_user(user.uid));
                        }                                          
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_register'));
                        if (xmlhttp.status != 406) reject( new AWRIError(xmlhttp.status+' Fehler. Bitte alle erforderlichen Felder ausfüllen','awriconnect_register'));    
                    };                      
                };  
                xmlhttp.send(JSON.stringify(postData));
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_register',err);
            });      
        }//func

    }, { //Func
        key: "awriconnect_dummy",
        value: function awriconnect_dummy() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_connect/dummy", AWRI.async());

                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                  var data = xmlhttp.responseText;
                        if(xmlhttp.status == 200){  
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_dummy',data);                                                                                  
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));    
                    }
                };
                xmlhttp.send(null);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });      
        }//func
    }, { //Func
        key: "awriconnect_frage_get",
        value: function awriconnect_frage_get(nid) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/awri_fragen/"+nid+".json", false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){ 
                            if(data[0]==false) reject(new AWRIError('Der Beitrag wurde nicht gefunden.')); 
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_frage_get',data);                                                                                  
                            return resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_frage_get.'));                    
                    }
                };
                xmlhttp.send(null);
            });
        } //Func
    
    }, { //Func
        key: "awriconnect_fragen_index",
        value: function awriconnect_fragen_index(page,fields,parameters,page_size,options) {
            var query="?page="+page;
            if(!page||page=='undefined')page=0;
            if(!options||options=='undefined')options="options[orderby][created]=desc"; 
            if(fields&&fields!="")query+="&fields="+fields;
            if(parameters&&parameters!="")query+="&"+parameters;
            if(page_size&&page_size!="")query+="&pagesize="+page_size;
            return new Promise(function (resolve, reject) { 
                console.log( awri.host + "/"+awri.endpoint+"/awri_fragen"+query+"&"+options)
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/awri_fragen"+query+"&"+options, false);
                //xmlhttp.overrideMimeType('application/xml;');
                xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_fragen_index',data);                                                                   
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0)  reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_fragen_index.'));
                    }
                };
             
               xmlhttp.send(null);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_fragen_index',err);   
            });
        }// Func

    }, { //Func
        key: "awriconnect_frage_update",
        value: function awriconnect_frage_update(nid,data) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("PUT", awri.host + "/"+awri.endpoint+"/awri_fragen/"+nid+"", true);
    
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_frage_update',data);                                                                               
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0)  reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));                        
                    }
                };
                xmlhttp.send(JSON.stringify(data));
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        }//func

    }, { //Func
        key: "awriconnect_frage_create",
        value: function awriconnect_frage_create(data) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_fragen", true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_frage_create',data);                                                                               
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0)  reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));    
                    }
                };      
                xmlhttp.send(data);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        }//func

    }, { //Func
        key: "awriconnect_taxonomy_vocabulary",
        value: function awriconnect_taxonomy_vocabulary(vid,fields) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/taxonomy_vocabulary?parameters[vid]="+vid+'&fields='+fields, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_taxonomy_index',data);                                                                   
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));    
                    }
                };
                xmlhttp.send(null);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        }//func

    }, { //Func
        key: "awriconnect_taxonomy_term",
        value: function awriconnect_taxonomy_term(page,fields,parameters,page_size,options) {
            var query="?page="+page; 
            if(!page||page=='undefined')page=0;
            if(!options||options=='undefined')options="options[orderby][created]=desc"; 
            if(fields&&fields!="")query+="&fields="+fields;
            if(parameters&&parameters!="")query+="&"+parameters;
            if(page_size&&page_size!="")query+="&pagesize="+page_size;            
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/taxonomy_term"+query+"&"+options, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                xmlhttp.onreadystatechange = function () {
                    if(xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_fragen_index',data);                                                                                  
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));    
                    }
                };
             
                xmlhttp.send(null);
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_fragen_index',err);   
            });
        }//func

    }, { //Func
        key: "awriconnect_views_get_view",
        value: function awriconnect_views_get_view(path,params) {
            return new Promise(function (resolve, reject) {
                if(!params||params=='undefined')params="";
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host+'/'+path+'?'+params, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                            if(xmlhttp.status == 200){
                                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_views_get_view',data);                                                                               
                                resolve(data);
                            }
                            if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                            if (xmlhttp.status == 0) reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                                            
                            if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                    }
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_views_get_view',err);   
            });
        }//func

    }, { //Func
        key: "awriconnect_get_stats",
        value: function awriconnect_get_stats() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/stats.txt", true);
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = xmlhttp.responseText;
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_stats',data);                                                                               
                            resolve(data);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                    }
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_get_stats',err);   
            });
        }

    }, { //Func
        key: "awriconnect_whos_online",
        value: function awriconnect_whos_online() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_connect/whos_online.json", true);
    
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",awri._session);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = xmlhttp.responseText;
                        if(xmlhttp.status == 200 ){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_whos_online',data);                                                                               
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));    
                    }
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_views_get_view',err);   
            });
        }//Func

    }, { //Func
        key: "awriconnect_get_files",
        value: function awriconnect_get_files(uid,page){
            return new Promise(function (resolve, reject) {
                if(!page||page=='undefined')page=0;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/file.json?page="+page+"&parameters[uid]="+uid, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",awri._session);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = xmlhttp.responseText;
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_files',data);                                                                               
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_get_files.'));    
                    }
                };
                xmlhttp.send(null);
            });
        }//Func

    }, { //Func
        key: "awriconnect_upload_filedata",
        value: function awriconnect_upload_filedata(data) {         
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/file.json", true);           
                xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_upload_filedata',data);                                                                   
                            resolve(JSON.stringify(data));
                        }
                        if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));        
                    }
                };             
                xmlhttp.send(JSON.stringify(data));
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        }//Func

    }, { //Func
        key: "awriconnect_upload_file",
        value: function awriconnect_upload_file(previewid){
            return new Promise(function (resolve, reject) {
            var preview=document.querySelector('img#'+previewid);
            var dataURI = preview.src;
            dataURI=dataURI.substring(dataURI.indexOf(',')+1,dataURI.length);                 
        
            var filename = preview.getAttribute('name').replace(/.*(\/|\\)/, '');
            if(!filename)filename='upload-'+Date.now()+'.jpg';
            var ext=filename.split('.').pop();
            var filedata={
			    	 "filesize":dataURI.length,
				     "filename": filename,
				     "filemime":"image/"+ext,
				      "filepath":'public://attachments/'+filename,
				      "status": 0,
				      "file":dataURI 
            };                  
           resolve(awri.awriconnect_upload_filedata(filedata));
        })
        
    }//func

}, { //Func
    key: "_previewFile",
    value: function _previewFile(filefield,preview){
        var preview = document.querySelector(preview); //selects the query named img
        var file    = filefield.files[0]; //sames as here
        var reader  = new FileReader();
        console.log(preview);
        preview.setAttribute('name',filefield.value);
        reader.onloadend = function () {
            preview.src = reader.result;            
        }     
        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            preview.src = "";
        }            
    }//func

}, { //Func
    key: "awriconnect_get_file_by_fid",
    value: function awriconnect_get_file_by_fid(fid) {
        console.log(awri.host+'/'+awri.endpoint+'/file/'+fid+".json");
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.crossDomain = true;                    
            xmlhttp.open("GET", awri.host+'/'+awri.endpoint+'/file/'+fid+".json", true);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
            xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);                    
                        if(xmlhttp.status == 200){
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_file_by_fid',data);                                                                                   
                            resolve(data);
                        }
                    }
                    if (xmlhttp.status == 403) reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0)  reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));    
                };
            xmlhttp.send(null);
        });
    }//func

    }]);

    return AWRI;
}();




function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AWRIError = function (_Error) {
    _inherits(AWRIError, _Error);

    function AWRIError(msg) {
        _classCallCheck(this, AWRIError);

        var _this = _possibleConstructorReturn(this, (AWRIError.__proto__ || Object.getPrototypeOf(AWRIError)).call(this, msg));

        _this.msg = msg;
        _this.name = "AWRIConnectError";
        return _this;
    }

    return AWRIError;
}(Error);