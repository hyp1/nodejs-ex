function theme_kicks(kicks){
    var n='<ul id="kicks">';
    kicks.forEach(kick => {
        n+='<li>'+getFormattedDate(kick.time)+' '+kick.to+'</li>';
    });
    n+='</ul>';
return n;
}
function theme_bans(bans){
    var n='<ul id="bans">';
            bans.forEach(ban => {
        n+='<li>'+getFormattedDate(ban.time)+' '+ban.to+' '+ban.ip+'</li>';
    });
    n+='</ul>';
return n;
}

function theme_user(user){
   var n='<h3>'+theme_user_picture(user._picture)+' '+user._name+'</h3>';
   n+='<p>AWRI ID:'+user._uid+'</p>';
   n+='<p>IP Adresse:'+user._ip+'</p>';
   n+='<p>FBID:'+user._fbid+'</p>';
   n+='<p>Email:'+user._email+'</p>';
   n+='<p>Online seit:'+getFormattedDate(user._time)+'</p>';
   n+='<p>Beigetreten:'+getFormattedDate(user._created*1000)+'</p>';
   n+='<p>Letzes Login:'+getFormattedDate(user._access*1000)+'</p>';          
   n+='<p>Benutzer Rollen:'+theme_user_roles(user._roles)+'</p>';
   return n;
}

function theme_bookmarks(marks){
console.log(marks,"MARKS");
marks.forEach(bookmark => {
    appendLine("<strong>["+bookmark.node.nid+"]</strong> "+bookmark.node.created+" "+theme_fb_image(bookmark.node.fbid)+" "+bookmark.node.fbname+"<br>"+bookmark.node.title);
});
}

function theme_user_roles(roles){
let k=Object.keys(roles);
var ret="<ul>";  
k.forEach(role => {
     if(roles[role]=="administrator")ret+="<li>⚔️"+roles[role]+"</li>";
     else
     if(roles[role]=="moderator")ret+="<li>🛡️"+roles[role]+"</li>";
     else ret+="<li>"+roles[role]+"</li>";
 });
 ret+="</ul>";
return ret;
}
function theme_node(node){
   var n='<h1>'+node.nid+'</h1>';
  if(node.field_fbid) n+='<h2>'+theme_fb_image(node.field_fbid['und'][0].value)+node.field_fbname['und'][0].value+'</h2>';
   n+='<p>'+node.body['und'][0].safe_value+'</p>';
   return n;
}
function theme_user_picture(pic){
   return '<img src="'+pic+'" width="20" height="20" style="vertical-align:middle;border-radius:10px;"/>';
}

function theme_fb_image(fbid){
   return '<img style="vertical-align:middle;border-radius:50%;" src="https://graph.facebook.com/'+fbid+'/picture?type=small"/>';
}

function theme_comments(comments){
   if(comments.length<1)return;
   console.log(comments,"Comemnts");
//        var c='<button id="comment-btn-'+comments[0].nid+'" onclick="toggleComments('+comments[0].nid+');">+</button><div style="display:none;" id="comments-'+comments[0].nid+'">'
   var c='<a id="icon-'+comments[0].nid+'" onclick="toggleComments('+comments[0].nid+')" href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-b ui-btn-inline">Plus</a><div style="display:none;" id="comments-'+comments[0].nid+'">'
   comments.forEach(comment => {
       console.log(comment,"c");
       c+='<span><strong>'+comment.subject+'</strong>'
       c+=''+comment.comment_body['und'][0].safe_value+'</span>'

   });
c+="</div>";
return c;
}

//ACHTUNG DIE einzige THEME Funktion 
function theme_user_picture(pic){
    return '<img src="'+pic+'" width="20" height="20" style="vertical-align:middle;border-radius:10px;"/>';
}