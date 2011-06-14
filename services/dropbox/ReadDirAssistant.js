var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var sync = this.controller.args.sync;
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	var files = [];
	
	
	fs.readdir("/media/internal/Typewriter/", function(err, data) {
		for(var i = 0; i < data.length; i++) {
			files.push(data[i].basename());
		}
		if(sync) {
			var dropbox = new DropboxClient(ctoken, csecret, token, secret);
			dropbox.getMetadata("Typewriter/", function (err, data) {
				console.log(JSON.stringify(data.contents));
				for(var i = 0; i < data.contents.length; i++) {
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
