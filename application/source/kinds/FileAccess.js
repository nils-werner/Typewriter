// NOCH LANG NICHT FERTIG

enyo.kind({
	name: "FileAccess",
	kind: enyo.control,
	events: {
		onFileSaved: "",
		onFileLoaded: "",
		onDirRead: "",
		onFailure: ""
	}
	components: [
		{
			name: "service",
			kind: "enyo.PalmService",
			service: "palm://de.obsessivemedia.webos.typewriter.fileio/",
			subscribe: true,
			timeout: 2000
		}
	],
	
	readDir: function() {
		this.$.service.call({}, {method:"readdir", onResult: "doDirRead"});
	},
	
	openFile: function(inSender, inEvent) {
		this.$.filePicker.pickFile();
	},
	
	writeFile: function(inSender, inEvent) {
		this.$.scrim.show();
		this.$.spinnerLarge.show();
		this.$.service.call({name: this.filename, content: this.$.editorPanel.getContent()}, {method:"writefile", onSuccess: "handleFilesaved"});
	},
});
