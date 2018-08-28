/**
 * AWRI CHAT Befehle
 * @param {*} cmd 
 */

var cmdBuffer=[];
var cmdBufferMax=20;
var cmdBufferIndex=0;

function parseCommand(cmd){
    addCmdToBuffer(cmd);
    console.log(cmd,'parseCommand');
   if(cmd=='help'||cmd=='hilfe')cmdHelp();
   if(cmd=='stats'||cmd=='statistik')cmdStats();
   if(cmd=='news')cmdNews();
   if(cmd=='info')cmdInfo();
   if(cmd=='clear')cmdClear();  
   if(cmd=='whoami')cmdWhoami();
   if(cmd.startsWith('whois'))cmdWhois(cmd.substr(6,cmd.length));
   if(cmd=='beep')cmdBeep();
   if(cmd.startsWith('search'))cmdSearch(cmd.substr(7,cmd.length));
   if(cmd=='kicks'){
       cmdKicks();
   return;
    }
   if(cmd.startsWith('kick'))cmdKick(cmd.substr(5,cmd.length));
   if(cmd.startsWith('unkick'))cmdUnKick(cmd.substr(7,cmd.length));
   if(cmd=='bans'){
    cmdBans();
    return;
    }
   if(cmd.startsWith('ban'))cmdBan(cmd.substr(4,cmd.length));
   if(cmd.startsWith('unban'))cmdUnBan(cmd.substr(6,cmd.length));               
   if(cmd.startsWith('login'))cmdLogin(cmd.substr(6,cmd.length));           
   if(cmd.startsWith('logout'))cmdLogout(cmd.substr(7,cmd.length));           
   if(cmd.startsWith('uploads'))cmdUploads(cmd.substr(8,cmd.length));
   if(cmd=='upload')cmdUpload();
   if(cmd.startsWith('show image'))cmdshowImage(cmd.substr(11,cmd.length));
   else if(cmd.startsWith('show content'))cmdshowContent(cmd.substr(13,cmd.length));
   else  if(cmd.startsWith('show'))cmdShow(cmd.substr(5,cmd.length));
   if(cmd.startsWith('adminmsg'))cmdAdminMsg(cmd.substr(9,cmd.length));
   if(cmd.startsWith('bookmarks'))cmdBookmarks(cmd.substr(10,cmd.length));
   if(cmd.startsWith('add bookmark'))cmdAddBookmark(cmd.substr(13,cmd.length));
   if(cmd.startsWith('del bookmark'))cmdDelBookmark(cmd.substr(13,cmd.length));
}

function addCmdToBuffer(str){
    if(cmdBuffer.length>cmdBufferMax)cmdBuffer.shift();
    cmdBuffer.push(str);      
}

function cmdInfo(){
    help=[
    '<h3><img style="vertival-align:middle;" src="img/logo_blank_50x50.png"> AWRI Chat Info</h3>',
    'Dieser Chat ist mit der AWRI Datenbank verbunden.',
    'Benutzer die auf '+l('AWRI (Alles was Recht ist)','https://awri.ch',{id:"awrihome",target:"_BLANK"})+' angemeldet sind, könnnen aus dem Chat authentifizierte Anfragen an AWRI senden.',
    'Falls sie noch nicht auf '+l('AWRI','https://awri.ch',{id:"awrihome",target:"_BLANK"})+' angemeldet sind,',
    'können sie nur als anonymer Benutzer an unserer Diskussion teilnehmen.',
    'Als anonymer Teilnehmer können sie im Chat keine erweiterten Funktionen ausführen.',
    'Bei erneutem laden des Browsers, werden die letzten 15 Chat Nachrichten geladen und angezeigt.',
    'Sie können  private Nachrichten senden, indem Sie die Person in der Mitgliederliste <a href="#myheader" class="ui-icon-user ui-btn-icon-notext inlineIcon"></a> rechts oben auswählen.',
    'Wenn sie dieses Häkchen aktivieren ☑️ werden sie bei privaten Nachrichten durch Browsernotifikationen benachrichtigt. ',
    'Schreiben sie <strong>/help</strong> oder <strong>/hilfe</strong> ins Chat Fenster, um weitere Hilfe anzuzeigen.',
    'Moderatoren haben dieses <span class="modsym">🛡</span> und Admins <span class="adminsym">⚔️</span> ein solches Präfix vor den Namen.',
    'Mit den Pfeiltasten (hoch/runter) können Sie ihre letzten Befehle wiederholen.',
    'Anonyme Benutzer haben dieses '+theme_user_picture('img/anonymous.png')+' Profilbild',
    'Viel Spass beim Diskutieren und bitte immer freundlich bleiben. ¯\\_(ツ)_/¯',
];
help.forEach(line => {
    appendLine(line)
});
$('#msg').val('');
}

