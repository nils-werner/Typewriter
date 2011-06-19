enyo.kind({
	name: "ResolveDialog",
	kind: enyo.ModalDialog,
	scrim: false,
	caption: $L("Dropbox"),
	events: {
		onSubmit: "",
	},
	components: [
		{content: $L("Both files have been edited within 15 minutes of each other, I am not sure wich one is the most recent. <strong>Pushing</strong> will overwrite the file on Dropbox, <strong>Pulling</strong> will overwrite the local file."), className: "smallhint"},
		{kind:"Spacer", height: "10px"},
		{kind: "HFlexBox", components: [
			{kind: "ActivityButton", name: "push", flex: 1, caption: $L("Push"), className: "enyo-button-dark", onclick: "buttonHandler"},
			{kind: "ActivityButton", name:"pull", flex: 1, caption: $L("Pull"), className: "enyo-button-dark", onclick: "buttonHandler"}
		]},
		{kind: "ActivityButton", name:"cancel", flex: 1, caption: $L("Cancel"), onclick: "buttonHandler"}
		
	],
	buttonHandler: function(inSender, inEvent) {
		this.doSubmit({ action: inSender.name });
	}
});
