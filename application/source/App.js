enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "AppMenu", lazy: false, components: [
			{caption: "Document", lazy: false, name:"docsMenu", components: [
				{caption: "Create New...", onclick: "sendNew"},
				{caption: "Open", onclick: "sendOpen"}
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
			onLogin: "handleLoginResult",
			onDirRead: "handleLoadFiles"
		},
		{kind: "LoginDialog", onSubmit: "handleLoginData"},
		{name:"Demotext", kind:"Demotext" },
	],
	
	/* NEUE DATEI */
	
	sendNew: function(inSender, inResponse) {
		enyo.windows.openWindow("index.html", "", {wasLaunchedBy: window.name, action:"doNew"});
	},
	
	doNew: function() {
		this.$.fileIO.createNew();
	},
	
	/* DATEI ÖFFNEN */
	
	doLoadFiles: function(inSender, inEvent) {
		this.$.fileIO.listFiles();
	},
	
	handleLoadFiles: function(inSender, inResponse) {
		console.log(JSON.stringify(inResponse));
		this.$.docsMenu.destroyControls();
		
		this.$.docsMenu.createComponent({
			caption: "Create New...",
			onclick: "sendNew",
			owner: this, // this part is important as the owner is the one who listens for the events
			kind: "AppMenuItem" // you might not need this. Might be that components are automatically turned into AppMenuItems
		});
		
		for(var i = 0; i < inResponse.length; i++) {
			this.$.docsMenu.createComponent({
				caption: inResponse[i].caption,
				onclick: "sendOpen",
				owner: this, // this part is important as the owner is the one who listens for the events
				kind: "AppMenuItem" // you might not need this. Might be that components are automatically turned into AppMenuItems
			});
		}
		this.$.docsMenu.render();
		this.$.appMenu.render();
	},
	
	sendOpen: function(inSender, inEvent) {
		enyo.windows.openWindow("index.html", "", {wasLaunchedBy: window.name, action:"doOpen", filename: "leer.md"});
	},
	
	doOpen: function(inFilename) {
		this.$.fileIO.readFile(inFilename);
	},
	
	handleOpened: function(inSender, inResponse) {
		this.$.editorPanel.setContent(inResponse.data);
		setInterval(enyo.hitch(this, "doSave"),5000);
	},
	
	/* SPEICHERN */
	
	doSave: function(inSender, inEvent) {
		if(this.$.editorPanel.hasChanged()) {
			this.$.fileIO.saveFile(this.$.editorPanel.getContent());
		}
	},
	
	handleSaved: function(inSender, inResponse) {
	},
	
	/* LOGIN */
	
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
	
	
	ready: function() {
		if(enyo.windowParams) {
			if(enyo.windowParams.action) {
				if(enyo.windowParams.action == "doOpen") {
					console.log("oeffne datei");
					this.doOpen(enyo.windowParams.filename);
				}
				else if(enyo.windowParams.action != "doNew"){
					// erstes fenster, session wiederherstellen
				}
			}
			else {
				this.$.editorPanel.setContent(this.$.Demotext.text);
			}
		}
		//setInterval(enyo.hitch(this, "doSave"),5000);
		setInterval(enyo.hitch(this, "doLoadFiles"),15000);
		this.doLoadFiles();
	},
	
	rendered: function() {
		if(enyo.windowParams) {
			if(enyo.windowParams.action) {
				if(enyo.windowParams.action == "doNew") {
					console.log("neue datei");
					this.doNew();
				}
			}
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
