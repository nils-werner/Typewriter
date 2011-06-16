var SyncAssistant = function() {
}

SyncAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	var dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var files = [];
	
	this.fetchLocalFiles();
}

SyncAssistant.prototype.fetchLocalFiles = function() {
	fs.readdir("/media/internal/Typewriter/", function(err, data) {
		data.forEach(function(filename) {
			fs.stat("/media/internal/Typewriter/" + filename.basename(), function(err, stats) {
				files.push({ filename: filename.basename(), type: "local", mtime: Date.parse(stats.mtime) });
			});
		});
	});
	
	dropbox.getMetadata("Typewriter/", function (err, data) {
		console.log(JSON.stringify(data.contents));
		data.contents.forEach(function(item) {
			files.push({ filename: item.path.basename(), type: "remote", mtime: Date.parse(item.modified) });
		});
	});
}

SyncAssistant.prototype.fetchRemoteFiles = function() {

}

SyncAssistant.prototype.findSyncCandidates = function() {
	files
}
