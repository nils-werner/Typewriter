var SyncStatAssistant = function() {
}

SyncStatAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var name = this.controller.args.name;
	
	var files = [];
	
	fs.stat("/media/internal/Typewriter/" + name, function(err, stats) {
		files.push({ filename: name, type: "local", mtime: Date.parse(stats.mtime) });
	});
	
	dropbox.getMetadata("Typewriter/" + name, function (err, data) {
		data.contents.forEach(function(item) {
			files.push({ filename: item.path.basename(), type: "remote", mtime: Date.parse(item.modified) });
		});
	});
}
