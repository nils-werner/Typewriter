/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight: 0, 
			onSlideComplete: "barMoved",
			components: [
			{name: "top", kind:"HSlidingView", 
				components: [
					{kind: "HFlexBox", pack: "center", components: [
						{className: "desk-left", flex: 1, overflow: "hidden" },
						{kind: "BasicScroller",
							name:"editorScroller",
							height: "100px",
							width: "760px",
							autoHorizontal: false,
							horizontal: false,
							className: "editor-scroller",
							components: [
								{kind: "BasicRichText",
									name: "editor",
									richContent: false,
									className: "editor-input",
									onblur: "syncViews",
									onfocus: "editorFocussed",
									onmouseup: "syncViews"
								}
							]
						},
						{className: "desk-right", flex: 1, overflow: "hidden" }
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "100px", fixedHeight: true, pack:"end", style:"overflow: hidden;",
				applySlideToNode: function(inSlide) {
					if (inSlide != this.slidePosition && this.index) {
						inSlide = Math.min(0,inSlide);
						this.lastSlidePosition = this.slidePosition;
						this.slidePosition = inSlide;
						if (this.hasNode()) {
							//this.log(this.id, inSlide);
							var t = inSlide !== null ? "translate3d(0," + inSlide + "px,0)" : "";
							this.domStyles["-webkit-transform"] = this.node.style.webkitTransform = t;
							var s = inSlide !== null ? "translate3d(0,"+ (-enyo.fetchControlSize(this).h-inSlide+55) + "px,0)" : "";
							this.$.client.children[1].node.style.webkitTransform = s;
						}
					}
				},
				resizeHandler: function() {
					//var s = "translate3d(0,1px,0)";
					var s = "translate3d(0," + (55-enyo.fetchControlSize(this).h) + "px,0)";
					this.node.style.webkitTransform = s;
				},
				components: [
					{kind: "Header", name: "header", height: "55px",className: "enyo-toolbar fake-toolbar", style:"z-index: 1000;", components: [
						{kind: "GrabButton", className: "HGrabButton"},
						{kind: "Spacer", flex: 1},
						{kind: "Image", src:"images/title.png"},
						{kind: "Spacer", flex: 25},
						{kind: "GrabButton", className: "HGrabButton Right"}
					]},
					{kind: "VFlexBox", flex: 1,
						components: [
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
										onLinkClick: "htmlContentLinkClick",
										onmouseup: "syncViews"
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
			{caption: "Print", name:"print", onclick: "printDocument"}
		]},
		{kind: enyo.ApplicationEvents, 
			onWindowDeactivated: "sleep",
			onWindowActivated: "wakeup"
		},
		{kind: "Scrim", name:"scrim", layoutKind: "VFlexLayout", align:"end", pack:"end", style:"background-color: transparent; opacity: 1;", components: [
			{kind: "Image", src:"images/bigicon.png", style: "margin-right: 20px; margin-bottom: 65px;"}
		]}
	],
	
	sleep: function() {
		//if(this.position == "down")
		//	this.$.top.node.style.height = enyo.fetchControlSize(this).h + "px";
		this.$.scrim.show();
	},
	
	wakeup: function() {
		//this.$.top.node.style.height = (enyo.fetchControlSize(this).h - 55 - enyo.keyboard.height) + "px";
		this.$.scrim.hide();
	},
	
	/* PREVIEW HANDLING */
	synccount: 0,
	
	barMoved: function(event) {
		if(event.view == this.$.top) {
			this.position = "down";
		}
		else {
			this.position = "up";
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
		this.$.slidingPane.selectViewByIndex(1);
		this.$.printDialog.openAtCenter();
	},
	/* EDITOR CALLBACKS */
	helpMarkdown: function() {
		this.$.markdownHelper.openAtCenter(this.$.helpmarkdown);
	},
	helpTypewriter: function() {
		this.$.typewriterHelper.openAtCenter(this.$.helptypewriter);
	},
	editorFocussed: function() {
		enyo.keyboard.show();
	},
	
	syncViews: function(inSender, inEvent) {

		var eb = this.$.editorScroller.getBoundaries().bottom;
		var et = this.$.editorScroller.getBoundaries().top;
		var ec = this.$.editorScroller.scrollTop;
		var ep = eb!=0 ? ec/eb : 0;
		ep = Math.max(0,ep);
		ep = Math.min(1,ep);
		
		if(this.position == "up")
			var pb = this.$.previewScroller.getBoundaries().bottom;
		else // weirdly enough the preview box appears to be bigger if the bar is down. we'll simply substract the height added here.
			var pb = this.$.previewScroller.getBoundaries().bottom - enyo.fetchControlSize(this).h+55;
		var pt = this.$.previewScroller.getBoundaries().top;
		var pc = this.$.previewScroller.scrollTop;
		var pp = pb!=0 ? pc/pb : 0;
		pp = Math.max(0,pp);
		pp = Math.min(1,pp);
		
		if(this.$.bottom.slidePosition == 0 || -enyo.fetchControlSize(this).h == this.$.bottom.slidePosition-55) {
			if(this.position == "up") {
				//enyo.keyboard.hide();
				this.$.editorScroller.setScrollTop(pp * eb);
			}
			else {
				//enyo.keyboard.show();
				this.$.previewScroller.setScrollTop(ep * pb);
				//this.$.editor.forceFocus(); // buggy with on screen keyboard
			}
		}
		if(this.synccount == 0 || inSender.name != "schedule") {
			this.makePreview();
		}
		this.synccount++;
		this.synccount = this.synccount % 3;
	},
	
	makePreview: function() {
		console.log("generating Markdown");
		var converter = new Showdown.converter();
		var value = this.$.editor.getValue();
		this.$.preview.setContent(converter.makeHtml(value));
	},
	
	setSchedule: function() {
		this.scheduleID = setInterval(enyo.bind(this,function() {
			this.syncViews({name:"schedule"});
		}), 500);
	},
	clearSchedule: function() {
		clearInterval(this.scheduleID);
	},
	
	/* CONSTRUCTOR */
	
	ready: function() {
		enyo.windows.assignWindowParams(window, { // this appears to be broken
			blockScreenTimeout: false,
			setSubtleLightbar: true
		});
		this.position = "down";
		enyo.keyboard.setManualMode(true);
		//enyo.keyboard.setResizesWindow(false);
		enyo.keyboard.show();
		this.$.editor.setValue(this.$.Demotext.text);
		this.syncViews({name:"startup"});
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.adjustSlidingSize();
		this.setSchedule();
	},
	resizeHandler: function() {
		this.adjustSlidingSize();
		var v = this.$.slidingPane.view;
		if (v && v.resizeHandler) {
			v.resizeHandler();
		}
	},
	adjustSlidingSize: function() {
		var s = enyo.fetchControlSize(this);
		var pcs = enyo.fetchControlSize(this.$.bottom.$.client);
		
		this.$.editorScroller.node.style.height = (s.h - 55 - enyo.keyboard.height) + "px";
		
		this.$.top.node.style.height = (s.h - 55 - enyo.keyboard.height) + "px";
		this.$.bottom.node.style.height = (s.h - enyo.keyboard.height) + "px";
		this.$.bottom.setPeekHeight(s.h - pcs.h);
	},
});
