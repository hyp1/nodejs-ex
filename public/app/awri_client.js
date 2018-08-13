'use strict';

class AWRI{
    constructor(){
    console.log('AWRI.constructor');
        this._site;
        this._endpoint;
        this._token=null;
        this._session=null;         
    }

 static  setup(site,endpoint) {
    this._site=site;
    this._endpoint=endpoint;
    console.info(this._site+"/"+this._endpoint+"/system/connect.json",'AWRI.setup');
    };    

    getToken() {
        return this._token;
    };    

   static async  token() {
        let promise = new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.withCredentials = true;
            xmlhttp.open("GET", this._site+"/services/session/token", true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                    this._token = xmlhttp.responseText;
                    //setTimeout(() => resolve(this._token), 1000);
                    resolve(this._token)
                               }
                if (xmlhttp.status != 200) reject(xmlhttp.status);
            };
            xmlhttp.send();
        });
       return this._token = await promise; // wait till the promise resolves (*)
      }

    static  async  connect() {
        let promise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.crossDomain = true;
        xmlhttp.open("POST", this._site+"/"+this._endpoint+"/system/connect.json", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
    
        xmlhttp.setRequestHeader("X-CSRF-Token", this._token);
        let obj=null;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
              var response = xmlhttp.responseText;
               obj = JSON.parse(response);
               this._session=obj.session_name+'_'+obj.sessid;
                 resolve(obj);
            }
            if (xmlhttp.status != 200) reject(xmlhttp.status);
        };
        xmlhttp.send();
        });
     
     return  await promise; // wait till the promise resolves (*)      
  }


  static async  loadUser(uid,chatuser) {

    let promise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.crossDomain = true;
        xmlhttp.open("GET", this._site + "/" + this._endpoint + "/user/" + uid + ".json", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("X-CSRF-Token", this._token);
        //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                var usr = JSON.parse(xmlhttp.responseText);
     
//                chatuser._fbid = usr.field_fbid['und'][0].value;
 //               chatuser._picture = usr.picture.url;
 //               chatuser._email = usr.mail;
 //               chatuser._roles = usr.roles;              
                resolve(usr);
                console.log(usr,"LOADUSERFULL");

            }
            if (xmlhttp.status != 200) reject(xmlhttp.status);
        };
        xmlhttp.send();
    });
 
 return  await promise; // wait till the promise resolves (*)      
}

static async loadNode(nid) {
    let promise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.crossDomain = true;
        xmlhttp.open("GET", this._site+'/'+ this._endpoint+'/node/'+nid+'.json', true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("X-CSRF-Token", this._token);
        //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                var node = JSON.parse(xmlhttp.responseText);
                resolve(node);
                console.log(node,"NODEFULL");
            }
            if (xmlhttp.status != 200) reject(xmlhttp.status);
        };
        xmlhttp.send();
    });
    return  await promise;
  };

  static async loadComments(nid) {
    let promise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.crossDomain = true;
        xmlhttp.open("GET", this._site+'/'+this._endpoint+'/comment.json?parameters[nid]='+nid+'&parameters[status]=1&pagesize=150', true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("X-CSRF-Token", this._token);
        //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                var comments = JSON.parse(xmlhttp.responseText);
                resolve(comments);
                console.log(comments,"COMMENTSFULL");
            }
            if (xmlhttp.status != 200) reject(xmlhttp.status);
        };
        xmlhttp.send();
    });
    return  await promise; // wait till the promise resolves (*)      
  }
//      xmlhttp.open("GET",  this._site + "/" + this._endpoint +'/search_node/retrieve.json?keys='+txt, true);
     
static async search(txt) {
    console.info(txt,'AWRI.search...');
    let promise = new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.withCredentials = true;
        xmlhttp.crossDomain = true;
        xmlhttp.open("GET",  this._site + "/" + this._endpoint +'/search_node/retrieve.json?keys='+txt, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("X-CSRF-Token", this._token);
        //xmlhttp.setRequestHeader("Cookie",variable_get('session'));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
                var result = JSON.parse(xmlhttp.responseText);                    
                resolve(result);
                console.log(result,"FULLSEARCH");
            }
            if (xmlhttp.status != 200) reject(xmlhttp.status);
        };
        xmlhttp.send();
    });
    console.info('...ready','AWRI.search');
 return  await promise; // wait till the promise resolves (*)      
  };

};

