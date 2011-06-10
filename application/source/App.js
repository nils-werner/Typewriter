enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "AppMenu", lazy: false, components: [
			{caption: "Save file", onclick: "doSave"},
			{caption: "Open file...", name:"fileList", onclick: "doOpen", components: [
				{kind:"AppMenuItem", caption:""}
			]},
			{caption: "Print", name:"print", onclick: "doPrint"},
			{caption: "Log into Dropbox...", name:"dropboxLogin", onclick: "doLogin"},
			{caption: "Help", components: [
				{caption: "Markdown Syntax", name:"markdownHelp", onclick: "displayHelp"},
				{caption: "Typewriter Syntax", name:"typewriterHelp", onclick: "displayHelp"},
			]},
			]
		},
		{name: "markdownHelper", kind:"markdownHelper"},
		{name: "typewriterHelper", kind:"typewriterHelper"},
		{kind: "Scrim", name:"taboutscrim", layoutKind: "VFlexLayout", align:"center", pack:"center", style:"background-color: transparent; opacity: 1;", components: [
			{kind: "Image", src:"images/icon256.png", style: "opacity: 0.5;"}
		]},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"center", pack:"center", components: [
			{kind: "SpinnerLarge"}
		]},
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		{
			name: "fileio",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.fileio/",
			subscribe: true,
			timeout: 2000
		}
	],
	
	/* FILE HANDLING */
	
	
	doOpen: function(inSender, inEvent) {
		console.log("opening dir");
		this.$.fileio.call({}, {method:"readdir", onSuccess: "handleReaddir"});
	},
	
	handleReaddir: function(inSender, inResponse) {
		console.log("opened dir" + inResponse.files.length);
		var files = [];
		for(i in inResponse.files) {
			files.push({kind:"AppMenuItem", caption: inResponse.files[i]});
		}
		this.$.fileList.destroyControls();
		this.$.fileList.createComponents(files);
		this.$.fileList.render();
		this.$.appMenu.render();
	},
	
	handleFilepicked: function(inSender, result) {
		this.$.scrim.show();
		this.$.spinnerLarge.show();
		this.$.fileio.call({name: this.filename}, {method:"readfile", onSuccess: "handleOpened"});
	},
	
	handleOpened: function(inSender, inResponse) {
		this.$.editorPanel.setContent(inResponse.content);
		this.$.scrim.hide();
		this.$.spinnerLarge.hide();
	},
	
	
	
	
	doSave: function(inSender, inEvent) {
		this.$.scrim.show();
		this.$.spinnerLarge.show();
		this.$.fileio.call({name: this.filename, content: this.$.editorPanel.getContent()}, {method:"writefile", onSuccess: "handleSaved"});
	},
	
	handleSaved: function(inSender, inResponse) {
		this.$.scrim.hide();
		this.$.spinnerLarge.hide();
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
	
	displayHelp: function(inSender) {
		if(inSender.name == "markdownHelp")
			this.$.markdownHelper.openAtCenter();
		else
			this.$.typewriterHelper.openAtCenter();
	}
})
