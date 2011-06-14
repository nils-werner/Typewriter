var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	dropbox.getMetadata("Typewriter/", function (err, data) { future.result = { err: err, data: data}; });
}