function cmdHelp(){
    help=[
    '<h2>Hilfe</h2>',
    'Chat Befehle beginnen mit einem Slash /[Befehl],',
    '<span style="color:green;">Befehlsliste (Alle Benutzer)</span>',
    '<strong>/info</strong> (zeigt Informationen über den Chat)',
    '<strong>/help</strong> (zeigt diese Hilfe)',
    '<strong>/clear</strong> (leert das Chat Fenster)',
    '<strong>/news</strong> (Zeigt die aktuellsten 3 Beiträge von AWRI)',
    '<strong>/whoami</strong> (zeigt ihre Benutzer Informationen)',
    '<strong>/beep</strong> (spielt den Benachrichtiguns Ton ab)',
    '<strong>/search [Suchwort] {AND|OR} [Suchwort] ...</strong> (sucht in der AWRI Datenbank nach Ergebnissen)',
    '<strong>/show [Beitrags-ID]</strong> (zeigt den Beitrag mit der [Beitrags-ID] an)',
    '<strong>/show content [Beitrags-ID] [Benutzer-ID]</strong> (zeigt dem Benutzer [Benutzer-ID] den Beitrag mit der [Beitrags-ID] an)',
    '<strong>/adminmsg</strong> (sendet die Nachricht an alle Admins oder Moderatoren im Chat)',
    '<strong>/show image [Datei-ID] {[Benutzer-ID]}</strong> (zeigt das Bild mit der [Datei-ID] ihnen oder optional dem Benutzer mit der [Benutzer-ID] an)',
   
    '<span style="color:blue;">Befehlsliste (AWRI Mitglieder)</span>',
    '<strong>/login [username] [passwort]</strong> (meldet Sie über die AWRI Seite an)', 
    '<strong>/logout</strong> (meldet Sie von der AWRI Seite ab)', 
    '<strong>/bookmarks {[Seite]}</strong> (zeigt ihre gepeicherten Lesezeichen an. Es werden immer 10 auf einer Seite angezeigt.)', 
    '<strong>/add bookmark [Beitrags-ID]</strong> (fügt den Beitrag mit der [Beitrags-ID] zu Ihren Lesezeichen hinzu.)', 
    '<strong>/del bookmark [Beitrags-ID]</strong> (entfernt den Beitrag mit der [Beitrags-ID] von Ihren Lesezeichen.)', 
    '<strong>/upload</strong> (Datei hochladen)', 
  
    '<strong>/uploads {[Seite]}</strong> (Zeigt Ihre hochgeladenen Dateien an. Es werden immer 10 auf einer Seite angezeigt.)', 
    '<span style="color:red;">Befehlsliste (AWRI Admins/Moderatoren)</span>',
    '<strong>/kick [Benutzer-ID]</strong> (Entfernt den Benutzer mit der [Benutzer-ID] aus dem Chat)',
    '<strong>/unkick [Benutzer-ID]</strong> (Entfernt den Benutzer mit der [Benutzer-ID] aus der Sperrliste)',
    '<strong>/kicks</strong> (Zeigt die Liste der gesperrten [Benutzer-ID]\'s an.)',
    '<strong>/ban [Benutzer-ID]</strong> (Entfernt den Benutzer mit der [Benutzer-ID] aus dem Chat und sperrt seine IP Adresse)',
    '<strong>/unban [IP Adresse]</strong> (Entfernt die [IP-Adresse] aus der Sperrliste)',
    '<strong>/bans</strong> (Zeigt die Liste der gesperrten IP Adressen an.)',

];
help.forEach(line => {
    appendLine(line);
});
$('#msg').val('');
}

function cmdWhoami(){
    var user=variable_get('user');
    var k=Object.keys(user._roles);
    var email=isAnon() ? '(nicht registriert)' : user._email;
    var link=isAnon() ? '(nicht registriert)' :'https://awri.ch/user/'+user._uid;
    var roles="";
    k.forEach(role => {
        roles+=user._roles[role]+',';
    });
    out=[
        '<h2>'+user._name+'</h2>',
        'Id: '+user._uid,
        'Email: '+''+ email,
        'Rollen: '+roles,
        'Konto-Link: '+ l(link,link+'/edit',{target:"_BLANK"}),
        'Bild:'+ user._picture,
    ]
    out.forEach(line => {
       appendLine(line);
       $('#msg').val('');
    });
}

