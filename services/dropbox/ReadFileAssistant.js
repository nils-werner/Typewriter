var ReadFileAssistant = function() {
}

ReadFileAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var name = this.controller.args.name;
	
	dropbox.getFile("Typewriter/" + name, function (err, data) { 
		fs.writeFile("/media/internal/Typewriter/" + name, data, 'utf8', function(err) { future.result = { err: err, name: name, data: data}; });
	});
}
