enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1,
			onLinkClick: "linkClick"
		},
		{kind: "AppMenu", lazy: false, components: [
			{caption: $L("Documents"), lazy: false, name:"docsMenu", components: [
				{caption: $L("Create New..."), onclick: "sendNew", className: "subtleitem"}
			]},
			{caption: $L("Share"), components: [
				{caption: $L("Dropbox"), onclick: "doDropbox"},
				{caption: $L("Email"), onclick: "doEmail"},
				{caption: $L("Print"), name:"print", onclick: "doPrint"}
			]},
			{caption: $L("Help"), components: [
				{caption: $L("Syntax"), onclick: "doSyntax"},
				{caption: $L("FAQ"), onclick: "doFAQ"},
				{caption: $L("Report a Bug"), onclick: "doBug"}
			]},
			]
		},
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
			caption: $L("Create New..."),
			onclick: "sendNew",
			owner: this, // this part is important as the owner is the one who listens for the events
			kind: "AppMenuItem", // you might not need this. Might be that components are automatically turned into AppMenuItems
			className: "subtleitem"
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
		var windows = enyo.windows.getWindows();
		
		for(i in windows) {
			if(enyo.windows.fetchWindow(windows[i].window.name).rootKind.getFilename() == inSender.caption + ".md") {
				enyo.windows.activate(undefined, windows[i].window.name);
				return;
			}
		}
		enyo.windows.openWindow("index.html", "", {wasLaunchedBy: window.name, action:"doOpen", filename: inSender.caption + ".md"});
	},
	
	doOpen: function(inFilename) {
		this.$.fileIO.readFile(inFilename);
	},
	
	handleOpened: function(inSender, inResponse) {
		if(!inResponse.err) {
			this.$.editorPanel.setContent(inResponse.content, inResponse.filename);
			setInterval(enyo.hitch(this, "doSave"),5000);
		}
		else {
			this.$.editorPanel.setActive(false);
		}
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
	
	linkClick: function(inSender, inUrl, inAnchor) {
		if(inAnchor == "create")
			this.sendNew();
	},
	
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
				if(lastfile == "") {
					this.$.editorPanel.setContent(this.$.Demotext.text, "");
					//this.$.editorPanel.setActive(false);
				}
				else {
					this.doOpen(lastfile);
				}
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
	
	doEmail: function() {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({id: "com.palm.app.email",
			params: {
				text:"See attachment", summary: new enyo.g11n.Template($L("Typewriter Document \"#{name}\"")).evaluate({name: this.$.fileIO.getFilename().basename(".md") }), attachments: [{fullPath: "file:///media/internal/Typewriter/" + this.$.fileIO.getFilename()}]
			}
		});
	},
	
	doSyntax: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/markdown/" + enyo.g11n.currentLocale() + "/"});
	},
	
	doFAQ: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/faq/" + enyo.g11n.currentLocale() + "/"});
	},
	
	doBug: function(inSender) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: "http://www.typewriterwebos.com/report/" + enyo.g11n.currentLocale() + "/?version=" + enyo.fetchAppInfo().version});
	},
	
	getFilename: function() {
		return this.$.fileIO.getFilename();
	}
})
