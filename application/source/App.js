enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	published: {
		filename: "test.md"
	},
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "TypewriterMenu", onFileLoad: "openFile", onFileSave: "writeFile", onFileLoad: "openFile", onPrintDocument: "printDocument"},
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		//{name: "markdownHelper", kind:"markdownHelper"},
		//{name: "typewriterHelper", kind:"typewriterHelper"},
		{kind: "Scrim", name:"taboutscrim", layoutKind: "VFlexLayout", align:"end", pack:"end", style:"background-color: transparent; opacity: 1;", components: [
			{kind: "Image", src:"images/icon256.png", style: "margin-right: 20px; margin-bottom: 65px; opacity: 0.5;"}
		]},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"center", pack:"center", components: [
			{kind: "SpinnerLarge"}
		]},
		{name:'filePicker', kind: "FilePicker", extensions:["md", "markdown", "txt"], allowMultiSelect:false, onPickFile: "handleFilepicked"},
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
		this.$.taboutscrim.show();
	},
	
	wakeup: function() {
		//this.$.top.node.style.height = (enyo.fetchControlSize(this).h - 55 - enyo.keyboard.height) + "px";
		this.$.taboutscrim.hide();
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
		this.$.service.call({}, {method:"readdir"});
	},
	
	openFile: function(inSender, inEvent) {
		this.$.filePicker.pickFile();
	},
	
	handleFilepicked: function(inSender, result) {
		this.$.scrim.show();
		this.$.spinnerLarge.show();
		this.filename = result[0].fullPath;
		this.$.service.call({name: this.filename}, {method:"readfile", onSuccess: "handleFileopened"});
	},
	
	handleFileopened: function(inSender, inResponse) {
		this.$.editorPanel.setContent(inResponse.content);
		this.$.scrim.hide();
		this.$.spinnerLarge.hide();
	},
	
	writeFile: function(inSender, inEvent) {
		this.$.scrim.show();
		this.$.spinnerLarge.show();
		this.$.service.call({name: this.filename, content: this.$.editorPanel.getContent()}, {method:"writefile", onSuccess: "handleFilesaved"});
	},
	
	handleFilesaved: function(inSender, inResponse) {
		this.$.scrim.hide();
		this.$.spinnerLarge.hide();
	}
})
