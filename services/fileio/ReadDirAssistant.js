var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	fs.readdir("/media/internal/Typewriter/", function(err, files) { future.result = { files: files }; });
}
