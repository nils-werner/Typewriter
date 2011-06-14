var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var sync = this.controller.args.sync;
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	
	fs.readdir("/media/internal/Typewriter/", function(err, files) {
		if(sync) {
			var dropbox = new DropboxClient(ctoken, csecret, token, secret);
			dropbox.getMetadata("Typewriter/", function (err, data) {
				for(var i in data.contents) {
					files.push(data.contents[i].path.basename());
				}
				files = files.unique();
				future.result = { err: err, files: files};
			});
		}
		else {
			future.result = { err: err, files: files };
		}
	});
}
