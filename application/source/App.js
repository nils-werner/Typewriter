enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "AppMenu", lazy: false, components: [
			{caption: "Document", components: [
				{caption: "Create New...", onclick: "doNew"},
				{caption: "Open", onclick: "doOpen"}
			]},
			{caption: "Send to", components: [
				{caption: "Dropbox", onclick: "doDropbox"},
				{caption: "Email", onclick: "doEmail"},
				{caption: "Print", name:"print", onclick: "doPrint"}
			]},
			{caption: "Help", components: [
				{caption: "Syntax", onclick: "doHelp"},
			]},
			]
		},
		{name: "markdownHelper", kind:"markdownHelper"},
		{name: "typewriterHelper", kind:"typewriterHelper"},
		{kind: "Scrim", name:"taboutscrim", layoutKind: "VFlexLayout", align:"center", pack:"center", style:"background-color: transparent; opacity: 1;", components: [
			{kind: "Image", src:"images/icon256.png", style: "opacity: 0.0;"}
		]},
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		{kind: "FileIO",
			onOpened: "handleOpened",
			onSaved: "handleSaved",
			onLogin: "handleLoginResult"
		},
		{kind: "LoginDialog", onSubmit: "handleLoginData"},
		
	],
	
	/* FILE HANDLING */
	
	doNew: function(inSender, inResponse) {
		this.$.fileIO.createNew();
	},
	
	doOpen: function(inSender, inEvent) {
		this.$.fileIO.listFiles();
	},
	
	handleOpened: function(inSender, inResponse) {
		this.$.editorPanel.setContent(inResponse.data);
	},
	
	doSave: function(inSender, inEvent) {
		console.log("saving file");
		this.$.fileIO.saveFile(this.$.editorPanel.getContent());
	},
	
	handleSaved: function(inSender, inResponse) {
	},
	
	doLogin: function(inSender, inEvent) {
		this.$.loginDialog.openAtCenter();
	},
	
	handleLoginData: function(inSender, inResponse) {
		if(inResponse.username == "" && inResponse.password == "") {// reset gedrueckt
			this.$.loginDialog.setActive(false);
			this.$.loginDialog.close();
		}
		this.$.fileIO.login({username: inResponse.username, password: inResponse.password});
	},
	
	handleLoginResult: function(inSender, inResponse) {
		if(!inResponse.err) {
			this.$.loginDialog.close();
		}
		else {
			console.log("error, please re-login");
			this.$.loginDialog.setActive(false);
		}
	},
	
	
	/* BORING EVENTS */
	sleep: function() {
		//if(this.position == "down")
		//	this.$.top.node.style.height = enyo.fetchControlSize(this).h + "px";
		this.$.taboutscrim.show();
	},
	
	wakeup: function() {
		//this.$.top.node.style.height = (enyo.fetchControlSize(this).h - 55 - enyo.keyboard.height) + "px";
		this.$.taboutscrim.hide();
	},
	
	ready: function() {
		setInterval(enyo.hitch(this, "doSave"),5000);
	},
	
	doPrint: function() {
		this.$.editorPanel.printDocument();
	},
	
	doHelp: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/markdown.html"});
	}
})
