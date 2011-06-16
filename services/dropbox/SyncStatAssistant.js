var SyncStatAssistant = function() {
}

SyncStatAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var name = this.controller.args.name;
	
	var response = {};
	var count = 0;
	
	fs.stat("/media/internal/Typewriter/" + name, function(err, stats) {
		response["local"] = {err: err, stats: stats};
		count++;
		if(count == 2) future.result = response;
	});
	
	dropbox.getMetadata("Typewriter/" + name, function (err, data) {
		response["remote"] = {err: err, data: data};
		count++;
		if(count == 2) future.result = response;
	});
}
