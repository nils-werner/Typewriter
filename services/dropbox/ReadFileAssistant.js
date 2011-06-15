var ReadFileAssistant = function() {
}

ReadFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var name = this.controller.args.name;
	var sync = this.controller.args.sync;
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	
	if(sync) {
		var dropbox = new DropboxClient(ctoken, csecret, token, secret);
		fs.stat("/media/internal/Typewriter/" + name, function(err, stats) {
			dropbox.getMetadata("Typewriter/" + name, function (err, data) {
				var ltime = Date.parse(stats.mtime);
				var rtime = Date.parse(data.modified);
				if(ltime < rtime) {
					dropbox.getFile("Typewriter/" + name, function (err, data) { 
						fs.writeFile("/media/internal/Typewriter/" + name, data, 'utf8', function(err) { future.result = { err: err, name: name, data: data, ltime: ltime, rtime: rtime}; });
					});
				}
			});
		});
	}
	else {
		fs.readFile("/media/internal/Typewriter/" + name, 'utf8', function(err,data) { future.result = { err: err, name: name, data: data }; });
	}
}
