var ReadDirAssistant = function() {
}

ReadDirAssistant.prototype.run = function(future) {
	
	dropbox.getMetadata("Typewriter/", function (err, data) { future.result = { err: err, data: data}; });
}
