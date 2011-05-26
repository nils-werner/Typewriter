/* Copybottom 2009-2011 Hewlett-Packard Development Company, L.P. All bottoms reserved. */
/**
A view that slides back and forth and is designed to be a part of a
<a href="#enyo.HSlidingPane">SlidingPane</a>.

HSlidingView objects have a "dragAnywhere" property, whose default value is true. This allows
the user to drag the view from any point inside the panel that is not already a
draggable region (e.g., a Scroller). If dragAnywhere is set to false, then the view
can still be dragged via any control inside it whose "slidingHandler" property is set to true.

The "peekHeight" property specifies the amount the paneview should be offset from the top
when it is selected. This allows controls on the underlying view object to the top
of the selected one to be partially revealed.

HSlidingView has some other published properties that are less frequently used. The "minHeight" 
property specifies a minimum height for view content, and "edgeDragging" lets the user 
drag the view from its top edge. (The default value of edgeDragging is false.)

The last view in a HSlidingPane is special, it is resized to fit the available space. 
The onResize event is fired when this occurs.
*/
enyo.kind({
	name: "enyo.HSlidingView",
	kind: enyo.Control,
	className: "enyo-sliding-view",
	layoutKind: "VFlexLayout",
	events: {
		onResize: ""
	},
	published: {
		/** Can drag panel from anywhere (note: does not work if there's another drag surface (e.g. scroller)). */
		dragAnywhere: true,
		/** Can drag/toggle by dragging on top edge of sliding panel. */
		edgeDragging: false,
		/** Whether content height should or should not be adjusted based on size changes. */
		fixedHeight: false,
		/** Minimum content height. */
		minHeight: 0,
		/** Amount we should be shifted bottom to reveal panel underneath us when selected. */
		peekHeight: 0,
		/** Whether or not the view may be dragged bottom to dismiss it */
		dismissible: false
	},
	//* @protected
	chrome: [
		{name: "shadow", className: "enyo-sliding-view-shadow"},
		{name: "client", className: "enyo-bg", kind: enyo.Control, flex: 1},
		// NOTE: used only as a hidden surface to move sliding from the top edge
		{name: "edgeDragger", slidingHandler: true, kind: enyo.Control, className: "enyo-sliding-view-nub"}
	],
	slidePosition: 0,
	create: function() {
		this.inherited(arguments);
		this.layout = new enyo.HFlexLayout();
		this.edgeDraggingChanged();
		this.minHeightChanged();
	},
	// Add slide position to control offset calculation
	calcControlOffset: function(inControl) {
		var o = this.inherited(arguments);
		o.top += this.slidePosition;
		return o;
	},
	layoutKindChanged: function() {
		this.$.client.setLayoutKind(this.layoutKind);
	},
	edgeDraggingChanged: function() {
		this.$.edgeDragger.setShowing(this.edgeDragging);
	},
	// siblings
	findSiblings: function() {
		return this.pane.views;
	},
	getPreviousSibling: function() {
		return this.findSiblings()[this.index-1];
	},
	getNextSibling: function() {
		return this.findSiblings()[this.index+1];
	},
	getFirstSibling: function() {
		var s = this.findSiblings();
		return s[0];
	},
	getLastSibling: function() {
		var s = this.findSiblings();
		return s[s.length-1];
	},
	getLastShowingSibling: function() {
		var sibs = this.findSiblings();
		for (var i=0, s; s=sibs[i]; i++) {
			if (!s.showing) {
				return sibs[Math.max(0, i-1)];
			}
		}
		return sibs[i-1];
	},
	// selection
	select: function() {
		this.pane.selectView(this);
	},
	selectPrevious: function() {
		enyo.call(this.getPreviousSibling(), "select");
	},
	selectNext: function() {
		enyo.call(this.getNextSibling(), "select");
	},
	toggleSelected: function() {
		if (this == this.pane.view) {
			this.selectPrevious();
		} else {
			this.select();
		}
	},
	showingChanged: function(inOldValue) {
		if (!this.hasNode()) {
			this.inherited(arguments);
		} else if (!this.pane.dragging && (inOldValue != this.showing)) {
			this.dispatch(this.owner, this.showing ? this.onShow : this.onHide);
			this.pane.stopAnimation();
			if (this.showing) {
				this.inherited(arguments);
				this.applySlideToNode(this.calcSlideHidden());
			}
			this.overSliding = true;
			this.pane.playAnimation(this);
		}
	},
	// sliding calculations
	calcSlide: function() {
		var i = this.index;
		var si = this.pane.view.index;
		var state = this.shouldSlideHidden() ? "Hidden" : (i == si ? "Selected" : (i < si ? "Before" : "After"));
		return this["calcSlide" + state]();
	},
	// FIXME: re-consider offset caching, pita: required to reset on resize.
	getTopOffset: function() {
		if (this.hasNode()) {
			this._offset = undefined;
			return this._offset !== undefined ? this._offset : (this._offset = this.node.offsetTop);
		}
		return 0;
	},
	calcSlideMin: function() {
		var x = -this.getTopOffset();
		return this.peekHeight + x;
	},
	calcSlideMax: function() {
		var c = this.getPreviousSibling();
		var x = (c && c.slidePosition) || 0;
		//this.log(this.id, x);
		return x;
	},
	// before selected
	calcSlideBefore: function() {
		var m = this.calcSlideMin();
		if (this.pane.isAnimating() || this.pane.dragging) {
			var c = this.getNextSibling();
			if (this.hasNode() && c) {
				return Math.max(m, c.slidePosition);
			}
		}
		return m;
	},
	calcSlideSelected: function() {
		return this.calcSlideMin();
	},
	// after selected
	calcSlideAfter: function() {
		if (this.pane.isAnimating() || this.pane.dragging) {
			return this.calcSlideMax();
		} else {
			var s = this.pane.view;
			return s ? s.calcSlideMin() : 0;
		}
	},
	calcSlideHidden: function() {
		var x = this.hasNode() && this.parent.hasNode() ? this.parent.node.offsetHeight - this.getTopOffset() : 0;
		//this.log(this.slidePosition, x);
		return x;
	},
	shouldSlideHidden: function() {
		var p = this;
		do {
			if (!p.showing) {
				return true;
			}
		} while (p = p.getPreviousSibling());
	},
	// movement
	// move this sliding and validate next.
	move: function(inSlide) {
		this.applySlideToNode(inSlide);
		// validate next sibling...
		var c = this.getNextSibling();
		if (c) {
			c.validateSlide();
		}
	},
	applySlideToNode: function(inSlide) {
		if (inSlide != this.slidePosition && this.index) {
			this.lastSlidePosition = this.slidePosition;
			this.slidePosition = inSlide;
			if (this.hasNode()) {
				//this.log(this.id, inSlide);
				var t = inSlide !== null ? "translate3d(0," + inSlide + "px,0)" : "";
				this.domStyles["-webkit-transform"] = this.node.style.webkitTransform = t;
			}
		}
	},
	// move to our calculated position
	validateSlide: function() {
		this.move(this.calcSlide());
	},
	// move all before this index to calculated position
	validateSlideBefore: function() {
		var s = this.getFirstSibling();
		while (s) {
			if (s.index != this.index) {
				s.applySlideToNode(s.calcSlide());
				s = s.getNextSibling();
			} else {
				break;
			}
		}
	},
	// animation
	canAnimate: function() {
		return (this.index != 0 && this.slidePosition != this.calcSlide());
	},
	// move this, then slide each previous and force before mode.
	animateMove: function(inSlide, inOverSliding) {
		this.move(inSlide);
		if (!inOverSliding) {
			var p = this.getPreviousSibling();
			while (p) {
				p.applySlideToNode(p.calcSlideBefore());
				p = p.getPreviousSibling();
			}
		}
	},
	// dragging
	dragstartHandler: function(inSender, e) {
		e.sliding = this;
	},
	isDraggableEvent: function(inEvent) {
		var c = inEvent.dispatchTarget;
		return c && c.slidingHandler || this.dragAnywhere;
	},
	canDrag: function(inDelta) {
		this.dragMin = this.calcSlideMin();
		this.dragMax = this.calcSlideMax();
		//
		var i = this.index;
		var si = this.pane.view.index;
		// first index not draggable
		if (i && this.showing && i >= si) {
			var x = this.slidePosition + inDelta;
			var c = this.dragMax != this.dragMin && (x >= this.dragMin && x <= this.dragMax);
			return c;
		}
	},
	isAtDragMax: function() {
		return this.slidePosition == this.dragMax;
	},
	isAtDragMin: function() {
		return this.slidePosition == this.dragMin;
	},
	isAtDragBoundary: function() {
		return this.isAtDragMax() || this.isAtDragMin();
	},
	beginDrag: function(e, inDx) {
		this.validateSlideBefore();
		this.dragStart = this.slidePosition - inDx;
	},
	isMovingToSelect: function() {
		return this.slidePosition < this.lastSlidePosition;
	},
	drag: function(e) {
		// bail if we are waiting for an animation or not moving
		var x0 = e.dy + this.dragStart;
		if (this.pendingDragMove || (x0 == this.slidePosition)) {
			return;
		}
		var x = Math.max(this.dragMin, Math.min(x0, this.overSliding ? 1e9 : this.dragMax));
		this.shouldDragSelect = x0 < this.slidePosition;
		// if out of bounds, return boundary info
		if ((x0 < this.dragMin) || (x0 > this.dragMax && !this.overSliding) || (x0 < this.dragMax && this.overSliding)) {
			return {select: this.getDragSelect()};
		} else {
			this.pendingDragMove = this._drag(x);
		}
	},
	_drag: function(inX) {
		this.move(inX);
		this.pendingDragMove = null;
	},
	dragFinish: function() {
		return {select: this.getDragSelect()};
	},
	getDragSelect: function() {
		if (this.shouldDragSelect && !this.overSliding) {
			return this;
		} else {
			// select previous sibling if it is out of position or first
			var p = this.getPreviousSibling();
			return p && ((p.slidePosition < p.calcSlideMax()) || (p.index == 0)) ? p : null;
		}
	},
	// sizing
	// don't auto-adjust height if fixedHeight is true
	fixedHeightChanged: function() {
		if (this.fixedHeight) {
			this.applySize();
		}
	},
	minHeightChanged: function() {
		this.$.client.applyStyle("min-height", this.minHeight || null);
	},
	applySize: function(inSuggestFit) {
		var w;
		if (inSuggestFit && !this.fixedHeight) {
			w = this.calcFitHeight();
		} else if (this.$.client.domStyles.height) {
			w = null;
		}
		if (w !== undefined) {
			w = (w ? w + "px" : null);
			// apply fast-like
			if (this.$.client.hasNode()) {
				this.$.client.domStyles.height = this.$.client.node.style.height = w;
				this.doResize(w);
			}
		}
	},
	calcFitHeight: function() {
		var w = null;
		if (this.hasNode() && this.$.client.hasNode()) {
			var pw = this.parent.getBounds().height;
			var l = this.getTopOffset();
			w = Math.max(0, Math.min(pw, pw - l - (this.slidePosition||0)));
		}
		return w;
	},
	clickHandler: function(inSender, inEvent) {
		if (inEvent.dispatchTarget.slidingHandler) {
			this.toggleSelected();
		}
		this.doClick(inEvent);
	},
	setShadowShowing: function(inShow) {
		this.$.shadow.setShowing(inShow);
	}
});
