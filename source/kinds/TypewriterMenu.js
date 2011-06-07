enyo.kind({
	name: "TypewriterMenu",
	kind: "AppMenu",
	published: {
		files: []
	},
	components: [
		{caption: "Documents", kind:"AppMenuItem", onclick: "loadFiles", name:"docs", components: [
			{caption:"Test"}
		]},
		{caption: "Help", components: [
			{caption: "Markdown Syntax", name:"markdownHelp", onclick: "displayHelp"},
			{caption: "Typewriter Syntax", name:"typewriterHelp", onclick: "displayHelp"},
		]},
		{caption: "Print", name:"print", onclick: "printDocument"}
	],
	
	postFiles: function(inFiles) {
		this.files = [];
		for(i in inFiles.files) {
			this.files.push({
				caption: inFiles.files[i],
				onclick: "openFile"
			});
		}
	},
	
	loadFiles: function(inSender, inEvent) {
		console.log(inSender);
		inSender.destroyControls();
		for(i in this.files) {
			inSender.createComponent(this.files[i]);
		}
		inSender.render();
	}
});
