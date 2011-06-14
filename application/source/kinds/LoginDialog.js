enyo.kind({
	name: "LoginDialog",
	kind: enyo.ModalDialog,
	caption: "Login",
	events: {
		onSubmit: "",
	},
	components: [
		{kind:"RowGroup", components: [
			{kind: "Input", hint: "E-Mail Address", name:"username", 
				spellcheck: false,
				autocorrect: false,
				autoCapitalize: "lowercase",
				autoWordComplete: false,
				selectAllOnFocus: true
			},
			{kind: "PasswordInput", hint: "Password", name:"password", 
				onkeypress: "keypressHandler"
			}
		]},
		{kind:"Spacer", height: "10px"},
		{content: "Typewriter will not save your emailadress or password. You can always revoke Typewriter's access to you files via your <a href=\"https://www.dropbox.com/account#applications\">Dropbox account preferences</a>.", className: "smallhint"},
		{kind:"Spacer", height: "20px"},
		{kind: "HFlexBox", components: [
			{kind: "Button", flex: 1, caption: "Reset", onclick: "resetHandler"},
			{kind: "Button", flex: 1, caption: "Login", className: "enyo-button-dark", default: true, onclick: "buttonHandler"}
		]}
	],
	keypressHandler: function(inSender, inEvent) {
		if(inEvent.keyCode == 13) {
			enyo.keyboard.forceHide();
			this.buttonHandler();
		}
	},
	buttonHandler: function() {
		this.doSubmit({ username: this.$.username.getValue(), password: this.$.password.getValue() });
	},
	resetHandler: function() {
		this.doSubmit({ username: "", password: "" });
	}
});
