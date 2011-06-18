enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "AppMenu", lazy: false, components: [
			{caption: "Documents", lazy: false, name:"docsMenu", components: [
				{caption: "Create New...", onclick: "sendNew"}
			]},
			{caption: "Share", components: [
				{caption: "Dropbox", onclick: "doDropbox"},
				{caption: "Email", onclick: "doEmail"},
				{caption: "Print", name:"print", onclick: "doPrint"}
			]},
			{caption: "Help", components: [
				{caption: "Syntax", onclick: "doSyntax"},
				{caption: "FAQ", onclick: "doFAQ"},
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
			onWindowActivated: "wakeup",
			onUnload: "close"
		},
		{kind: "FileIO",
			onOpened: "handleOpened",
			onSaved: "handleSaved",
			onLogin: "handleLoginResult",
			onDirRead: "handleLoadFiles"
		},
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
		enyo.windows.openWindow("index.html", "", {wasLaunchedBy: window.name, action:"doOpen", filename: inSender.caption + ".md"});
	},
	
	doOpen: function(inFilename) {
		this.$.fileIO.readFile(inFilename);
	},
	
	handleOpened: function(inSender, inResponse) {
		this.$.editorPanel.setContent(inResponse.content, inResponse.filename);
		setInterval(enyo.hitch(this, "doSave"),5000);
	},
	
	/* SPEICHERN */
	
	doSave: function(inSender, inEvent) {
		this.$.fileIO.saveFile(this.$.editorPanel.getContent());
	},
	
	handleSaved: function(inSender, inResponse) {
	},
	
	/* SYNC */
	
	doDropbox: function(inSender, inEvent) {
		this.$.fileIO.syncFile();
	},
	
	/* LOGIN */
	
	rendered: function() {
		this.$.editorPanel.render();
		if(enyo.windowParams) {
			if(enyo.windowParams.action) {
				if(enyo.windowParams.action == "doOpen") {
					console.log("oeffne datei");
					this.doOpen(enyo.windowParams.filename);
				}
				if(enyo.windowParams.action == "doNew") {	// das muss irgendwie in rendered, ohne alles zu zerschmeissen
					console.log("neue datei");
					this.doNew();
				}
			}
			else {
				var lastfile = enyo.getCookie("lastfile") || "";
				if(lastfile == "")
					this.$.editorPanel.setContent(this.$.Demotext.text, "");
				else
					this.doOpen(lastfile);
			}
		}
		console.log(lastfile);
		//setInterval(enyo.hitch(this, "doSave"),5000);
		setInterval(enyo.hitch(this, "doLoadFiles"),15000);
		this.doLoadFiles();
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
	
	close: function() {
		this.$.fileIO.saveFile(this.$.editorPanel.getContent());
		enyo.setCookie("lastfile", this.$.fileIO.getFilename());
	},
	
	doPrint: function() {
		this.$.editorPanel.printDocument();
	},
	
	doHelp: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/markdown.html"});
	},
	
	doFAQ: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/faq.html"});
	}
})
