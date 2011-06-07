var WriteFileAssistant = function() {
}

WriteFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	//this.controller.args.name
	//this.controller.args.content
	
	future.result = { name: this.controller.args.name, bytes: fs.writeSync("/media/internal/Typewriter/" + this.controller.args.name, this.controller.args.content, 'utf8') };
}
