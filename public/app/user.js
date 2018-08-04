
var promiseCount = 0;
var promiseUser,promiseAccount;


function default_user(){
    var user={
        uid:0,
        name:'Nicht angemeldet',
        email:'',
        roles:[],
        fbid:0,
        sessname:0,
        sessid:0,
        picture:'anonymous2.png',
    } 
return user;
}
var user=default_user();


function setUser(id,user){
  var elem=document.getElementById(id);
  elem.innerHTML='<img width="30" height=30" src="'+user.picture+'"> '+user.name
}

function setLog(msg){
  var log = document.getElementById('log');
  log.insertAdjacentHTML('beforeend',msg);
}

function setError(status){
  var log = document.getElementById('log');
  var msg='';
  if(status==401)msg='401 sie nicht die nötige Berechtiung!';
  if(status==404)msg='404 es besteht keine Verbindung zur Seite!';
  if(status==406)msg='406 sie sind bereits an/abgemeldet!';
  alert('FEHLER: '+msg);
  log.insertAdjacentHTML('beforeend','FEHLER: <strong>'+msg+'</strong><br/>');
}



function connect() {
var thisUser=user;
var thisPromiseCount = ++promiseCount;
showLoader();
setLog(thisPromiseCount + ') Connect Started (<small>Sync code started</small>)<br/>');
  
promiseUser = new Promise(
    function(resolve, reject) {       
    setLog(thisPromiseCount +') System Connect Promise started (<small>Async code started</small>)<br/>');
      system_connect({
        success: function(result) {
            setLog(thisPromiseCount + ') User Load (<small>Sync code started</small>)<br/>');                  
            //Wenn user nicht 0 account laden
            if(Drupal.user.uid!=0){
              thisUser.uid=Drupal.user.uid;
              thisUser.name=result.user.name;
              thisUser.email=result.user.mail;
              thisUser.roles=result.user.roles;
              thisUser.sessname=result.session_name;
              thisUser.sessid=result.sessid;   

                  promiseAccount= new Promise(function(resolve,reject){
                  setLog(thisPromiseCount +') User Load Promise started (<small>Async code started</small>)<br/>');
                      user_load(Drupal.user.uid,
                        {
                        success: function(result) {                                                 
                          thisUser.fbid=result.field_fbid['und'][0].value;
                          thisUser.picture= result.picture.url;
                          resolve(thisUser);
                        },
                        error: function(result) {                           
                          console.log(result);                   
                          reject(result); 
                        }
                      });//user_load
                    }); //promiseAccount                 
              
                    promiseAccount.then(
                      function(user){
                        setLog(thisPromiseCount +') User Load Promise fullfilled (<small>Async code terminated</small>)<br/>');
                        resolve(user);         
                        setUser('user',user)},
                      function(val){
                        setLog(thisPromiseCount +') User Load Promise rejected (<small>Async code terminated</small>)<br/>');
                        reject(val);
                    }); 
         
            }else thisUser=default_user();
     
  resolve(thisUser);
  },
        error: function(result) {
            setError(result.status);
            reject(result);
        }
      });//system_connect
  });//promiseUser
 
setLog(thisPromiseCount + ') User Load made (<small>Sync code terminated</small>)<br/>');

promiseUser.then(
  function(user) {
    setLog( thisPromiseCount +') System Connect Promise fulfilled (<small>Async code terminated</small>)<br/>');
    setUser('user',thisUser);
    hideLoader();
  },
  function(error) {
    setLog( thisPromiseCount + ') System Connect Promise rejected (<small>Async code terminated</small>)<br/>');
    hideLoader();	 
});

setLog(thisPromiseCount + ') Connect made (<small>Sync code terminated</small>)<br/>');

}


