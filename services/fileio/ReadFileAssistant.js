var ReadFileAssistant = function() {
}

ReadFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var name = this.controller.args.name
	
	fs.readFile("/media/internal/Typewriter/" + this.controller.args.name, 'utf8', function(err,data) { future.result = { name: name, content: data }; });
}
