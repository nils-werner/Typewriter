/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight:1, components: [
			{name: "top",flex: 1, kind:"HSlidingView", 
				components: [
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, pack: "center", components: [
							{className: "desk-left", flex: 1, overflow: "hidden" },
							{kind: "BasicScroller",
								name:"editorScroller",
								width: "760px",
								autoHorizontal: false,
								horizontal: false,
								className: "output-scroller",
								components: [
									{kind: "BasicRichText",
										name: "editor",
										richContent: false,
										className: "editor-input",
										onblur: "generateMarkdown",
										onfocus: "showKeyboard"
									}
								]
							},
							{className: "desk-right", flex: 1, overflow: "hidden" }
						]}
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "62px", flex:0, //peekHeight: 54,
				duringAnimation: function() { this.pane.validateViews(); },
				onResize: "barMoved",
				components: [
					{kind: "Header", className: "enyo-toolbar fake-toolbar", components: [
						{kind: "GrabButton", className: "HGrabButton"},
						{kind: "Spacer", flex: 1},
						{content:"Typewriter"},
						{kind: "Spacer", flex: 18},
						{kind: "ToolButtonGroup", className: "enyo-toolbutton-dark", components: [
							{caption: "Print", name:"print", onclick: "printDocument"}
						]},
						{kind: "Spacer"},
						{kind: "GrabButton", className: "HGrabButton Right"},
					]},
					{kind: "VFlexBox", flex: 1, components: [
						{kind: "HFlexBox", flex: 1, pack: "center", components: [
							{className: "desk-left", flex: 1, overflow: "hidden" },
							{kind: "BasicScroller",
								name:"previewScroller",
								width: "760px",
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
							{className: "desk-right", flex: 1, overflow: "hidden" }
						]}
					]}
			]}
		]},
		{name:'filePicker', kind: "FilePicker", fileType:["image"], allowMultiSelect:false, onPickFile: "handleFile"},
		{kind: "PrintDialog", 
			duplexOption: true,
			frameToPrint: {name:"preview", landscape:false},
			appName: "Typewriter"
		},
		{name: "markdownHelper", kind:"markdownHelper"},
		{name: "typewriterHelper", kind:"typewriterHelper"},
		{name:"Demotext", kind:"Demotext" },
		{kind: "AppMenu", components: [
			{caption: "Markdown Syntax Help", onclick: "helpMarkdown"},
			{caption: "Typewriter Syntax Help", onclick: "helpTypewriter"},
		]}
	],
	
	/* PREVIEW HANDLING */
	
	barMoved: function(event) {
		if(event.slidePosition == 0) { // down position
			this.position = "down";
			this.$.editorScroller.setScrollTop(this.$.previewScroller.scrollTop/this.$.previewScroller.getBoundaries().bottom*this.$.editorScroller.getBoundaries().bottom);
			//this.$.editor.forceFocus(); // buggy with on screen keyboard
			this.$.print.addClass("enyo-button-disabled");
			this.$.print.disabled = true;
		}
		else {  // up position
			this.position = "up";
			this.$.previewScroller.setScrollTop(this.$.editorScroller.scrollTop/this.$.editorScroller.getBoundaries().bottom*this.$.previewScroller.getBoundaries().bottom);
			this.$.print.removeClass("enyo-button-disabled");
			this.$.print.disabled = false;
		}

		//this.generateMarkdown();
	},
	generateMarkdown: function() {
		var converter = new Showdown.converter();
		
		var value = this.$.editor.getValue();
		this.$.preview.setContent(converter.makeHtml(value));
		//this.$.htmlContent.setContent(converter.makeHtml(example));
	},
	htmlContentLinkClick: function(sender, url) {
		var splits = url.split(/#/).slice(-1).pop();
		switch(splits) {
			case "clear":
				this.$.editor.setValue("");
			case "editor":
				this.$.slidingPane.selectView(this.$.top);
				return false;
				break;
			case "preview":
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
	
	/* PRINT HANDLING */
	
	printDocument: function() {
		if(this.position == "down") {
			alert("Preview first!");
		}
		else {
			this.$.printDialog.openAtCenter();
		}
	},
	/* MARKUP CALLBACKS */
	helpMarkdown: function() {
		this.$.markdownHelper.openAtCenter(this.$.helpmarkdown);
	},
	helpTypewriter: function() {
		this.$.typewriterHelper.openAtCenter(this.$.helptypewriter);
	},
	showKeyboard: function() {
		enyo.keyboard.show();
	},
	
	/* CONSTRUCTOR */
	
	ready: function() {
		enyo.keyboard.setManualMode(true);
		enyo.keyboard.show();
		this.$.editor.setValue(this.$.Demotext.text);
		this.generateMarkdown();
		this.$.editor.forceFocus();
	}
});
