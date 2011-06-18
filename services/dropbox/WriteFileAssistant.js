var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var filename = this.controller.args.filename;
	var content = this.controller.args.content
	
	fs.writeFile("/media/internal/Typewriter/" + filename, content, 'utf8', function(err) { future.result = { err: err, filename: filename }; });
}
