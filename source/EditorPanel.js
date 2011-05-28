/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, components: [
			{name: "top", kind:"HSlidingView", 
				components: [
					{kind: "HFlexBox", pack: "center", components: [
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
									onblur: "editorBlurred",
									onfocus: "editorFocussed"
								}
							]
						},
						{className: "desk-right", flex: 1, overflow: "hidden" }
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "740px", fixedHeight: true, style: "z-index: 1000;",
				//onResize: "barMoved",
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
			enyo.keyboard.show();
			this.$.editorScroller.setScrollTop(this.$.previewScroller.scrollTop/this.$.previewScroller.getBoundaries().bottom*this.$.editorScroller.getBoundaries().bottom);
			//this.$.editor.forceFocus(); // buggy with on screen keyboard
			this.$.print.addClass("enyo-button-disabled");
			this.$.print.disabled = true;
		}
		else {  // up position
			this.position = "up";
			enyo.keyboard.hide();
			this.$.previewScroller.setScrollTop(this.$.editorScroller.scrollTop/this.$.editorScroller.getBoundaries().bottom*this.$.previewScroller.getBoundaries().bottom);
			this.$.print.removeClass("enyo-button-disabled");
			this.$.print.disabled = false;
		}

		//this.generateMarkdown();
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
	/* EDITOR CALLBACKS */
	helpMarkdown: function() {
		this.$.markdownHelper.openAtCenter(this.$.helpmarkdown);
	},
	helpTypewriter: function() {
		this.$.typewriterHelper.openAtCenter(this.$.helptypewriter);
	},
	
	editorBlurred: function() {
		var converter = new Showdown.converter();
		
		var value = this.$.editor.getValue();
		this.$.preview.setContent(converter.makeHtml(value));
	},
	editorFocussed: function() {
	},
	
	/* CONSTRUCTOR */
	
	ready: function() {
		enyo.keyboard.setResizesWindow(false);
		this.$.editor.setValue(this.$.Demotext.text);
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.adjustSlidingSize();
	},
	resizeHandler: function() {
		this.adjustSlidingSize();
		var v = this.$.slidingPane.view;
		if (v && v.resizeHandler) {
			v.resizeHandler();
		}
	},
	adjustSlidingSize: function() {
		this.$.bottom.style.height = enyo.fetchControlSize(this).h-700;
		var s = enyo.fetchControlSize(this);
		var pcs = enyo.fetchControlSize(this.$.bottom.$.client);
		this.$.top.node.style.height = (s.h - 64) + "px";
		this.$.bottom.setPeekHeight(s.h - pcs.h);
	},
});
