enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "TypewriterMenu", onFileLoad: "openFile", onFileSave: "writeFile"},
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		//{name: "markdownHelper", kind:"markdownHelper"},
		//{name: "typewriterHelper", kind:"typewriterHelper"},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"end", pack:"end", style:"background-color: transparent; opacity: 1;", components: [
			{kind: "Image", src:"images/bigicon.png", style: "margin-right: 20px; margin-bottom: 65px;"}
		]},
		{
			name: "service",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.fileio/",
			subscribe: true,
			timeout: 2000
		}
	],
	
	sleep: function() {
		//if(this.position == "down")
		//	this.$.top.node.style.height = enyo.fetchControlSize(this).h + "px";
		this.$.scrim.show();
	},
	
	wakeup: function() {
		//this.$.top.node.style.height = (enyo.fetchControlSize(this).h - 55 - enyo.keyboard.height) + "px";
		this.$.scrim.hide();
	},
	
	printDocument: function() {
		this.$.editorPanel.printDocument();
	},
	displayHelp: function(inSender) {
		if(inSender.name == "markdownHelp")
			this.$.markdownHelper.openAtCenter();
		else
			this.$.typewriterHelper.openAtCenter();
	},
	
	readDir: function() {
		this.$.service.call({}, {method:"readdir", onSuccess: "postFiles"});
	},
	
	postFiles: function(inSender, inResponse) {
		console.log("posting files");
		this.$.typewriterMenu.postFiles(inResponse);
	},
	
	openFile: function(inSender, inEvent) {
		console.log(inSender);
	},
	
	writeFile: function(inSender, inEvent) {
		console.log(this.filename);
		console.log(this.$.editorPanel.getContent());
		this.$.service.call({name: this.filename, content: this.$.editorPanel.getContent()}, {method:"writefile"});
	},
	
	ready: function() {
		enyo.nextTick(enyo.bind(this, "readDir"));
	}
})
