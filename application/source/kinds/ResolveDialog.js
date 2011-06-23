enyo.kind({
	name: "ResolveDialog",
	kind: enyo.ModalDialog,
	scrim: false,
	caption: $L("Dropbox"),
	events: {
		onSubmit: "",
	},
	components: [
		{content: $L("Both files have been edited within 15 minutes of each other."), className: "smallhint"},
		{kind:"Spacer", height: "10px"},
		{kind: "HFlexBox", components: [
			{kind: "ActivityButton", name: "push", flex: 1, caption: $L("Upload"), className: "enyo-button-dark", onclick: "buttonHandler"},
			{kind: "ActivityButton", name:"pull", flex: 1, caption: $L("Download"), className: "enyo-button-dark", onclick: "buttonHandler"}
		]},
		{kind: "ActivityButton", name:"cancel", flex: 1, caption: $L("Cancel"), onclick: "buttonHandler"}
		
	],
	buttonHandler: function(inSender, inEvent) {
		this.doSubmit({ action: inSender.name });
	}
});
