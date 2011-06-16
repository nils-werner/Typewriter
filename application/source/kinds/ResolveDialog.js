enyo.kind({
	name: "ResolveDialog",
	kind: enyo.ModalDialog,
	scrim: false,
	caption: "Mergeconflict",
	events: {
		onSubmit: "",
	},
	components: [
		{content: "Both files have been edited within 30 seconds of each other. <strong>Pushing</strong> will overwrite the file on Dropbox, <strong>Pulling</strong> will overwrite the local file.", className: "smallhint"},
		{kind:"Spacer", height: "10px"},
		{kind: "HFlexBox", components: [
			{kind: "ActivityButton", name: "push", flex: 1, caption: "Push", className: "enyo-button-dark", onclick: "buttonHandler"},
			{kind: "ActivityButton", name:"pull", flex: 1, caption: "Pull", className: "enyo-button-dark", onclick: "buttonHandler"}
		]},
		{kind: "ActivityButton", name:"cancel", flex: 1, caption: "Cancel", onclick: "buttonHandler"}
		
	],
	buttonHandler: function(inSender, inEvent) {
		this.doSubmit({ action: inSender.name });
	}
});
