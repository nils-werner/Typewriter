var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var name = this.controller.args.name;
	var content = this.controller.args.content
	
	fs.writeFile("/media/internal/Typewriter/" + name, content, 'utf8', function(err) { future.result = { err: err }; });
}
