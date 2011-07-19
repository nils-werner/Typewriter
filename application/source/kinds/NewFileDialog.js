enyo.kind({
	name: "NewFileDialog",
	kind: enyo.ModalDialog,
	caption: $L("New Document"),
	events: {
		onSubmit: "",
	},
	components: [
		{kind:"RowGroup", components: [
			{kind: "Input", hint: $L("Title"), name:"name", 
				selectAllOnFocus: true
			}
		]},
		{content: $L("The filename will be changed to not contain any special characters."), className: "smallhint"},
		{kind:"Spacer", height: "10px"},
		{kind: "HFlexBox", components: [
			{kind: "ActivityButton", name: "reset", flex: 1, caption: $L("Cancel"), onclick: "resetHandler"},
			{kind: "ActivityButton", name:"login", flex: 1, caption: $L("Create"), className: "enyo-button-dark", default: true, onclick: "buttonHandler"}
		]}
		
	],
	keypressHandler: function(inSender, inEvent) {
		if(inEvent.keyCode == 13) {
			enyo.keyboard.forceHide();
			this.buttonHandler();
		}
	},
	buttonHandler: function() {
		if(this.$.name.getValue() != "")
			this.doSubmit({ filename: this.$.name.getValue() });
		else
			this.$.name.forceFocus();
	},
	resetHandler: function() {
		window.close();
		this.doSubmit({ filename: "" });
	},
	rendered: function() {
		enyo.keyboard.show();
		this.$.name.forceFocus();
	}
});
