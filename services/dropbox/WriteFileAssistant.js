var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var name = this.controller.args.name;
	
	dropbox.putFile("/media/internal/Typewriter/" + name, "Typewriter/", function (err, data) { future.result = { err: err, data: data}; });
}
