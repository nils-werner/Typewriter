var SyncStatAssistant = function() {
}

SyncStatAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var filename = this.controller.args.filename;
	
	var response = {};
	var count = 0;
	
	fs.stat("/media/internal/Typewriter/" + filename, function(err, stats) {
		response["local"] = {err: err, stats: stats};
		count++;
		if(count == 2) future.result = response;
	});
	
	dropbox.getMetadata("Typewriter/" + filename, function (err, stats) {
		response["remote"] = {err: err, stats: stats};
		count++;
		if(count == 2) future.result = response;
	});
}
