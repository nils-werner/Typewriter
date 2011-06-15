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
	files: [],
	ctoken: "xr03hokoazn32zx",
	csecret: "3ej0el462uohasn",
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
			name: "connectionmanager",
			kind: "enyo.PalmService",
			service: "palm://com.palm.connectionmanager/",
			method: 'getstatus',
			subscribe: true,
			timeout: 10000,
			onresponse: "handleConnectionmanager"
		},
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
		{kind: "PopupList",
			scrim: true,
			modal: true,
			dismissWithClick: false,
			width: "200px",
			height: "200px",
			modal: true,
			name:"fileDialog",
			onSelect: "handleFileSelected"
		},
		{kind: "NewFileDialog", onSubmit: "handleNewFile"}
	],
	
	handleConnectionmanager: function(inSender, inResponse) {
		console.log("################");
		console.log(JSON.stringify(inResponse));
		this.isonline = inResponse.isInternetConnectionAvailable;
	},
	
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
	
	saveFile: function(inContent, sync) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.$.dropbox.call({sync: this.isLoggedIn(), name: this.filename, content: inContent, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"writefile", onSuccess: "handleSaved"});
	},
	
	handleSaved: function(inEvent, inResponse) {
		console.log(JSON.stringify(inResponse));
		
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		this.doSaved({err: inResponse.err});
	},
	
	
	/*
	 * READING
	 */
	
	readFile: function(inName, sync) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		console.log("Pulling file " + this.filename);
		this.$.dropbox.call({sync: this.isLoggedIn(), name: this.filename, ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"readfile", onSuccess: "handleReadFile"});
	},
	
	handleReadFile: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		
		this.doOpened({ err: inResponse.err, data: inResponse.data});
	},
	
	
	/*
	 * FILE LISTING
	 */
	
	listFiles: function(sync) {
		this.files = [];
		
		this.$.fileDialog.openAtCenter();
		this.$.dropbox.call({sync: this.isLoggedIn(), ctoken: this.ctoken, csecret: this.csecret, token: this.token, secret: this.secret}, {method:"readdir", onSuccess: "handleListFiles"});
	},
	
	handleListFiles: function(inSender, inResponse) {
		console.log("files came back");
		
		for(var i in inResponse.files) {
			this.files.push({caption: inResponse.files[i].type + "/" + inResponse.files[i].filename.basename(".md"), filename: inResponse.files[i].filename.basename()});
		}
		
		console.log(JSON.stringify(inResponse));
		this.$.fileDialog.setItems(this.files);
		this.$.fileDialog.itemsChanged();
	},
	
	handleFileSelected: function(inSender, inSelected) {
		console.log("file selected");
		this.$.fileDialog.close();
		this.readFile(this.files[inSelected].filename);
	},
	
	cancelFileSelect: function(inSender, inEvent) {
		this.$.fileDialog.close();
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
		return this.isonline && this.token != "" && this.secret != "";
	},
	
	ready: function() {
		this.token = enyo.getCookie("token");
		this.secret = enyo.getCookie("secret");
		enyo.nextTick(enyo.bind(this, "checkAvailability"));
	},
	
	checkAvailability: function() {
		console.log("CHHHHHECK");
		this.$.connectionmanager.call();
	}
})
