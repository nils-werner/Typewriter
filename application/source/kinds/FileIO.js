enyo.kind({
	name: "FileIO",
	kind: enyo.Control,
	published: {
		token: "",
		secret: "",
		remoteDir: "Typewriter/",
		localDir: "/media/internal/Typewriter/"
	}
	filename: "test.md",
	events: {
		onOpened: "",
		onSaved: "",
		onDirRead: "",
		onPushed: "",
		onFetched: ""
	}
	components: [
		{
			name: "fileio",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.fileio/",
			subscribe: true,
			timeout: 2000
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
		{kind: "Popup", name:"fileList"}
	],
	
	/*
	 * WRITING
	 */
	
	saveFile: function(inContent) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.$.fileio.call({name: this.filename, content: inContent}, {method:"writefile", onSuccess: "handleSaved"});
	},
	
	handlePushed: function(inEvent, inResponse) {
	},
	
	handleSaved: funtion(inEvent, inResponse) {
		if(this.isLoggedIn()) {
			this.$.dropbox.call({name: this.filename}, {method:"writefile", onSuccess: "handlePushed"});
		}
		
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		this.doSaved(inResponse);
	},
	
	
	/*
	 * READING
	 */
	
	readFile: function(inName) {
		this.$.spinnerLarge.show();
		this.$.scrim.show();
		
		this.filename = inName;
		if(this.isLoggedIn()) {
			this.$.dropbox.call({name: this.filename}, {method:"readfile", onSuccess: "handleFetched"});
		}
		else {
			this.handleFetched();
		}
	},
	
	handleFetched: function() {
		this.$.fileio.call({name: this.filename}, {method:"readfile", onSuccess: "handleOpened"});
	}
	
	handleOpened: function(inSender, inResponse) {
		this.$.spinnerLarge.hide();
		this.$.scrim.hide();
		
		this.doOpened(inResponse.content);
	},
	
	
	/*
	 * FILE LISTING
	 */
	
	listFiles: function() {
		this.files = [];
		
		this.$.fileio.call({}, {method:"readdir", onSuccess: "handleLocaldir"});
		this.$.dropbox.call({}, {method:"readdir", onSuccess: "handleRemotedir"});
	},
	
	handleLocaldir: function(inSender, inResponse) {
		for(i in inResponse.files) {
			this.files.push(inResponse.files[i]);
		}
	},
	
	handleRemotedir: function(inSender, inResponse) {
		for(i in inResponse.files) {
			this.files.push(inResponse.files[i]);
		}
	},
	
	isLoggedIn: function() {
		return token != "" && secret != "";
	}
})
