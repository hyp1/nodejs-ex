Drupal.settings.site_path = "https://awri.ch";
Drupal.settings.endpoint = "drupalgap";
Drupal.settings.file_public_path = 'sites/default/files';
Drupal.settings.timeout=3000;

//Drupal.settings.file_private_path = 'system/files';




function showLoader(){
    log('showLoader','show<br/>');
    $.mobile.loading( "show", {
  text: "Lade bitte warten",
  textVisible: true,
  theme: "b",
  html: ""
});
}

function hideLoader(){
    log('hideLoader','hide<br/>');
    $.mobile.loading( "hide");
}


/*
 * Lädt eine custom view (JSONoutput) und zeigt Resultate mit pager in div view
 */
function loadView(viewpath,page){
	$("#scroll-content").html('<div style="margin-left:auto;margin-right:auto;" class="loader"></div>');	
	$.getJSON(Drupal.settings.site_path+'/'+viewpath+'?page='+page,
	function(data) {
		html='<h2 style="margin-left:auto;margin-right:auto;text-align:center;">' +(1+page)+'/'+data.view.pages+'</h2>';
		
		for(i=0;i<data.nodes.length;i++){
					var node=data.nodes[i].node;
					var score=node.field_bewertung;
				
					var imgfield=node.field_image;
					//alert(imgfield.length);
					var images='';
					if(imgfield){
						for(i=0;i<imgfield.length;i++)images+='<p><img style="width:100%;" src="'+imgfield[i].src+'"><p>';
					}
				
					console.log(imgfield);
					if(score)rating=score;
					else rating=0;
					//rating=0;
					var icon='';
					if(node.comment_count>0)icon='<a id="icon-'+node.nid+'" onclick="toggleComments('+node.nid+')" href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-b ui-btn-inline">Plus</a>'+node.comment_count+' Kommentare, '+rating+'';
					
					if(Drupal.user.uid>0)html+='<p><img style="vertical-align:middle;border-radius: 50%;" src="https://graph.facebook.com/'+node.field_fbid+'/picture"/>&nbsp;&nbsp;&nbsp;<span>'+node.field_fbname+' - <small>'+date(node.created)+'</small></span><p>';
						else
					html+='<p><small>'+date(node.created)+'</small> - <a href="'+Drupal.settings.site_path+'" target="_new">Bitte anmelden!</a></p>';
					html+='<h3 class="rechtsfrage"><a id="goto" style="text-decoration:none; color:black;" href="'+Drupal.settings.site_path+'/node/'+node.nid+'">'+node.body+'</a></h3>'+images;
					html+=icon+'<ol style="display:none;" class="comments" init="false" id="comments-'+node.nid+'"></ol>';
				  	}	
		
		html+='<div id="pager" style="width:100%;" data-role="controlgroup" data-type="horizontal">';
		  if(page>0)html+='<input id="fback" class="ui-btn" style="float:left;" type="button" onclick="loadView(\'awrimobile/fragen\','+(0)+');" value="<<"/><input id="back" class="ui-btn" style="float:left;" type="button" onclick="loadView(\'awrimobile/fragen\','+(page-1)+');" value="&nbsp;&lt;&nbsp;"></input>';
			
		  if(page<data.view.pages-1)html+='<input id="fnext" class="ui-btn" style="float:right;" type="button" onclick="loadView(\'awrimobile/fragen\','+(data.view.pages-1)+');" value=">>"/><input id="next" class="ui-btn" style="float:right;" type="button" onclick="loadView(\'awrimobile/fragen\','+(page+1)+');" value="&nbsp;&gt;&nbsp"></input>';
		  
		  html+='<button id="random" class="ui-btn ui-icon-random ui-btn-icon-notext ui-shadow" style="margin-left:auto;margin-right:auto;" type="button" onclick="loadView(\'awrimobile/fragen\','+(Math.floor((Math.random() * data.view.pages)))+');" value="?"></button>';
			
		  html+='</div>';  
		  $("#scroll-content").html(html);					  
	});
}


/*
 * Benutzt drupalgap node retrieve und zeigt Resultate in div content
 */
function loadNode(nid){	
	node_load(nid,{success: function(result){
		$("#content").text("");
		    $("#content").append(result.title+ result.body['und'][0].value);
	},error: function(result){
		$("#content").text("<strong>Fehler beim laden:</strong> Fehler "+result);
	}});
}


/*
 * Benutzt services search und zeigt Resultate in div result
 */
