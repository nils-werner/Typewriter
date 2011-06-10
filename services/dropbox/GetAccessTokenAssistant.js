var GetAccessTokenAssistant = function() {
}

GetAccessTokenAssistant.prototype.run = function(future) {
	var email = this.controller.args.email;
	var password = this.controller.args.password;
	
	dropbox.getAccessToken(email, password, function (err, token, secret) { future.result = { err: err, token: token, secret: secret}; });
}
