var ReadFileAssistant = function() {
}

ReadFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var filename = this.controller.args.filename;
	
	fs.readFile("/media/internal/Typewriter/" + filename, 'utf8', function(err,data) { future.result = { err: err, filename: filename, content: data }; });
}