function cmdClear(){
    $('#messages').html('');
    $('#msg').val('');
}

function cmdBeep(){
    playAudio(audiofile);
    $('#msg').val('');
}


function showLoader(){
    $.mobile.loading( 'show', {
	text: 'Lade, bitte warten...',
	textVisible: true,
	theme: 'b',
	html: ""
});
};

function hideLoader(){
    $.mobile.loading('hide');
};

function cmdStats(text){
    showLoader();
    //ACHTUNG ASYNC==true!!!
        awri.awriconnect_get_stats().then(function(result){
console.log(stats);
        }).catch(function(err){
            appendLine('Keine Ergebnisse für "'+text+'" gefunden!' ,'red');
            hideLoader();
        });    
    $('#msg').val('');
    }

function cmdSearch(text){
showLoader();
//ACHTUNG ASYNC==true!!!
    awri.awriconnect_search_node(text).then(function(result){
        result.forEach(node => {
        appendLine('<a href="'+node.link+'" target="_BLANK"><strong>'+node.node.nid+'</strong></a> '+node.snippet);
        hideLoader();
    });
    }).catch(function(err){
        appendLine('Keine Ergebnisse für "'+text+'" gefunden!' ,'red');
        hideLoader();
    });    
$('#msg').val('');
}

function cmdShow(nid){
    showLoader();   
    awri.awriconnect_frage_get(nid).then(function(node){      
   
    appendLine(theme_node(node));  
 
   
    awri.awriconnect_comments(nid).then(function(res){
                        appendLine(theme_comments(res)); 
                        hideLoader(); 
                    }); 

                        }).catch(function(err){
                            appendLine('Fehler: "'+err+'" !' ,'red');
                            hideLoader();

}).catch(function(err){
    appendLine('Fehler: "'+err+'" !' ,'red');
    hideLoader();
});

$('#msg').val('');
}

function cmdKick(uid){
    chat.sendCommand('kick',uid);
    $('#msg').val('');
}
function cmdKicks(){
    chat.sendCommand('kicks');
    $('#msg').val('');
}
function cmdUnKick(uid){
    chat.sendCommand('unkick',uid);
    $('#msg').val('');
}


function cmdBan(uid){
    chat.sendCommand('ban',uid);
    $('#msg').val('');
}

function cmdBans(){
    chat.sendCommand('bans');
    $('#msg').val('');
}

function cmdUnBan(ip){
    chat.sendCommand('unban',ip);
    $('#msg').val('');
}

function cmdAdminMsg(text){
    chat.sendCommand('adminmsg',text);
    $('#msg').val('');
}

function cmdWhois(uid){
    chat.sendCommand('whois',uid);
    $('#msg').val('');
}

function cmdLogin(str){
    var cred=str.split(' ');
    console.log(cred);
    var user=cred[0];
    var pass=cred[1];
    awri.awriconnect_login(user,pass).then(function(result){
    location.reload();
    }).catch(function(err){
        console.log(err);
    });
}

function cmdLogout(){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    awri.awriconnect_logout().then(function(result){
        location.reload();
    }).catch(function(err){
        console.log(err);
    });
}


function cmdUploads(page="0"){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    awri.awriconnect_get_files($("#user").attr('uid'),page).then(function(result){
        var files=JSON.parse(result);
        files.forEach(file => {      
            appendLine("<p><strong>["+file.fid+"]</strong></p><p>Dateiname:"+ file.filename+'</p><img src="'+host+'/sites/default/files/attachments/'+file.filename+'" width="100"><p>Dateigrösse:'+(file.filesize/1000)+' Kb</p>');
        });
        $('#msg').val('');
    })
}  


    /*
awri.awriconnect_views_get_view('user/files').then(function(result){
console.log(result.nodes);
var nodes=result.nodes;
nodes.forEach(file => {
    console.log(file.node);
    appendLine(file.node.created+' <img src="'+host+'/sites/default/files/attachments/'+file.node.filename+'" width="100">');
 //   file.node.field_image.forEach(image => {
  //      appendLine(image.src);
        
   // });
});
}).catch(function(err){
        console.log(err);
    });
}
*/


