/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight:1, components: [
			{name: "top", height: "100%", kind:"HSlidingView", 
				components: [
					{kind: "Header", content:"Editor", },
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, components: [
							{className: "desk-left", flex: 1},
							{kind: "BasicScroller",
								flex: 10,
								autoHorizontal: false,
								horizontal: false,
								className: "output-scroller",
								components: [
									{kind: "BasicRichText",
										flex: 10,
										richContent: false,
										className: "editor-input",
										onblur: "generateMarkdown"
									}
								]
							},
							{className: "desk-right", flex: 1}
						]}
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "62px", flex:0, //peekHeight: 54,
				onResize: "barMoved",
				components: [
					{kind: "Header", pack: "center", className: "enyo-toolbar fake-toolbar", components: [
						{kind: "GrabButton", className: "HGrabButton"},
						{kind: "ToolButtonGroup", className: "enyo-toolbutton-dark", components: [
							{caption: "Headline"},
							{caption: "List"},
							{caption: "Link"},
							{caption: "Quote"},
							{caption: "Image"},
						]}
					]},
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, components: [
							{className: "desk-left", flex: 1},
							{kind: "BasicScroller",
								flex: 10,
								autoHorizontal: false,
								horizontal: false,
								className: "output-scroller",
								components: [
									{kind: "HtmlContent", className: "output-preview"}
								]
							},
							{className: "desk-right", flex: 1}
						]}
					]}
			]}
		]}
	],
	generateMarkdown: function() {
		var converter = new Showdown.converter();
		this.$.htmlContent.setContent(converter.makeHtml(this.$.basicRichText.value));
	},
	barMoved: function(event) {
		if(event.slidePosition == 0)
			this.$.basicRichText.forceFocus();
	}
});
