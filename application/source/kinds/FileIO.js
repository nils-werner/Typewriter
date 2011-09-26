enyo.kind({
	name: "FileIO",
	kind: enyo.Control,
	published: {
		token: "",
		secret: "",
		remoteDir: "Typewriter/",
		localDir: "/media/internal/Typewriter/"
	},
	filename: "",
	files: [],
	ctoken: "job7vwzo1jhcdcn",
	csecret: "b1bodocolg7ajbt",
	lastContent: "",
	validfile: false,
	isonline: true,
	events: {
		onOpened: "",
		onSaved: "",
		onDirRead: "",
		onPushed: "",
		onFetched: "",
		onLogin: ""
	},
	components: [
		{
			name: "dropbox",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriterbeta.dropbox/",
			subscribe: true,
			timeout: 10000
		},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"center", pack:"center", components: [
			{kind: "SpinnerLarge"}
		]},
		{kind: "NewFileDialog", onSubmit: "handleNewFile"},
		{kind: "ResolveDialog", onSubmit: "handleResolve"},
		{kind: "LoginDialog", onSubmit: "handleLoginForm"}
	],
	
	/*
	 * NEW DOCUMENT
	 */
	 
	createNew: function(inSender, inEvent) {
		this.$.newFileDialog.openAtCenter();
	},
	
	handleNewFile: function(inSender, inResponse) {
		this.$.newFileDialog.close();
		this.filename = inResponse.filename;
		
		this.cleanFilename();
		
		this.filename = this.filename + ".md";
		this.lastContent = "";
		this.doOpened({ err: null, content: inResponse.filename + "\n" + new String("=").repeat(inResponse.filename.length) + "\n\n", filename: this.filename});
		this.validfile = true;
	},
	
	/*
	 * WRITING
	 */
	
	saveFile: function(inContent) {
		if(this.validfile && this.lastContent != inContent && this.filename != "" && this.filename != ".md") {
			console.log("saving " + this.filename);
			this.$.dropbox.call({filename: this.filename, content: inContent}, {method:"writefile", onResponse: "handleSaved"});
			this.lastContent = inContent;
		}
	},
	
	handleSaved: function(inEvent, inResponse) {
		console.log(inResponse.err);
		
		if(inResponse.err) {
			enyo.windows.addBannerMessage(new enyo.g11n.Template($L("Could not save #{name}")).evaluate({name: this.filename.basename(".md") }), "{}");
		}
		
		this.doSaved({err: inResponse.err});
	},
	
	
	/*
	 * READING
	 */
	
	readFile: function(inName) {
		this.validfile = false;
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		this.$.dropbox.call({filename: this.filename}, {method:"readfile", onResponse: "handleReadFile"});
	},
	
	handleReadFile: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		
		this.lastContent = inResponse.content;
		
		if(inResponse.err || inResponse.content == "") {
			enyo.windows.addBannerMessage(new enyo.g11n.Template($L("Could not load #{name}")).evaluate({name: this.filename.basename(".md") }), "{}");
			this.filename = "";
			enyo.setCookie("lastfile", "");
			this.validfile = false;
		}
		else {
			this.$.scrim.hide();
			this.validfile = true;
		}
		
		this.doOpened({ err: inResponse.err, content: inResponse.content, filename: inResponse.filename});
	},
	
	
	/*
	 * FILE SYNCING
	 */
	 
	syncFile: function() {
		if(!this.isLoggedIn()) {
			this.login();
		}
		else {
			if(this.filename == "") {
				enyo.windows.addBannerMessage($L("Cannot share Demo-Document with Dropbox"), "{}");
			}
			else {
				this.$.spinnerLarge.show();
				this.$.scrim.show();
			
				this.$.dropbox.call({filename: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncstat", onResponse: "handleStat"});
			}
			
		}
	},
	
	handleStat: function(inSender, inResponse) {
		var action = "";
		
		if(inResponse.remote.err) {
			if(inResponse.remote.err.statusCode == 404)
				action = "push";
			else {
				enyo.windows.addBannerMessage($L("Dropbox-Stat failed"), "{}");
				this.$.spinnerLarge.hide();
				this.$.scrim.hide();
			}
		}
		else if(inResponse.local.err) {
			action = "pull";
		}
		else {
			ltime = Date.parse(inResponse.local.stats.mtime);
			rtime = Date.parse(inResponse.remote.stats.modified);
			
			var diff = 15*60000;
	
			if(ltime - rtime > diff) {
				console.log("local copy is newer");
				action = "push";
			}
			else if(rtime - ltime > diff) {
				console.log("remote copy is newer");
				action = "pull";
			}
			else {
				console.log("mergeconflict");
				this.$.resolveDialog.openAtCenter();
			}
			
			console.log(ltime + " " + rtime + " " + (ltime-rtime));
		}
		
		if(action == "push" || action == "pull") {
			this.handleResolve(inSender, {action: action});
		}
		else if(action == "merge") {
			this.$.resolveDialog.openAtCenter();
		}
	},
	
	handleResolve: function(inSender, inResponse) {
		console.log(inResponse.action);
		this.$.resolveDialog.close();
		
		if(inResponse.action != "cancel") {
			this.$.dropbox.call({filename: this.filename, action: inResponse.action, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncfile", onResponse: "handleSync"});
		}
		else {
			this.$.spinnerLarge.hide();
			this.$.scrim.hide();
		}
	},
	
	handleSync: function(inSender, inResponse) {
		
		if(inResponse.err)
			var msg = "failed";
		else
			var msg = "finished";
		
		if(inResponse.action == "pull")
			enyo.windows.addBannerMessage(new enyo.g11n.Template($L("Download from Dropbox #{message}")).evaluate({message: $L(msg) }), "{}");
		else
			enyo.windows.addBannerMessage(new enyo.g11n.Template($L("Upload to Dropbox #{message}")).evaluate({message: $L(msg) }), "{}");
		
		if(inResponse.action == "pull")
			this.readFile(this.filename);
		else {
			this.$.spinnerLarge.hide();
			this.$.scrim.hide();
		}
	},
	
	/*
	 * FILE LISTING
	 */
	
	listFiles: function() {
		this.files = [];
		
		this.$.dropbox.call({}, {method:"readdir", onResponse: "handleListFiles"});
	},
	
	handleListFiles: function(inSender, inResponse) {
		for(var i in inResponse.files) {
			this.files.push({caption: inResponse.files[i].basename(".md"), filename: inResponse.files[i].basename()});
		}
		
		this.doDirRead(this.files);
	},
	
	/*
	 * LOGIN
	 */
	
	login: function(inSender, inEvent) {
		this.$.loginDialog.openAtCenter();
	},
	
	handleLoginForm: function(inSender, inResponse) {
		if(inResponse.username == "" && inResponse.password == "") {// reset gedrueckt
			this.$.loginDialog.setActive(false);
			this.$.loginDialog.close();
			
			enyo.windows.addBannerMessage($L("Dropbox-Account unlinked"), "{}");
			
			this.token = "";
			this.secret = "";
			
			enyo.setCookie("token", this.token);
			enyo.setCookie("secret", this.secret);
		}
		else {
			console.log("logging in");
			this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, email: inResponse.username, password: inResponse.password}, {method:"getaccesstoken", onResponse: "handleToken"});
		}
	},
	
	handleToken: function(inSender, inResponse) {
		console.log("got response");
		if(!inResponse.err) {
			enyo.windows.addBannerMessage($L("Successfully linked to Dropbox"), "{}");
			
			this.token = inResponse.token;
			this.secret = inResponse.secret;
			
			enyo.setCookie("token", this.token);
			enyo.setCookie("secret", this.secret);
			
			this.$.loginDialog.close();
			
			this.checkAccess();
			this.syncFile();
		}
		else {
			enyo.windows.addBannerMessage($L("Could not link with Dropbox"), "{}");
			this.$.loginDialog.setActive(false);
		}
		
		this.doLogin(inResponse);
	},
	
	/* CHECK ACCESS, CREATE DIRS */
	
	checkAccess: function() {
		this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"checkaccess", onResponse: "handleAccess"});
	},
	
	handleAccess: function(inSender, inResponse) {
		//console.log(JSON.stringify(inResponse));
		if(inResponse.remote.err && inResponse.remote.err.statusCode == 401) {
			this.token = "";
			this.secret = "";
			
			enyo.setCookie("token", this.token);
			enyo.setCookie("secret", this.secret);
			
			enyo.windows.addBannerMessage($L("Dropbox-Account unlinked"), "{}");
		}
	},
	
	cleanFilename: function() {
		// èéêëęē®™þýÿùúûüűìíîïİıòóôõöøőœºω§πàáâãäåæªšşßσð†‡łžźżçć©¢nnµ ÈÉÊËĘĒÝŸÙÚÛÜŰÌÍÎÏİIÒÓÔÕÖØŐŒºΩΠÀÁÂÃÄÅÆŠŞΣÐĞŁŽŹŻÇĆÑŃ
	
		var accents = "\u00E8\u00E9\u00EA\u00EB\u0119\u0113"
			+ "\u00AE\u2122\u00FE\u00FD\u00FF\u00F9"
			+ "\u00FA\u00FB\u00FC\u0171\u00EC\u00ED"
			+ "\u00EE\u00EF\u0130\u0131\u00F2\u00F3"
			+ "\u00F4\u00F5\u00F6\u00F8\u0151\u0153"
			+ "\u00BA\u03C9\u00A7\u03C0\u00E0\u00E1"
			+ "\u00E2\u00E3\u00E4\u00E5\u00E6\u00AA"
			+ "\u0161\u015F\u00DF\u03C3\u00F0\u2020"
			+ "\u2021\u0142\u017E\u017A\u017C\u00E7"
			+ "\u0107\u00A9\u00A2\u006E\u006E\u00B5"
			+ "\u0020\u00C8\u00C9\u00CA\u00CB\u0118"
			+ "\u0112\u00DD\u0178\u00D9\u00DA\u00DB"
			+ "\u00DC\u0170\u00CC\u00CD\u00CE\u00CF"
			+ "\u0130\u0049\u00D2\u00D3\u00D4\u00D5"
			+ "\u00D6\u00D8\u0150\u0152\u00BA\u03A9"
			+ "\u03A0\u00C0\u00C1\u00C2\u00C3\u00C4"
			+ "\u00C5\u00C6\u0160\u015E\u03A3"
			+ "\u00D0\u011E\u0141\u017D\u0179\u017B"
			+ "\u00C7\u0106\u00D1\u0143\u039C";
	
		var without = "eeeeeerttyyuuuuuiiiiiiooooooooooppaaaaaaaasssssfflzzzccccnnm"
			+ "EEEEEEYYUUUUUIIIIIIOOOOOOOOOOPAAAAAAASSSDGJZZZCCNNM";
	
		this.filename = this.filename.replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces		
			.replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
			.replace(new RegExp('[' + accents + ']', 'g'), function (c) { return without.charAt(accents.indexOf(c)); })
			.replace(/[^a-zA-Z0-9-]+/g, "") // remove all non-alphanumeric characters except the hyphen
			.replace(/[-]+/g, "-") // replace multiple instances of the hyphen with a single instance
			.replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
	},
	
	isLoggedIn: function() {
		return this.token != "" && this.secret != "";
	},
	
	getFilename: function() {
		return this.filename;
	},
	
	ready: function() {
		this.token = enyo.getCookie("token") || "";
		this.secret = enyo.getCookie("secret") || "";
		
		this.checkAccess();
	}
})
