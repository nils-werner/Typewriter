var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var name = this.controller.args.name;
	var content = this.controller.args.content
	var sync = this.controller.args.sync;
	
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	fs.writeFile("/media/internal/Typewriter/" + name, content, 'utf8', function(err) {
		if(sync) {
			dropbox = new DropboxClient(ctoken, csecret, token, secret);
			dropbox.putFile("/media/internal/Typewriter/" + name, "Typewriter/", function (err, data) { future.result = { err: err }; });
		}
		else {
			future.result = { err: err };
		}
	});
}
