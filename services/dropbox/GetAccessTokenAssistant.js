var GetAccessTokenAssistant = function() {
}

GetAccessTokenAssistant.prototype.run = function(future) {
	var email = this.controller.args.email;
	var password = this.controller.args.password;
	var ctoken = this.controller.args.ctoken;
	var csecret = this.controller.args.csecret;
	
	dropbox = new DropboxClient(ctoken, csecret);
	
	dropbox.getAccessToken(email, password, function (err, token, secret) { future.result = { err: err, token: token, secret: secret}; });
}
