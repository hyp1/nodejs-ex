function theme_kicks(kicks){
    var n='<ul id="kicks">';
    kicks.forEach(function(kick) {
        n+='<li>'+getFormattedDate(kick.time)+' '+kick.to+'</li>';
    });
    n+='</ul>';
return n;
}
function theme_bans(bans){
    var n='<ul id="bans">';
            bans.forEach(function(ban) {
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
marks.forEach(function(bookmark) {
 var btn='<a title="Beitrag ansehen" class="ui-link ui-btn ui-icon-eye ui-btn-icon-notext ui-corner-all" href="#" onclick="cmdShow('+bookmark.node.nid+')" data-role="icon" title="Beitrag ansehen">👁️</a>';
 
    appendLine(btn+"<h2>"+bookmark.node.nid+"</h2> "+bookmark.node.created+" "+theme_fb_image(bookmark.node.fbid)+" "+bookmark.node.fbname+"<br>"+bookmark.node.title);
});
}

function theme_user_roles(roles){
let k=Object.keys(roles);
var ret="<ul>";  
k.forEach(function(role) {
     if(roles[role]=="administrator")ret+="<li>⚔️"+roles[role]+"</li>";
     else
     if(roles[role]=="moderator")ret+="<li>🛡️"+roles[role]+"</li>";
     else ret+="<li>"+roles[role]+"</li>";
 });
 ret+="</ul>";
return ret;
}

function theme_node(node){
   var n='<h1>'+node.nid+'<a id="bookmark-nid-'+node.nid+'" class="ui-link ui-btn ui-icon-tag ui-btn-icon-notext ui-corner-all"></a></h1>';
   awri.awriconnect_is_bookmark("bookmarks",node.nid).then(function(res){
    if(res[0]==true){
       // alert("NID:"+node.nid)
        $('#bookmark-nid-'+node.nid).addClass("ui-btn-active");   
    }
        console.log(res,"is_bookmark");
   });
  var images="";
  if(typeof node.field_image.und!=='undefined')node.field_image['und'].forEach(function(img) {
      images+='<p><img src="'+get_image_path(img.uri)+'"></p>'
  });
   if(node.field_fbid) n+='<h2>'+theme_fb_image(node.field_fbid['und'][0].value)+'&nbsp;&nbsp;&nbsp;'+node.field_fbname['und'][0].value+'</h2>';
   n+='<h3>'+node.body['und'][0].safe_value+'</h3>'+images;
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
  // console.log(comments,"Comemnts");
//        var c='<button id="comment-btn-'+comments[0].nid+'" onclick="toggleComments('+comments[0].nid+');">+</button><div style="display:none;" id="comments-'+comments[0].nid+'">'
   var c='<a id="icon-'+comments[0].nid+'" onclick="toggleComments('+comments[0].nid+')" href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-b ui-btn-inline">Plus</a><div style="display:none;" id="comments-'+comments[0].nid+'">'
   comments.forEach(function(comment) {
       c+='<span><strong>'+comment.subject+'</strong>'
       c+=''+comment.comment_body['und'][0].safe_value+'</span>'

   });
c+="</div>";
return c;
}


function get_image_path(uri) {
    var image = uri.replace('public://',awri.host+"/sites/default/files/");
    return image;
}


$.mobile.changeGlobalTheme = function(theme)
{
    // These themes will be cleared, add more
    // swatch letters as needed.
    var themes = " a b c d e";

    // Updates the theme for all elements that match the
    // CSS selector with the specified theme class.
    function setTheme(cssSelector, themeClass, theme)
    {
        $(cssSelector)
            .removeClass(themes.split(" ").join(" " + themeClass + "-"))
            .addClass(themeClass + "-" + theme)
            .attr("data-theme", theme);
    }

    // Add more selectors/theme classes as needed.
    setTheme(".ui-mobile-viewport", "ui-overlay", theme);
    setTheme("[data-role='page']", "ui-body", theme);
    setTheme("[data-role='header']", "ui-bar", theme);
    setTheme("[data-role='listview'] > li", "ui-bar", theme);
    setTheme(".ui-btn", "ui-btn-up", theme);
    setTheme(".ui-btn", "ui-btn-hover", theme);
};