var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var name = this.controller.args.name;
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	var token = this.controller.args.token;
	var secret = this.controller.args.secret;
	
	dropbox = new DropboxClient(ctoken, csecret, token, secret);
	
	dropbox.putFile("/media/internal/Typewriter/" + name, "Typewriter/", function (err, data) { future.result = { err: err, data: data}; });
}
