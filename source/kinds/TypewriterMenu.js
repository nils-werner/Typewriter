enyo.kind({
	name: "TypewriterMenu",
	kind: "AppMenu",
	published: {
		files: []
	},
	events: {
		onFileLoad: "",
		onFileSave: ""
	},
	components: [
		{caption: "Save file", onclick: "doFileSave"},
		{caption: "Open file...", kind:"AppMenuItem", onclick: "doFileLoad"},
		{caption: "Help", components: [
			{caption: "Markdown Syntax", name:"markdownHelp", onclick: "displayHelp"},
			{caption: "Typewriter Syntax", name:"typewriterHelp", onclick: "displayHelp"},
		]},
		{caption: "Print", name:"print", onclick: "printDocument"},
	]
});
