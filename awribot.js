'use strict';
const {UFactory,User} = require('./drupalconnect');

 // aribot:Ppoa94&9
 // bot@awri.ch Ppoa94&9
 //161666490909817 Ratgeber Seite

var botuser='awribot';
var botpass='Ppoa94&9';
//var token=null;
//var session=null;
const version = 'AWRI-Bot/1.0';

class AWRIBot {
    constructor() {
      this.time = Date.now();
      this.log = console.log;
     let user = User;
      this.socket = null;
      

      var readline = require('readline');
      this.rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          //prompt: 'bot> ',
          terminal: true
        });
            
    } 
    
    input(q) {
        return new Promise( (res, rej) => {
            this.rl.question( q, answer => {
                res(answer);
            })
        });
      };
  

    async main(q) {
      var answer;
      while ( answer != 'exit' ) {
          answer = await this.input(this.user.username+':>');
       
           if (answer.startsWith('/bot'))this._parseBotCommand(answer.substring(5,answer.length))
      else  this.log(answer)

      }
      this.log( 'awribot sagt tschüss... :-)');
      process.exit(0);
    }
    

    get time() {
        return this._time;      
    
    }
    set time(time) {
        this._time= time;
    }           

    async run(user){
       this.user=user;
     this.log(version+' gestartet.');  
     //await blockierender aufruf 
        await UFactory.login(botuser,botpass).then(function(data){      
        console.log(version+' hat sich auf AWRI eingeloggt')
        user.uid=data.uid;
        user.username=data.username;
        user._token=data._token;
        user._session=data._session;    
         //console.log(user)
          });
    //wird nur einmal auferufen!
    this.main(user.username+':>')       
   }

   _parseBotCommand(cmd){
  //  this.log('bot '+cmd,'<');
    //console.log(user)
    if(cmd=='u'||cmd=='user')this.log(user.uid+ ' - ' + user.username);
       if(cmd.startsWith('help'))this._Help();
       if(cmd.startsWith('connect'))this._Connect();
       if(cmd.startsWith('login'))this._Login(cmd.substring(cmd.indexOf(' ')+1,cmd.length));
       if(cmd.startsWith('search'))this._Search(cmd.substring(cmd.indexOf(' ')+1,cmd.length));
       if(cmd.startsWith('show'))this._Show(cmd.substring(cmd.indexOf(' ')+1,cmd.length));
       if(cmd.startsWith('comments'))this._Comments(cmd.substring(cmd.indexOf(' ')+1,cmd.length));
   }

   _Help(){
    this.log('***********AWRIBOT Befehle************');
    this.log('/bot [Befehl] ...');
    this.log('help (zeigt Hilfe)');
    this.log('login [Benutzername] [Passwort] (mit ihrem Konto anmelden)');
    this.log('search [Suchtext] (Sucht nach Rechtsfragen mit dem Suchtext)');
    this.log('show [ID] (zeigt Rechtsfrage mit der ID an)');
    this.log('comments [ID] (zeigt Kommentare für die Rechtsrage mit der ID an)');
    this.log('connect (zu AWRI verbinden)');   
    this.log('whosonline (zeigt alle Mitglieder an die online sind)');    
   }
   
   async  _Search(txt){
   this.log('_search:'+txt);
    var dat;
    await UFactory.search(txt).then(function(data){      
     dat=data;
              });
//blocking for dat              
              dat.forEach(result => {
                this.log(result.node.nid+'.)------------------------------------------------->');
                this.log(result.snippet);
                this.log('<-------------------------------------------------------');
            });
    }

    async  _Show(nid){
        this.log('_Show:'+nid);
        var dat=[];
         await UFactory.show(nid).then(function(data){      
          var node=data;
          dat.push(node.nid+'.)------------------------------------------------->');
          dat.push(node.body['und'][0].value);
          dat.push('Kommentare:'+node.comment_count);
          dat.push('<-------------------------------------------------------');

                   }).catch(function(data){
                       console.error(data,'Nicht gefunden')
                   });
         dat.forEach(line=>{
            this.log(line);
         })
                    
                }

async  _Comments(nid){
            this.log('_Comments:'+nid);
            var dat=[];
             await UFactory.comments(nid).then(function(data){      
              var comments=data;
//              console.log(data)
              comments.forEach(comment => {
                dat.push(comment.cid+'.)------------------------------------------------->');
                dat.push(comment.comment_body['und'][0].value);
                 //           console.log('Kommentare:'+node.comment_count);
                 dat.push('<-------------------------------------------------------');
              
              });    
                       }).catch(function(data){
                        dat.push(data,'Nicht gefunden')
                       });

                       dat.forEach(line=>{
                        this.log(line);
                     })

             }

   async  _Connect(){
    this.log('_Connect');
    var char;
    await UFactory.connect(user._token,user._session).then(function(data){      
        user.email=data.mail;
        user.uid=data.uid;        
        user.roles=data.roles;
        user.username=data.name;        
    });
           
    this.log('you are connected as '+user.uid+' - '+user.username);

    this.input(user.username+':>');


    }


   async  _Login(cmd){
    const vars=cmd.split(' ');
    this.log('_Connect '+vars[0]+' '+vars[1])
    await UFactory.login(vars[0],vars[1]).then(function(data){           
      user=data;
              });
    }
    
}
module.exports={AWRIBot}