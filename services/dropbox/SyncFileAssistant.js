var SyncFileAssistant = function() {
}

SyncFileAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var filename = this.controller.args.filename;
	var action = this.controller.args.action;

	if(action == "pull") {
		dropbox.getFile("Typewriter/" + filename, function (err, data) { 
			fs.writeFile("/media/internal/Typewriter/" + filename, data, 'utf8', function(err) { future.result = { err: err, action: action, filename: filename }; });
		});
	}
	else if(action == "push") {
		dropbox.putFile("/media/internal/Typewriter/" + filename, "Typewriter/", function (err, data) { future.result = { err: err, action: action, filename: filename }; });
	}
}
