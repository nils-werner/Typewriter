if (typeof require === "undefined") {
	require = IMPORTS.require;
}

require.paths.unshift(__dirname + '/lib/dropbox-node/lib/');
require.paths.unshift(__dirname + '/lib/oauth-node/lib/');

DropboxClient = require('dropbox-node').DropboxClient;
dropbox = new DropboxClient("xr03hokoazn32zx", "3ej0el462uohasn");
