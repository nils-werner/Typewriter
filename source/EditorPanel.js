/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
var example = ""+
	"Typewriter\n"+
	"==========\n"+
	"\n"+
	"Welcome to Typewriter, a Markdown editor for the HP TouchPad.\n"+
	"\n"+
	"Markdown lets you create HTML by entering text in a  \n"+
	"simple format that's easy to read and write.\n"+
	"\n"+
	" - Type Markdown text in the left window\n"+
	" - See the HTML in the right\n"+
	"   - See the HTML in the right\n"+
	" \n"+
	"Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site] [1]:\n"+
	"\n"+
	"> The overriding design goal for Markdown's\n"+
	"> formatting syntax is to make it as readable \n"+
	"> as possible. The idea is that a\n"+
	"> Markdown-formatted document should be\n"+
	"> publishable as-is, as plain text, without\n"+
	"> looking like it's been marked up with tags\n"+
	"> or formatting instructions.\n"+
	"\n"+
	"This document is written in Markdown; you are currently seeing the plaintext version. To get a feel for Markdown's syntax, type some text into the window and *pull up the toolbar*.\n"+
	"\n"+
	"  [john gruber]: http://daringfireball.net/\n"+
	"  [1]: http://daringfireball.net/projects/markdown/";

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight:1, components: [
			{name: "top", height: "100%", kind:"HSlidingView", 
				components: [
					{kind: "Header", components: [
						{content: "Typewriter", flex: 1},
						{kind: "ToolButtonGroup", components: [
							{caption: "Save File", onclick: "saveFile"},
							{caption: "Open File...", onclick: "openFile"}
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
									{kind: "BasicRichText",
										name: "editor",
										flex: 10,
										value: example,
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
									{kind: "HtmlContent",
										className: "output-preview",
										onLinkClick: "htmlContentLinkClick"
									}
								]
							},
							{className: "desk-right", flex: 1}
						]}
					]}
			]}
		]},
		{name:'filePicker', kind: "FilePicker", fileType:["image"], allowMultiSelect:false, onPickFile: "handleFile"},
	],
	generateMarkdown: function() {
		var converter = new Showdown.converter();
		
		var value = this.$.editor.getValue();
		this.$.htmlContent.setContent(converter.makeHtml(value));
		//this.$.htmlContent.setContent(converter.makeHtml(example));
	},
	barMoved: function(event) {
/*		if(event.slidePosition == 0) // buggy with on screen keyboard
			this.$.editor.forceFocus();
*/
	},
	htmlContentLinkClick: function(sender, url) {
		var r = new enyo.PalmService();
		r.service = "palm://com.palm.applicationManager/";
		r.method = "open";
		r.call({target: url});
	},
	openFile: function() {
		this.$.filePicker.pickFile();
	},
	handleFile: function(inSender, msg) {
		this.$.editor.value = enyo.json.stringify(msg);
	}
});
