var SyncFileAssistant = function() {
}

SyncFileAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var name = this.controller.args.name;
	var action = this.controller.args.action;

	if(action == "pull") {
		dropbox.getFile("Typewriter/" + name, function (err, data) { 
			fs.writeFile("/media/internal/Typewriter/" + name, data, 'utf8', function(err) { future.result = { err: err, action: action }; });
		});
	}
	else if(action == "push") {
		dropbox.putFile("/media/internal/Typewriter/" + name, "Typewriter/", function (err, data) { future.result = { err: err, action: action }; });
	}
}
