var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	var fs = IMPORTS.require("fs");
	
	future.result = { files: fs.readdirSync("/media/internal/Typewriter/") };
}
