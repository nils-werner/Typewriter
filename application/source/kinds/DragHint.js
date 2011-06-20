enyo.kind({
	name: "DragHint",
	kind: enyo.Control,
	components: [
		{content: "", name:"hint", className: "draghint disabled", style:"background-image: url(images/" + $L("dragthis") + ".png);"}
	],
	setVisible: function(inValue) {
		if(inValue)
			this.$.hint.removeClass("disabled");
		else
			this.$.hint.addClass("disabled");
	}
});
