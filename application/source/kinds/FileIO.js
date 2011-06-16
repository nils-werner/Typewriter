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
		{kind: "ResolveDialog", onSubmit: "handleResolve"}
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
		this.doOpened({ err: null, data: inResponse.filename + "\n" + new String("=").repeat(inResponse.filename.length) + "\n\n"});
	},
	
	/*
	 * WRITING
	 */
	
	saveFile: function(inContent) {
		if(this.lastContent != inContent && this.filename != "") {
			console.log("saving " + this.filename);
			this.$.dropbox.call({name: this.filename, content: inContent}, {method:"writefile", onSuccess: "handleSaved"});
			this.lastContent = inContent;
		}
	},
	
	handleSaved: function(inEvent, inResponse) {
		this.doSaved({err: inResponse.err});
	},
	
	
	/*
	 * READING
	 */
	
	readFile: function(inName) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		this.$.dropbox.call({name: this.filename}, {method:"readfile", onSuccess: "handleReadFile"});
	},
	
	handleReadFile: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		
		this.lastContent = inResponse.data;
		
		this.doOpened({ err: inResponse.err, data: inResponse.data});
	},
	
	
	/*
	 * FILE SYNCING
	 */
	 
	syncFile: function() {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.$.dropbox.call({name: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncstat", onSuccess: "handleStat"});
	},
	
	handleStat: function(inSender, inResponse) {
		console.log(JSON.stringify(inResponse));
		var action = "";
		
		if(inResponse.remote.err) {
			if(inResponse.remote.err.statusCode == 404)
				action = "push";
		}
		else if(inResponse.local.err) {
			action = "pull";
		}
		else {
			ltime = Date.parse(inResponse.local.stats.mtime);
			rtime = Date.parse(inResponse.remote.data.modified);
	
			if(ltime - rtime > 30000) {
				console.log("local copy is newer");
				action = "push";
			}
			else if(rtime - ltime > 30000) {
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
			this.$.dropbox.call({name: this.filename, action: inResponse.action, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret }, {method:"syncfile", onSuccess: "handleSync"});
		}
		else {
			this.$.spinnerLarge.hide();
			this.$.scrim.hide();
		}
	},
	
	handleSync: function(inSender, inResponse) {
		console.log(JSON.stringify(inResponse));
		
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
	
	login: function(param) {
		if(param.username == "" && param.password == "") {
			this.token = "";
			this.secret = "";
		}
		this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, email: param.username, password: param.password}, {method:"getaccesstoken", onSuccess: "handleToken"});
	},
	
	handleToken: function(inSender, inResponse) {
		console.log(JSON.stringify(inResponse));
		
		if(!inResponse.err) {
			this.token = inResponse.token;
			this.secret = inResponse.secret;
			
			enyo.setCookie("token", this.token);
			enyo.setCookie("secret", this.secret);
		}
		
		this.doLogin(inResponse);
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
	}
})
