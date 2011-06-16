var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	var files = [];
	
	fs.readdir("/media/internal/Typewriter/", function(err, data) {
		future.result = { err: err, files: data };
	});
}
