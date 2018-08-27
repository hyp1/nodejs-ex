/**
 * AWRI Connect client 
 * 
 *  Callbacks
 * awriconnect_user_connected
 * awriconnect_error
 * awriconnect_token
 * awriconnect_file_uploaded
 * awriconnect_data
 * 
 *  Funktionen 
token()
connect()
awriconnect_load_user(uid)
awriconnect_search_node(txt)            !ASYNC
awriconnect_search_user(txt)
awriconnect_load_node(nid)
awriconnect_comments(nid)               !ASYNC
awriconnect_login(username,password)
awriconnect_logout()
awriconnect_register(username,password,mail,mail_conf)
awriconnect_frage_get(nid)               !ASYNC
awriconnect_fragen_index(page=0,fields,parameters=null,page_size=null,options="options[orderby][cerated]=desc")           
awriconnect_frage_update(nid,data)
awriconnect_frage_create(data)
awriconnect_taxonomy_vocabulary(vid,fields)
awriconnect_taxonomy_term(page=0,fields,parameters=null,page_size=null,options="options[orderby][cerated]=desc")     
awriconnect_upload_filedata(data)
awriconnect_upload_file(previewid)
awriconnect_views_get_view()
awriconnect_dummy() 
awriconnect_get_file_by_fid(fid)
awriconnect_bookmarks(uid,page=0) 
awriconnect_bookmark_action(name,nid,action)
awriconnect_get_stats()  

SERVICE ENDPOINTS
system: 
*connect

user:
*login
*logout
*register
*token

file: 
*create 
*retrieve
*index

awri_fragen:
*retrieve
*index
*create
*update

awri_connect:	 	
*whos_online

taxonomy_term:
*retrieve
*index

taxonomy_vocabulary:
*retrieve
*index

search_node:
*retrieve

comments:
*index

flag:
*isflagged
*flag

*/

'use strict';

class AWRIError extends Error{
    constructor(msg){
    super(msg);
    this.msg=msg;
    this.name="AWRIConnectError"   
    }
}

class AWRI{
    constructor(host,endpoint){ 
           
    this.host=host;
    this.endpoint=endpoint;
    this._uid=null;
    this._name=null;
    this._token=null;
    this._session=null;
    AWRI.log("AWRI.constructed: "+ this.host+'/'+this.endpoint);        
    }
    static async(){
        return false;
    }

    static log(line){
    if(AWRI.log)AWRI.log(line);
    }
    
    static setLogger(log){
        AWRI.log=log;
    }
    

    _send(xmlhttp){
        try {
            xmlhttp.send(null);            
        } catch (error) {
            console.log(error);
            if(typeof awriconnect_error == 'function')awriconnect_error(error);
            throw  new AWRIError(error+' Daten konnten nicht gesendet werden!');
        }
    }

