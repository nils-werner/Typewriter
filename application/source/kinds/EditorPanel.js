/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */

enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	events: {
		onLinkClick: ""
	},
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, multiViewMinHeight: 0, 
			onSlideComplete: "barMoved",
			components: [
			{name: "top",
				kind:"HSlidingView",

				components: [
					{kind: "HFlexBox", pack: "center", components: [
						{className: "editor-left", flex: 1, overflow: "hidden", onclick: "woodTapped" },
						{kind: "enyoextras.ScrollBarsScroller",
							name:"editorScroller",
							height: "760px",
							width: "760px",
							autoHorizontal: false,
							horizontal: false,
							className: "editor-scroller",
							components: [
								{kind: "RichText",
									name: "editor",
									richContent: false,
									className: "editor-input",
									onblur: "syncViews",
									onfocus: "editorFocussed",
									onmouseup: "syncViews",
									hint: "",
									styled: false,
									setValue: function(inValue) {
										this.$.input.setContent(inValue);
									}
								}
							]
						},
						{className: "editor-right", flex: 1, overflow: "hidden", onclick: "woodTapped" }
					]}
			]},
			{name: "bottom",
				kind:"HSlidingView",
				height: "100px",
				fixedHeight: true,
				pack:"end",
				style:"overflow: hidden;",

				
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
					{kind: "Header", name: "header", height: "55px",className: "enyo-toolbar fake-toolbar", style:"z-index: 1000;", 
						onmousedown: "sliderclicked",
						onmouseup: "sliderreleased",
						components: [
						{kind: "GrabButton", className: "HGrabButton"},
						{kind: "Spacer", style:"width: 1px;"},
						{content: "", name:"filename"},
						//{kind: "Image", src:"images/title.png", style:"margin-top: 4px;"},
						{kind: "Spacer", flex: 25},
						//{content: "Typewriter"},
						{kind: "Spacer", style:"width: 1px;"},
						{kind: "GrabButton", className: "HGrabButton Right"}
					]},
					{kind: "VFlexBox", flex: 1,
						components: [
						{kind: "HFlexBox", flex: 1, pack: "center", components: [
							{className: "preview-left", flex: 1, overflow: "hidden", onclick: "woodTapped" },
							{kind: "enyoextras.ScrollBarsScroller",
								name:"previewScroller",
								width: "760px",
								autoHorizontal: false,
								horizontal: false,
								className: "output-scroller",
								components: [
									{kind: "DragHint"},
									{kind: "HtmlContent",
										name: "preview",
										className: "output-preview",
										onLinkClick: "htmlContentLinkClick"
									}
								]
							},
							{className: "preview-right", flex: 1, overflow: "hidden", onclick: "woodTapped" }
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
	
	/* PREVIEW HANDLING */
	synccount: 0,
	start: new Date(),
	
	hasBeenResized: false,
	hasBeenSet: false,
	
	barBeingDragged: false,
	
	xslt: new Transformation(),
	
	sliderclicked: function() {
		this.barBeingDragged = true;
	},
	
	sliderreleased: function() {
		this.barBeingDragged = false;
	},
	
	woodTapped: function(inSender, inEvent) {
		if(inSender.className.match('v') == null) // enthält "v", ist also "preview"
			this.$.slidingPane.selectViewByIndex(1);
		else
			this.$.slidingPane.selectViewByIndex(0);
	},
	
	barMoved: function(event) {
		if(event.view == this.$.top) {
			this.position = "down";
		}
		else {
			this.position = "up";
		}

		//this.generateMarkdown();
	},
	htmlContentLinkClick: function(inSender, url) {
		var splits = url.split(/#/).slice(-1).pop();
		this.doLinkClick(url, splits);
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
			case "create":
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
	editorFocussed: function() {
		enyo.keyboard.show();
	},
	
	syncViews: function(inSender, inEvent) {
		if(this.synccount == 0 || inSender.name != "schedule") {
			this.makePreview();
		}
		this.synccount++;
		this.synccount = this.synccount % 3;
	},
	
	makePreview: function() {
		var selection = this.$.editor.getSelection();
		if(selection) {
			var oldselectionButton = document.getElementById("selection");
			if(oldselectionButton) {
				oldselectionButton.parentNode.removeChild(oldselectionButton);
			}
			
			var selectionButton = document.createElement('span');
			selectionButton.setAttribute('id', 'selection');
			
			var textnode = document.createTextNode("<span id='renderedselection'>04c1d67d13f0b713047dc00a7652cd0e</span>");
			selectionButton.appendChild(textnode);
		
			var range = selection.getRangeAt(0);
			var newRange = document.createRange();
			newRange.setStart(selection.focusNode, range.endOffset);
			newRange.insertNode(selectionButton);
		}
		
		var selectionButton = document.getElementById("selection");
		if(selectionButton) {
			editorpos = selectionButton.offsetTop;
		}
		
		var renderedselectionButton = document.getElementById("renderedselection");
		if(renderedselectionButton) {
			previewpos = renderedselectionButton.offsetTop;
		}
		
		if(selectionButton && renderedselectionButton) {
			console.log(this.$.editorScroller.scrollTop + " " + this.$.previewScroller.scrollTop + " " + editorpos + " " + previewpos);
			var finalpos = this.$.editorScroller.scrollTop - editorpos + previewpos + 55;
			console.log(finalpos);
			if(finalpos >= 0)
				this.$.previewScroller.setScrollTop(finalpos);
		}
		
		this.start = new Date();
		//console.log("generating Markdown");
		var converter = new Showdown.converter();
		var value = this.$.editor.getText();
		var markdown = converter.makeHtml(value);
		
		this.xslt.setXml("<document>" + markdown + "</document>").transform();
	},
	
	setSchedule: function() {
		console.log("scheduling refresh");
		this.scheduleID = setInterval(enyo.bind(this,function() {
			this.syncViews({name:"schedule"});
		}), 5000);
	},
	clearSchedule: function() {
		console.log("UNscheduling refresh");
		clearInterval(this.scheduleID);
	},
	
	/* CONSTRUCTOR */
	
	ready: function() {
		this.position = "down";
		this.xslt.setXslt("stylesheets/LaTeX.xsl").setCallback(enyo.bind(this, 
			function(t) {
				console.log(t.getResult());
				this.$.preview.setContent(new XMLSerializer().serializeToString(t.getResult()));
				console.log(new Date()-this.start);
			}
		));
		this.syncViews({name:"startup"});
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.resizeHandler(); // war frueher adjustSlidingSize
	},

	resizeHandler: function() {
		this.adjustSlidingSize();
		var v = this.$.slidingPane.view;
		if (v && v.resizeHandler) {
			v.resizeHandler();
		}
		this.hasBeenResized = true;
		!this.hasBeenSwitched && this.bringBarUp();
	},

	adjustSlidingSize: function() {
		var s = enyo.fetchControlSize(this);
		var pcs = enyo.fetchControlSize(this.$.bottom.$.client);
		var kh = enyo.keyboard.isShowing() ? enyo.keyboard.height : 0;
		
		this.$.editorScroller.node.style.height = (s.h - 55 - kh) + "px";
		
		this.$.top.node.style.height = (s.h - 55 - kh) + "px";
		//this.$.bottom.node.style.height = (s.h - kh) + "px";
		//this.$.bottom.setPeekHeight(s.h - pcs.h);
		
		if(this.position == "up")
			this.$.bottom.slidePosition = this.$.bottom.lastSlidePosition = -(enyo.fetchControlSize(this.$.bottom).h-56);
	},
	
	getContent: function() {
		return this.$.editor.getText();
	},
	
	setContent: function(inContent, inFilename) {
		var inFilename = inFilename || "";
		this.$.editor.setValue(inContent);
		this.$.filename.setContent(inFilename.basename(".md"));
		this.$.dragHint.setVisible(inFilename == "");
		
		this.hasBeenSet = true;
		this.bringBarUp();
		
		this.syncViews({name:"setcontent"});
	},
	
	bringBarUp: function() {
		if(this.hasBeenSet && this.hasBeenResized && !this.hasBeenSwitched && this.$.filename.getContent() == "") {
			this.$.slidingPane.selectViewByIndex(1);
			this.hasBeenSwitched = true;
		}
	},
	
	setActive: function(inToggle) {
		if(inToggle == true) {
			this.$.editorScroller.removeClass("disabled");
			this.$.editor.setDisabled(false);
		}
		else {
			this.$.editorScroller.addClass("disabled");
			this.$.editor.setDisabled(true);
		}
	}
});
