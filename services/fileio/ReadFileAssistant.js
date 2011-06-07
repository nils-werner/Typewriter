var ReadFileAssistant = function() {
}

ReadFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	//this.controller.args.name
	
	future.result = { name: this.controller.args.name, content: fs.readFileSync("/media/internal/Typewriter/" + this.controller.args.name, 'utf8') };
}