     connect() {        
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
                   var  user = response.user;
                   awri._session=response.session_name+"_"+response.sessid;
                   resolve(user);
                if(typeof awriconnect_user_connected == 'function') awriconnect_user_connected(user);                                                                                    
                }
                //if (xmlhttp.status == 404) return reject( new AWRIError(xmlhttp.status+' Nicht gefunden.'));
                if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler connect.'));
            };
        awri._send(xmlhttp);
        })
        }
    
    
    token() {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.crossDomain = true;
            xmlhttp.open("GET",  awri.host + "/services/session/token", false);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    awri._token = xmlhttp.responseText;
                   //AWRI.log('connect:'+awri._token);
                   console.log(awri._token);
          
                resolve(awri._token);
            }
             
                if (xmlhttp.status != 200) reject(  new AWRIError(xmlhttp.status+' Fehler in connect.'));
            };
            xmlhttp.send(null);
            });
           
        }
    
        _check() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", awri.host+'/'+awri.endpoint , AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "text/json");                
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                        //    AWRI.log('_check:'+status);
                        
                        this.connected=true;  
                        console.log(this.connected);
                        alert(this.connected)
                        return resolve(this.connected);
                        }
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler _check.'));
                    };
                    xmlhttp.send();            
            }).catch(function(err){
                this.connected=false;  
                if(typeof awriconnect_error == 'function')awriconnect_error(err);
       
            });
        }

        _loaduser(token) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/system/connect.json", AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", token);
                
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var response = xmlhttp.responseText;
                           var  obj = JSON.parse(response);
                            AWRI.log('_connect:'+awri._token);
                           console.log(obj);
                           if(obj.user.uid==0)return resolve(obj.user);
                           else return resolve(awri.awriconnect_load_user(obj.user.uid));
                        }
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler connect.'));
                    };
                    xmlhttp.send();
                });
            }
    
            awriconnect_load_user(uid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/user/" + uid + ".json", AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                        var user = JSON.parse(xmlhttp.responseText);
                       if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_load_user',user);                                                                   
                   
                        resolve(user);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler in loaduser.'));
                    };
                    xmlhttp.send();
                });
            };
    
         awriconnect_search_node(txt) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/search_node/retrieve.json?keys="+txt, true);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText);                                                           
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_search_node',result);                                                                   
                            return resolve(result);
                        }
                        if (xmlhttp.status == 404) reject( new AWRIError('Nichts gefunden auf:'+txt));
    
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_search_node'));
                    };
                    awri._send(xmlhttp);
                });
            }
    
           awriconnect_search_user(txt) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/search_user/retrieve.json?keys="+txt, AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText);                                                           
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_search_user',result);                                                                   
                            resolve(result);
                        }     
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_search_user'));
                    };
                    xmlhttp.send();
                }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('search_user',err);
            });
            }
      
        awriconnect_load_node(nid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/node/"+nid+".json", AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText);  
                                                                   
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_load_node',result);                                                                   
                            resolve(result);
                        }                  
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_load_node'));
                    };
                    awri._send(xmlhttp);
                });
            }
                
            awriconnect_comments(nid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/" + awri.endpoint + "/comment.json?parameters[nid]="+nid+"&parameters[status]=1&pagesize=150", true);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText); 
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_comments',result);                                                                   
                             resolve(result);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_comments'));
                    };
                    awri._send(xmlhttp);
                });
            }
        
            awriconnect_bookmarks(uid,page=0) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host + "/user/bookmarks/"+uid+"?page="+page, true);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText); 
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_bookmarks',result);                                                                   
                             resolve(result);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_bookmarks'));
                    };
                    awri._send(xmlhttp);
                });
            }

            awriconnect_is_bookmark(nid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("GET", awri.host +"/"+awri.endpoint +"/flag/is_flagged.json", true);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText); 
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_is_bookmark',result);                                                                   
                             resolve(result);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_is_bookmark'));
                    };
                    awri._send(xmlhttp);
                });
            }

            awriconnect_bookmark_action(name,nid,action) {
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
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var result= JSON.parse(xmlhttp.responseText); 
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_bookmark_action',result);                                                                   
                             resolve(result);
                        }
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler', 'awriconnect_bookmark_action'));
                    };
                    xmlhttp.send(JSON.stringify(postData));
                });
            }

            awriconnect_login(username,password) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    var postData = {        
                        username: username,
                        password: password
                      }   
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/login.json",AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    
                     //xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                      
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var response = xmlhttp.responseText;
                            var obj = JSON.parse(response);                        
                            var user=obj.user;
                            awri._session=obj.session_name + '_' + obj.sessid;
                            awri._token=obj.token;
                            console.log(user,"LOGIN");
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_login',user);                                                                   
                      
                             return resolve(awri.awriconnect_load_user(user.uid));                                          
                        }
                        if (xmlhttp.status == 401) reject( new AWRIError('Sie sind schon eingeloggt','awriconnect_login'));
                    
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_login'));
                    };  
                    xmlhttp.send(JSON.stringify(postData));
                }).catch(function(err){
                    if(typeof awriconnect_error == 'function')awriconnect_error('login',err);
                });
            }
    
    
        awriconnect_logout() {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();                  
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/logout.json",AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");                
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var response = JSON.parse(xmlhttp.responseText);
                        if(typeof awriconnect_data == 'function')awriconnect_data('logout',response[0]);                                                                   
                            return resolve(response[0]); 
                        }
                        if (xmlhttp.status == 406) reject( new AWRIError('Sie sind nicht eingeloggt!','awriconnect_logout'));
                        if (xmlhttp.status == 0) return reject( new AWRIError('Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status));
                    };  
                    xmlhttp.send();
                }).catch(function(err){
                    if(typeof awriconnect_error == 'function')awriconnect_error('logout',err);
                });      
            }
            

            awriconnect_register(username,password,mail,mail_conf) {
                return new Promise(function (resolve, reject) {
                    if(mail!==mail_conf)return reject( new AWRIError('Die Email Adressenmüssen übereinstimmen.'));
                    var xmlhttp = new XMLHttpRequest();
                    var postData = {        
                        name: username,
                        pass: password,
                        mail:mail,
                        status:1
                      };

                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;
                    xmlhttp.open("POST", awri.host + "/" + awri.endpoint + "/user/register.json",AWRI.async());
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);                      
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                            var response = xmlhttp.responseText;
                            var obj = JSON.parse(response);                        
                            user.uid=obj.uid;
                            user.link=obj.uri;
                            console.log(user,"REGISTER");
                            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_register',user);                                                                   
                      
                             resolve(awri.awriconnect_load_user(user.uid));                                          
                        }                      
                        if (xmlhttp.status != 200) reject( new AWRIError(xmlhttp.status+' Fehler','awriconnect_register'));
                        if (xmlhttp.status != 406) reject( new AWRIError(xmlhttp.status+' Fehler. Bitte alle erforderlichen Felder ausfüllen','awriconnect_register'));
                
                    };  
                    xmlhttp.send(JSON.stringify(postData));
                }).catch(function(err){
                    if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_register',err);
                });
            }

            //drupalgap/awri_services_resources/whos_online
            awriconnect_dummy(uid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;                    
                    xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_connect/dummy", AWRI.async());

                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                      var data = xmlhttp.responseText;
                       if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_dummy',data);                                                                   
                   
                        resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
                    };
                    _send(xmlhttp);
                }).catch(function(err){
                    if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
                });
            };
    

            //drupalgap/awri_services_resources/whos_online
            awriconnect_frage_get(nid) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;                    
                    xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/awri_fragen/"+nid+".json", true);
                    xmlhttp.setRequestHeader("Content-Type", "application/json");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                      var data = JSON.parse(xmlhttp.responseText);
                   
                      if(data[0]==false) reject(new AWRIError('Der Beitrag wurde nicht gefunden.')); 
                      if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_dummy',data);                                                                   
                   
                            resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
                    };
                    awri._send(xmlhttp);
                });
            };
             //drupalgap/awri_services_resources/whos_online
             //awri.host + "/"+awri.endpoint+"/awri_fragen?fields=nid,title&parameters[nid]=16250&options[orderby][title]=asc&options[orderby][title]=asc
             //http://domain/endpoint/taxonomy_term?fields=tid,name&parameters[tid]=7&parameters[vid]=1
             awriconnect_fragen_index(page=0,fields,parameters=null,page_size=null,options="options[orderby][created]=desc") {
                var query="?page="+page; 
                if(fields&&fields!="")query+="&fields="+fields;
                if(parameters&&parameters!="")query+="&"+parameters;
                if(page_size&&page_size!="")query+="&pagesize="+page_size;
                console.log(awri.host + "/"+awri.endpoint+"/awri_fragen"+query+"&"+options);
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.withCredentials = true;
                    xmlhttp.crossDomain = true;                    
                    xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/awri_fragen?"+query+"&"+options, AWRI.async());
                    //xmlhttp.overrideMimeType('application/xml;');
                    xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                    xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                      var data = JSON.parse(xmlhttp.responseText);
                      console.log(data)
                       if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_fragen_index',data);                                                                   
                   
                        return resolve(data);
                        }
                        if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                        if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                        if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_fragen_index.'));
                    };
                 
                   awri._send(xmlhttp);
                }).catch(function(err){
                    if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_fragen_index',err);   
                });
            };

 //drupalgap/awri_services_resources/whos_online
    awriconnect_frage_update(nid,data) {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.crossDomain = true;                    
            xmlhttp.open("PUT", awri.host + "/"+awri.endpoint+"/awri_fragen/"+nid+"", AWRI.async());

            xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
            //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
            var data = JSON.parse(xmlhttp.responseText);
            console.log(data);
                //data=JSON.parse(data);
            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_frage_update',data);                                                                   
        
                return resolve(data);
                }
                if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
            };
            xmlhttp.send(JSON.stringify(data));
        }).catch(function(err){
            if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
        });
    };


    awriconnect_frage_create(data) {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.crossDomain = true;                    
            xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_fragen", AWRI.async());

            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
            //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
            var data = JSON.parse(xmlhttp.responseText);
                console.log(data);
            if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_frage_create',data);                                                                   
        
                return resolve(data);
                }
                if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
            };
            xmlhttp.send(JSON.stringify(data));
        }).catch(function(err){
            if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
        });
    };

        //parameters[vid]=3&fields=vid,description,name
        awriconnect_taxonomy_vocabulary(vid,fields) {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/taxonomy_vocabulary?parameters[vid]="+vid+'&fields='+fields, AWRI.async());

                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                  var data = JSON.parse(xmlhttp.responseText);
                    console.log(data);
                   if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_taxonomy_index',data);                                                                   
               
                    return resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        };

        //?fields=tid,name=3&options[oderby][tid]=desc
        awriconnect_taxonomy_term(page=0,fields,parameters=null,page_size=null,options="options[orderby][cerated]=desc") {
            var query="?page="+page; 
            if(fields&&fields!="")query+="&fields="+fields;
            if(parameters&&parameters!="")query+="&"+parameters;
            if(page_size&&page_size!="")query+="&pagesize="+page_size;
            console.log(awri.host + "/"+awri.endpoint+"/taxonomy_term"+query+"&"+options);
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/taxonomy_term"+query+"&"+options, AWRI.async());
                //xmlhttp.overrideMimeType('application/xml;');
                xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                  var data = JSON.parse(xmlhttp.responseText);
                  console.log(data)
                   if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_fragen_index',data);                                                                   
               
                    return resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
                };
             
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        };


        awriconnect_views_get_view(path,params="") {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host+'/'+path+'?'+params, false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                var data = JSON.parse(xmlhttp.responseText);
                console.log(data);
                    //data=JSON.parse(data);
                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_views_get_view',data);                                                                   
            
                     resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_views_get_view',err);   
            });
        };


        awriconnect_get_stats() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/stats.txt", AWRI.async());
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                var data = xmlhttp.responseText;
                console.log(data);
                    //data=JSON.parse(data);
                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_stats',data);                                                                   
            
                    return resolve(data);
                    }
                            if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_get_stats',err);   
            });
        };

        awriconnect_whos_online() {
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/awri_connect/whos_online.json", AWRI.async());
    
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",awri._session);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                var data = xmlhttp.responseText;
                console.log(data);
                    //data=JSON.parse(data);
                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_whos_online',data);                                                                   
            
                    return resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                };
                xmlhttp.send();
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('awriconnect_views_get_view',err);   
            });
        };

        awriconnect_get_files(uid,page="0"){
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host + "/"+awri.endpoint+"/file.json?page="+page+"&parameters[uid]="+uid, AWRI.async());
                xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                //xmlhttp.setRequestHeader("Cookie",awri._session);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                var data = xmlhttp.responseText;
                console.log(data);
                    //data=JSON.parse(data);
                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_files',data);                                                                   
            
                    resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_get_files.'));
                };
                awri._send(xmlhttp);
            });
        }

           //base64 emcoded image data
           awriconnect_upload_filedata(data) {         
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("POST", awri.host + "/"+awri.endpoint+"/file.json", AWRI.async());
                //xmlhttp.overrideMimeType('application/xml;');
                xmlhttp.setRequestHeader("Content-Type", "application/json ;charset=UTF-8");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);            
                xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                    var data = JSON.parse(xmlhttp.responseText);
                    if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_upload_filedata',data);                                                                   
                        return resolve(JSON.stringify(data));
                }
                if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in dummy.'));
                };             
                xmlhttp.send(JSON.stringify(data));
            }).catch(function(err){
                if(typeof awriconnect_error == 'function')awriconnect_error('dummy',err);   
            });
        };

        /**
         * Image Preview Field ID
         * @param {*} previewid 
         */
        awriconnect_upload_file(previewid){
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
        }

        /**
         * 
         * @param {*} filefield File Field  
         * @param {*} preview   Image Field
         */
         _previewFile(filefield,preview){
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
        }
        awriconnect_get_file_by_fid(fid) {
            console.log(awri.host+'/'+awri.endpoint+'/file/'+fid+".json");
            return new Promise(function (resolve, reject) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.withCredentials = true;
                xmlhttp.crossDomain = true;                    
                xmlhttp.open("GET", awri.host+'/'+awri.endpoint+'/file/'+fid+".json", false);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.setRequestHeader("X-CSRF-Token", awri._token);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {                      
                var data = JSON.parse(xmlhttp.responseText);
                console.log(data);
                    //data=JSON.parse(data);
                if(typeof awriconnect_data == 'function')awriconnect_data('awriconnect_get_file_by_fid',data);                                                                   
                    
                     return resolve(data);
                    }
                    if (xmlhttp.status == 403) return reject( new AWRIError(xmlhttp.status+' Kein Zugriff für anonyme Benutzer.'));              
                    if (xmlhttp.status == 0) return reject( new AWRIError(xmlhttp.status+' Der Service wurde nicht gefunden.'));                
                    if (xmlhttp.status != 200) return reject( new AWRIError(xmlhttp.status+' Fehler in awriconnect_views_get_view.'));
                };
                xmlhttp.send();
            });
        };
       
    }