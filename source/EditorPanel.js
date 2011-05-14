/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, components: [
			{name: "top", height: "100%", kind:"HSlidingView",
				components: [
					{kind: "Header", content:"Editor", },
					{kind: "BasicScroller", autoHorizontal: false, horizontal: false, className: "editor-scroller", components: [
						{kind: "BasicRichText",
							hint: "type something here",
							richContent: false,
							className: "editor-input",
							onblur: "generateMarkdown"
						}
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "54px", flex:0, peekHeight: 54,
				components: [
					{kind: "Header", content:"Preview", className: "enyo-toolbar fake-toolbar"},
					{kind: "BasicScroller", autoHorizontal: false, horizontal: false, className: "output-scroller", components: [
						{kind: "HtmlContent", content: "This is some short text", className: "output-preview"}
					]}
			]}
		]}
	],
	generateMarkdown: function() {
		var converter = new Showdown.converter();
		this.$.htmlContent.setContent(converter.makeHtml(this.$.basicRichText.value));
	}
});
