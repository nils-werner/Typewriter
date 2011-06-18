enyo.kind({
	name: "NewFileDialog",
	kind: enyo.ModalDialog,
	caption: "New Document",
	events: {
		onSubmit: "",
	},
	components: [
		{kind:"RowGroup", components: [
			{kind: "Input", hint: "Name", name:"name", 
				selectAllOnFocus: true,
				onkeypress: "keypressHandler"
			}
		]},
		{kind:"Spacer", height: "10px"},
		{kind: "HFlexBox", components: [
			{kind: "ActivityButton", name: "reset", flex: 1, caption: "Cancel", onclick: "resetHandler"},
			{kind: "ActivityButton", name:"login", flex: 1, caption: "Create", className: "enyo-button-dark", default: true, onclick: "buttonHandler"}
		]}
		
	],
	keypressHandler: function(inSender, inEvent) {
		if(inEvent.keyCode == 13) {
			enyo.keyboard.forceHide();
			this.buttonHandler();
		}
	},
	buttonHandler: function() {
		this.doSubmit({ filename: this.$.name.getValue() });
	},
	resetHandler: function() {
		this.doSubmit({ filename: "" });
	},
	rendered: function() {
		enyo.keyboard.show();
	}
});