function dosearch(){
	var search=$('#search').val();
	if(search.length<3){
		$("#result").html('<strong>Die Sucheingabe ist zu kurz...!</strong>');
		$("#search").focus();
	return;
	}
	$("#result").html("<h3>Suche nach: '<strong>"+search+"</strong>', bitte warten... <div style='margin-left:auto;margin-right:auto;text-align:center;' class='loader'></div><h3>");
	$.getJSON(Drupal.settings.site_path+'/'+Drupal.settings.endpoint+'/search_node/retrieve.json?keys='+search,
		function(data) {
			  $("#result").text('');			
			  for(i=0;i<data.length;i++){
				  var node=data[i].node;		  
				  var datum=date('j.m.Y h:i',(node.created*1000));
				  var li = document.createElement("li");				  
				  if(Drupal.user.uid==0)
				  li.innerHTML='<h2 id="login"><a href="'+Drupal.settings.site_path+'/node/'+node.nid+'" target="_new">Bitte anmelden!</a> - <small>'+date(datum)+'</small></h2>';		
				  else 
				  li.innerHTML='<h2 id="name"><img style="vertical-align:middle;border-radius: 50%;" src="https://graph.facebook.com/'+node.field_fbid['und'][0].value+'/picture"/>&nbsp;&nbsp;&nbsp;'+node.field_fbname['und'][0].value+' - <small>'+date(datum)+'</small></h2>';
				  li.innerHTML+='<h2><a style="text-decoration:none; color:black;" href="'+data[i].link+'">'+node.title+'</a></h2>';			
				  li.innerHTML+='<p><a style="text-decoration:none; color:black;" href="'+data[i].link+'">'+(data[i].snippet)+'</a><br/><small>'+data[i].extra.comment+' '+parseFloat(data[i].score).toFixed(2)+' Suchrelevanz</small></p>';
				  $("#result").append(li);
			  }		 
		}).error(function(err) { $("#result").html('<p>Leider nichts gefunden: <strong>Fehler ' + err.status+'</strong></p>');
$("#search").focus();
 });
}

function loadStats(){
	$.getJSON(Drupal.settings.site_path+'/stats.txt?'+time(),
			function(data) {
		$("#users").text(data.users);
		$("#questions").text(data.nodes);
		$("#answers").text(data.comments);
		$("#stats").text(" "+data.updated);					  
			});
	
}


function getComments(nid){

	var query = {
			pagesize:150,
			parameters: {
			  'nid': nid,
			  'status': 1,
			},
	//		fields: ['cid','subject','created','status'],
//			options:{'orderby':{'created':'asc'}},
//			contentType:'text/xml'
	};	
	
		comment_index(query,{success: function(result){
	//		console.log(result,'loadComment:'+nid);
			for(i=0; i<result.length;i++  ){
				//console.log(elem);
				//console.log(result[i]);
			if(result[i].cid)	loadComment(result[i].cid,query.parameters.nid);
//elem.append(result[i].subject);
			}
		},error: function(result){
			console.log(result,'loadComment:Error');

		}});
}
// element comment-nid
function loadComment(cid,nid){

	comment_load(cid,{'nid':nid,success: function(result){
//		console.log(cid,'loadComment:'+cid);
//		console.log(result);
	     // var img='<h3><img style="vertical-align:middle;border-radius: 50%;" src="https://graph.facebook.com/'+result.field_fbid['und'][0].value+'/picture">'+result.subject+'</h3>';
	  	
		if(result.comment_body){
		
			//	alert(nid);
		li=document.createElement("li");
		if(Drupal.user.uid==0)li.innerHTML='<h3>Bitte anmelden um die Antworten zu sehen:> <a href="https://awri.ch/user"><strong>Anmelden</strong></a></h3>';	
		else 
		li.innerHTML='<h3><small>'+date('d.m.Y h:i',(result.created*1000))+' </small> ' +result.subject+'</h3><h4>'+result.comment_body['und'][0]['safe_value']+'</h4>';	
		elem=document.getElementById('comments-'+nid);
	//	alert(elem);
		//alert(li);
			elem.appendChild(li);
		//	elem.style.display='block';
		}
		
	//	console.log(result,'loadComment:'+cid);

	},error: function(result){
		console.log(result,'loadComment:Error');

	}});
}


function toggleComments(nid){
	elem=document.getElementById("comments-"+nid);
	icon=document.getElementById("icon-"+nid);
	
	if(elem.getAttribute("init")==="false"){
		getComments(nid);
		elem.setAttribute("init","true");
	}
	
	if (elem.style.display === 'none') {
        elem.style.display = 'block';
        icon.setAttribute("class","ui-btn ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext ui-btn-b ui-btn-inline");
        
    } else {
        elem.style.display = 'none';
		icon.setAttribute("class","ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-b ui-btn-inline");
    }
 	 	
};



function get_image_path(uri) {
	  try {
	      var src = Drupal.settings.site_path + Drupal.settings.base_path + uri;

	      if (src.indexOf('public://') != -1) {
	        src = src.replace('public://', Drupal.settings.file_public_path + '/');
	        return src;
	      }
	      else if (src.indexOf('private://') != -1) {
	        src = src.replace(
	          'private://',
	          Drupal.settings.file_private_path + '/'
	        );	     
	      return src;
	    }	 
	  }
	  catch (error) { console.log('get_image_path - ' + error); }
	}

function getImages(imagefield){
var images='';
if(imagefield){
	   for(i=0;i<imagefield.length;i++){	
		   var file=get_image_path(imagefield[i]['uri']);
		   images+='<p><img style="max-width:100%;" src="'+file+'"/></p>';
	   }
}
return images;
}