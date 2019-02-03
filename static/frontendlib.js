//ajax shortcut
function ajaxRequest(path,requestType,contentType,request,callback){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
			};
	}
	xhr.open(requestType,path, true);
	xhr.setRequestHeader("Content-type",contentType);
	if(contentType=="application/json"){xhr.send(JSON.stringify(request));}
	else{xhr.send(request);}
	}
