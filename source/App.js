enyo.kind({
	name: "App",
	kind: enyo.VFlexBox,
	components: [
		{kind: "EditorPanel", flex: 1},
		{kind: "TypewriterMenu"},
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
	
	gotResponse: function(inSender, inResponse) {
		console.log("!!!!!!!!!!!!! BACK");
		console.log(inResponse.reply);
	},
	
	readDir: function() {
		console.log("*************** CALLING");
		this.$.service.call({}, {method:"readdir", onSuccess: "postFiles"});
	},
	
	postFiles: function(inSender, inResponse) {
		console.log("posting files");
		this.$.typewriterMenu.postFiles(inResponse);
	},
	
	ready: function() {
		console.log("############### STARTING ");
		enyo.nextTick(enyo.bind(this, "readDir"));
	}
})