function cmdUpload(){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    showUploadDialog("Datei hochladen").then(function(file){
    showLoader();
        awri.awriconnect_upload_file('upload-preview').then(function(upl){
            console.log(upl,"UPLOAD");
            awri.awriconnect_get_file_by_fid(JSON.parse(upl).fid).then(function(file){
                var image = file.uri.replace('public://',awri.host+"/sites/default/files/");
                appendLine('<strong>ID['+file.fid+']</strong><p><img src="'+image+'" width="200"></p><p>Dateigrösse: '+(image.filesize/1000)+' Kb</p>')
            })
        }).catch(function(err){
            appendLine("Datei wurde nicht gefunden.","red")
        hideLoader();
        });
    hideLoader();
    });    
}

function cmdshowImage(params){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");

    var param=params.split(' ');
    var msg=new ChatMessage();
    if(!param[1]){
        awri.awriconnect_get_file_by_fid(param[0]).then(function(image){
            msg.setFrom($("#user").attr("uid"));
            var file=image.uri.replace("public://",host+"/sites/default/files/");
            msg.setText('<strong>Datei ID:['+image.fid+']</strong><p><img src="'+file+'"></p><p>Dateigrösse: '+(image.filesize/1000)+' Kb</p>');
            appendMessage(msg);
        });
        return;
    }
         awri.awriconnect_get_file_by_fid(param[0]).then(function(image){
        msg.setFrom($("#user").attr("uid"));
        var file=image.uri.replace("public://",host+"/sites/default/files/");
        msg.setText('<strong>Datei ID:['+image.fid+']</strong><p><img src="'+file+'"></p><p>Dateigrösse: '+(image.filesize/1000)+' Kb</p>');
        chat.sendPrivateMessage(param[1],msg);
    });
}

function cmdshowContent(params){
    var param=params.split(' ');
    var msg=new ChatMessage();
    msg.setFrom($("#user").attr("uid"));
    msg.setText('show content'+param[0]);
    chat.sendPrivateCommand(param[1],msg);     
    $('#msg').val('');
/*
var param=params.split(' ');
    awri.awriconnect_frage_get(param[0]).then(function(node){
        msg.setFrom($("#user").attr("uid"));
        msg.setText(theme_node(node));
            awri.awriconnect_comments(param[0]).then(function(comments){                        
                msg.setText(msg._txt+theme_comments(comments));
                chat.sendPrivateCommand(param[1],msg);     
            }); 
    });
    */
}

function cmdBookmarks(page=0){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    showLoader();   
    awri.awriconnect_bookmarks($("#user").attr("uid"),page).then(function(result){      
   //console.log(result);
   appendLine(theme_bookmarks(result.nodes));  
    hideLoader();
}).catch(function(err){
    appendLine('Fehler: "'+err+'" !' ,'red');
    hideLoader();
});

$('#msg').val('');
}

function cmdAddBookmark(nid){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    showLoader();   
    awri.awriconnect_bookmark_action('bookmarks',nid,"flag").then(function(result){      
   console.log(result);
   if(result[0]==true)appendLine("Der Beitrag mit der ID["+nid+"] wurde zu den Lesezeichen hinzugefügt!","green")

   hideLoader();
}).catch(function(err){
    appendLine('Fehler: "'+err+'" !' ,'red');
    hideLoader();
});
$('#msg').val('');
}

function cmdDelBookmark(nid){
    if(!user_has_role(variable_get("user"),'authenticated user')) 
    return appendLine('<small> '+getFormattedDate(Date.now())+'</small>: <img src="img/logo_blank_50x50.png" width="20" height="20"> Server: Sie sind kein AWRI Mitglied, bitte melden sie sich bei '+l("AWRI","https://awri.ch",{target:"_BLANK"})+' an!',"red");
    
    showLoader();   
    awri.awriconnect_bookmark_action('bookmarks',nid,"unflag").then(function(result){      
   console.log(result);
   if(result[0]==true)appendLine("Der Beitrag mit der ID["+nid+"] wurde aus den Lesezeichen entfernt!","red")
    hideLoader();
}).catch(function(err){
    appendLine('Fehler: "'+err+'" !' ,'red');
    hideLoader();
});
$('#msg').val('');
}


function cmdNews(){
    showLoader();
    //ACHTUNG ASYNC==true!!!
//    awriconnect_fragen_index(page=0,fields,parameters=null,page_size=null,options="options[orderby][cerated]=desc")           

        awri.awriconnect_fragen_index(0,'nid',null,3).then(function(result){
            result.forEach(node => {
            console.log(node);
            awri.awriconnect_frage_get(node.nid).then(function(node){
                appendLine(theme_node(node));
                hideLoader();                
            });                
        });        
        }).catch(function(err){
            appendLine('Keine News gefunden!' ,'red');
            hideLoader();
        });    
    $('#msg').val('');
    }