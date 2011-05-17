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
	" - Type Markdown text [in the window][editor]\n"+
	" - See the HTML after [dragging up the toolbar][preview]\n"+
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
	"Or go right ahead, [clear the editor][clear] and start typing.\n"+
	"\n"+
	"  [john gruber]: http://daringfireball.net/\n"+
	"  [1]: http://daringfireball.net/projects/markdown/\n"+
	"  [editor]: #about:editor\n"+
	"  [preview]: #about:preview\n"+
	"  [clear]: #about:clear";

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight:1, components: [
			{name: "top", height: "100%", kind:"HSlidingView", 
				components: [
					{kind: "Header", components: [
						{kind:"Image", "src":"images/icon.png"},
						{content: "Typewriter", "style": "padding-left: 10px;"},
						{kind: "Spacer", flex: 11},
						{kind: "ToolButtonGroup", components: [
							{caption: "Save File", onclick: "saveFile"},
							{caption: "Open File...", onclick: "openFile"}
						]},
						{kind: "Spacer"}
					]},
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, components: [
							{className: "desk-left", flex: 1},
							{kind: "BasicScroller",
								name:"editorScroller",
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
					{kind: "Header", className: "enyo-toolbar fake-toolbar", components: [
						{kind: "GrabButton", className: "HGrabButton"},
						{kind: "Spacer"},
						{kind: "ToolButtonGroup", className: "enyo-toolbutton-dark", components: [
							{caption: "Headline", name:"markupheadline", className: "markuphelper"},
							{caption: "List", name:"markuplist", className: "markuphelper"},
							{caption: "Link", name:"markuplink", className: "markuphelper"},
							{caption: "Quote", name:"markupquote", className: "markuphelper"},
							{caption: "Image", name:"markupimage", className: "markuphelper"},
						]},
						{kind: "Spacer", flex: 10},
						{kind: "ToolButtonGroup", className: "enyo-toolbutton-dark", components: [
							{caption: "Print", name:"print", onclick: "printDocument"}
						]},
						{kind: "Spacer"},
						{kind: "GrabButton", className: "HGrabButton Right"},
					]},
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, components: [
							{className: "desk-left", flex: 1},
							{kind: "BasicScroller",
								name:"previewScroller",
								flex: 10,
								autoHorizontal: false,
								horizontal: false,
								className: "output-scroller",
								components: [
									{kind: "HtmlContent",
										name: "preview",
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
		{kind: "PrintDialog", 
			duplexOption: true,
			frameToPrint: {name:"preview", landscape:false},
			appName: "Typewriter"
		}
	],
	generateMarkdown: function() {
		var converter = new Showdown.converter();
		
		var value = this.$.editor.getValue();
		this.$.preview.setContent(converter.makeHtml(value));
		//this.$.htmlContent.setContent(converter.makeHtml(example));
	},
	barMoved: function(event) {
		if(event.slidePosition == 0) { // down position
			this.position = "down";
			this.$.editorScroller.setScrollTop(this.$.previewScroller.scrollTop/this.$.previewScroller.getBoundaries().bottom*this.$.editorScroller.getBoundaries().bottom);
			//this.$.editor.forceFocus(); // buggy with on screen keyboard
			this.$.print.addClass("enyo-button-disabled");
			this.$.print.disabled = true;
			
			//this.$$.select(".markuphelper").each(function(item) {
			//	item.removeClass("enyo-button-disabled");
			//	item.disabled = false;
			//});
			
			this.$.markupheadline.removeClass("enyo-button-disabled");
			this.$.markuplist.removeClass("enyo-button-disabled");
			this.$.markuplink.removeClass("enyo-button-disabled");
			this.$.markupquote.removeClass("enyo-button-disabled");
			this.$.markupimage.removeClass("enyo-button-disabled");
			this.$.markupheadline.disabled = false;
			this.$.markuplist.disabled = false;
			this.$.markuplink.disabled = false;
			this.$.markupquote.disabled = false;
			this.$.markupimage.disabled = false;
		}
		else {  // up position
			this.position = "up";
			this.$.previewScroller.setScrollTop(this.$.editorScroller.scrollTop/this.$.editorScroller.getBoundaries().bottom*this.$.previewScroller.getBoundaries().bottom);
			this.$.print.removeClass("enyo-button-disabled");
			this.$.print.disabled = false;
			
			//this.$$.select(".markuphelper").each(function(item) {
			//	item.addClass("enyo-button-disabled");
			//	item.disabled = true;
			//});
			
			this.$.markupheadline.addClass("enyo-button-disabled");
			this.$.markuplist.addClass("enyo-button-disabled");
			this.$.markuplink.addClass("enyo-button-disabled");
			this.$.markupquote.addClass("enyo-button-disabled");
			this.$.markupimage.addClass("enyo-button-disabled");
			this.$.markupheadline.disabled = true;
			this.$.markuplist.disabled = true;
			this.$.markuplink.disabled = true;
			this.$.markupquote.disabled = true;
			this.$.markupimage.disabled = true;
		}

		this.generateMarkdown();
	},
	htmlContentLinkClick: function(sender, url) {
		var splits = url.split(/#/).slice(-1).pop();
		switch(splits) {
			case "about:clear":
				this.$.editor.setValue("");
			case "about:editor":
				this.$.slidingPane.selectView(this.$.top);
				return false;
				break;
			case "about:preview":
				this.$.slidingPane.selectView(this.$.bottom);
				return false;
				break;
			default:
				var r = new enyo.PalmService();
				r.service = "palm://com.palm.applicationManager/";
				r.method = "open";
				r.call({target: url});
		}
	},
	printDocument: function() {
		if(this.position == "down") {
			alert("Preview first!");
		}
		else {
			this.$.printDialog.openAtCenter();
		}
	},
	openFile: function() {
		this.$.filePicker.pickFile();
	},
	handleFile: function(inSender, msg) {
		this.$.editor.setValue(enyo.json.stringify(msg));
	},
	ready: function() {
		this.$.editor.forceFocus();
	}
});
