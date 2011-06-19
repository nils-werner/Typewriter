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
	ctoken: "xr03hokoazn32zx",
	csecret: "3ej0el462uohasn",
	lastContent: "",
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
			service: "palm://de.obsessivemedia.webos.typewriter.dropbox/",
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
		this.filename = inResponse.filename + ".md";
		this.lastContent = "";
		this.doOpened({ err: null, content: inResponse.filename + "\n" + new String("=").repeat(inResponse.filename.length) + "\n\n", filename: this.filename});
	},
	
	/*
	 * WRITING
	 */
	
	saveFile: function(inContent) {
		if(this.lastContent != inContent && this.filename != "") {
			console.log("saving " + this.filename);
			this.$.dropbox.call({filename: this.filename, content: inContent}, {method:"writefile", onSuccess: "handleSaved"});
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
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		this.$.dropbox.call({filename: this.filename}, {method:"readfile", onSuccess: "handleReadFile"});
	},
	
	handleReadFile: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		
		this.lastContent = inResponse.content;
		
		if(inResponse.err) {
			enyo.windows.addBannerMessage(new enyo.g11n.Template($L("Could not load #{name}")).evaluate({name: this.filename.basename(".md") }), "{}");
			this.filename = "";
			enyo.setCookie("lastfile", "");
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
			
				this.$.dropbox.call({filename: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncstat", onSuccess: "handleStat"});
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
			this.$.dropbox.call({filename: this.filename, action: inResponse.action, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncfile", onSuccess: "handleSync"});
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
		
		this.$.dropbox.call({}, {method:"readdir", onSuccess: "handleListFiles"});
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
			this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, email: inResponse.username, password: inResponse.password}, {method:"getaccesstoken", onSuccess: "handleToken"});
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
		this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"checkaccess", onSuccess: "handleAccess"});
	},
	
	handleAccess: function(inSender, inResponse) {
		console.log(JSON.stringify(inResponse));
		if(inResponse.remote.err && inResponse.remote.err.statusCode == 401) {
			this.token = "";
			this.secret = "";
			
			enyo.setCookie("token", this.token);
			enyo.setCookie("secret", this.secret);
			
			enyo.windows.addBannerMessage($L("Dropbox-Account unlinked"), "{}");
		}
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