function logout() {
	var thisPromiseCount = ++promiseCount;
  showLoader();
	var log = document.getElementById('log');
	setLog(thisPromiseCount + 
		') User Logout Started (<small>Sync code started</small>)<br/>');
  
	// Wir erstellen einen neuen Promise: wir versprechen den String 'result' (Wartezeit max. 3s)
	promiseUser = new Promise(
	  // Resolver-Funktion kann den Promise sowohl auflösen als auch verwerfen
	  // reject the promise
	  function(resolve, reject) {       
			setLog(thisPromiseCount + 
			') Promise User Logout started (<small>Async code started</small>)<br/>');
		// nur ein Beispiel, wie Asynchronität erstellt werden kann
		user_logout({
		  success: function(result) {
            user=default_user();
          resolve(result);
		  }
		,error: function(result) {	
      reject(result);   
		}
	  });
	  });
  
	// wir bestimmen, was zu tun ist, wenn der Promise fulfilled
	promiseUser.then(
	  // Loggen der Nachricht und des Wertes
	  function(val) {
          setUser('user',user);
		log.insertAdjacentHTML('beforeend', val +
      ') Promise User Logout fulfilled (<small>Async code terminated</small>)<br/>');
        
      hideLoader();
	  },function(val) {
      console.log(val);

	  log.insertAdjacentHTML('beforeend', val.status +
	  ') Promise User Logout rejected (<small>Async code terminated</small>)<br/>');
      // rejection
      setError(val.status);
      hideLoader();
		});
  
	log.insertAdjacentHTML('beforeend', thisPromiseCount + 
		') Promise User Logout made (<small>Sync code terminated</small>)<br/>');

}

function login(username,password) {
    showLoader();
var thisPromiseCount = ++promiseCount;
var thisUser=default_user();

setLog(thisPromiseCount + 
		') User Login Started (<small>Sync code started</small>)<br/>');
  
	// Wir erstellen einen neuen Promise: wir versprechen den String 'result' (Wartezeit max. 3s)
	promiseUser = new Promise(

	  // Resolver-Funktion kann den Promise sowohl auflösen als auch verwerfen
	  // reject the promise
	  function(resolve, reject) { 
   		setLog(thisPromiseCount + 
			') Promise User Login started (<small>Async code started</small>)<br/>');
		// nur ein Beispiel, wie Asynchronität erstellt werden kann
		user_login(username,password,{
		  success: function(result) {
            thisUser.uid=result.user.uid;
            thisUser.name=result.user.name;
            thisUser.email=result.user.mail;
            thisUser.sessname=result.session_name;
            thisUser.sessid=result.sessid;
            thisUser.roles=result.user.roles;

            //   hideLoader();
            
          resolve(thisUser);       
		  }
		,error: function(result) {
     // thisUser.uid=result.user.uid;
     // thisUser.name=result.name;
     // thisUser.name=result.user.name;	
    //  thisUser.uid=result.user.uid;
      thisUser.sessname=result.session_name;
      thisUser.sessid=result.sessid;
      hideLoader();
	  reject(result);
		}
	  });
	  });

	// wir bestimmen, was zu tun ist, wenn der Promise fulfilled
	promiseUser.then(
	  // Loggen der Nachricht und des Wertes
	  function(user) {
     
          promiseAccount= new Promise(
          // Resolver-Funktion kann den Promise sowohl auflösen als auch verwerfen
          // reject the promise
          function(resolve, reject) {       
            setLog(thisPromiseCount + 
            ') Promise User Load started (<small>Async code started</small>)<br/>');
          // nur ein Beispiel, wie Asynchronität erstellt werden kann
          user_load(Drupal.user.uid,{
            success: function(result) {        
   
              resolve(result);
            }
          ,error: function(result) {	
      
            reject(result);   
    
          }
          });

          setLog(thisPromiseCount + 
            ') Promise User Load made (<small>Sync code terminated</small>)<br/>');
 
          });
  
  
          promiseAccount.then(
            // Loggen der Nachricht und des Wertes
            function(result) {
              console.log(result,'uhh')
              thisUser.picture=result.picture.url;
              thisUser.fbid=result.field_fbid['und'] [0].value;
              console.log(thisUser)
              setLog(thisPromiseCount + 
                ') Promise User Load fullfilled (<small>Async code terminated</small>)<br/>');
                setUser('user',thisUser);                  
        
            },function(val) {
             // alert(val.uid);
             // alert("PROMSE  account Fehler:" + val.name);
          setError(val.status);
          setLog(thisPromiseCount + 
            ') Promise User Load rejected (<small>Async code terminated</small>)<br/>');

                });
             
                //setUser('user',thisUser);    
                hideLoader();

                setLog( thisPromiseCount +
			') Promise User Login fulfilled (<small>Async code terminated</small>)<br/>');
	  },function(result) {
    setError(result.status);
    setLog(thisPromiseCount +
    ') Promise User Login rejected (<small>Async code terminated</small>)<br/>');    
		  // rejection
    
        });
  
	setLog(thisPromiseCount + 
		') Promise User Login  made (<small>Sync code terminated</small>)<br/>');

}


