var CheckAccessAssistant = function() {
}

CheckAccessAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var response = {};
	var count = 0;
	
	fs.stat("/media/internal/Typewriter/", function(err, stats) {
		if(err) {
			fs.mkdir("/media/internal/Typewriter/", 511, function(err) {
				response["local"] = {err: err, stats: stats};
				count++;
				if(count == 2) future.result = response;
			});
		}
		else {
			response["local"] = {err: err, stats: stats};
			count++;
			if(count == 2) future.result = response;
		}
	});
	
	dropbox.getMetadata("Typewriter/", function (err, stats) {
		if(err || stats.is_deleted) {
			dropbox.createFolder("Typewriter/", function(err) {
				response["remote"] = {err: err, stats: stats};
				count++;
				if(count == 2) future.result = response;
			});
		}
		else {
			response["remote"] = {err: err, stats: stats};
			count++;
			if(count == 2) future.result = response;
		}
	});
}
