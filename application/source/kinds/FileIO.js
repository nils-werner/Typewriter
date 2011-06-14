enyo.kind({
	name: "FileIO",
	kind: enyo.Control,
	published: {
		token: "",
		secret: "",
		remoteDir: "Typewriter/",
		localDir: "/media/internal/Typewriter/"
	},
	filename: "test.md",
	ctoken: "xr03hokoazn32zx",
	csecret: "3ej0el462uohasn",
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
			name: "fileio",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.fileio/",
			subscribe: true,
			timeout: 2000
		},
		{
			name: "dropbox",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.dropbox/",
			subscribe: true,
			timeout: 10000,
			params: {
				ctoken: this.ctoken,
				csecret: this.csecret
			}
		},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"center", pack:"center", components: [
			{kind: "SpinnerLarge"}
		]},
		{kind: "Popup", name:"fileList", lazy: false, components: [
			{kind: "VirtualList", onSetupRow: "setupFileListRow", components: [
				{kind: "Item", layoutKind: "HFlexLayout", components: [
					{name: "caption", flex: 1, onclick: "handleFileSelected"},
				]}
			]}
		]},
		{kind: "Popup", name:"login", components: [
		]}
	],
	
	/*
	 * WRITING
	 */
	
	saveFile: function(inContent) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.$.fileio.call({name: this.filename, content: inContent}, {method:"writefile", onSuccess: "handleSaved"});
	},
	
	handlePushed: function(inEvent, inResponse) {
		console.log(JSON.stringify(inResponse));
	},
	
	handleSaved: function(inEvent, inResponse) {
		if(this.isLoggedIn()) {
			console.log("Pushing file " + this.filename);
			this.$.dropbox.call({name: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"writefile", onSuccess: "handlePushed"});
		}
		
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		this.doSaved(inResponse);
	},
	
	
	/*
	 * READING
	 */
	
	readFile: function(inName) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		if(this.isLoggedIn()) {
			console.log("Pulling file " + this.filename);
			this.$.dropbox.call({name: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"readfile", onSuccess: "handleFetched"});
		}
		else {
			this.handleFetched();
		}
	},
	
	handleFetched: function() {
		this.$.fileio.call({name: this.filename}, {method:"readfile", onSuccess: "handleOpened"});
	},
	
	handleOpened: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		
		this.doOpened(inResponse.content);
	},
	
	
	/*
	 * FILE LISTING
	 */
	
	listFiles: function() {
		this.files = [];
		
		this.$.fileio.call({}, {method:"readdir", onSuccess: "handleLocaldir"});
		this.$.dropbox.call({ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"readdir", onSuccess: "handleRemotedir"});
		this.$.fileList.openAtCenter();
	},
	
	handleLocaldir: function(inSender, inResponse) {
		console.log("Local files came back");
		for(var i in inResponse.files) {
			this.files.push({ type: "local", filename: inResponse.files[i]});
		}
		this.$.fileList.render();
	},
	
	handleRemotedir: function(inSender, inResponse) {
		console.log("Remote files came back");
		for(var i in inResponse.data.contents) {
			this.files.push({ type: "dropbox", filename: inResponse.data.contents[i].path });
		}
		this.$.fileList.render();
	},
	
	setupFileListRow: function(inSender, inIndex) {
		console.log(inIndex + " requested");
		this.$.caption.setContent(inIndex + " " + this.files[inIndex].filename);
		return true;
	},
	
	handleFileSelected: function(inSender, inEvent) {
		console.log(inSender.getContent());
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
	
	ready: function() {
		this.token = enyo.getCookie("token");
		this.secret = enyo.getCookie("secret");
	}
})
