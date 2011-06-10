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
			{caption: "Open file...", onclick: "doOpen"},
			{caption: "Synchronization", onclick: "doLogin"},
			{caption: "Print", name:"print", onclick: "doPrint"},
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
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		{kind: "FileIO",
			onOpened: "handleOpened",
			onSaved: "handleSaved"
		}
	],
	
	/* FILE HANDLING */
	
	
	doOpen: function(inSender, inEvent) {
		this.$.fileIO.readDir();
	},
	
	handleOpened: function(inSender, result) {
		this.$.editorPanel.setContent(inResponse.content);
	},
	
	doSave: function(inSender, inEvent) {
		this.$.fileIO.saveFile(this.$.editorPanel.getContent());
	},
	
	handleSaved: function(inSender, inResponse) {
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
