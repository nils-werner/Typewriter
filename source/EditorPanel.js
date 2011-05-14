/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "EditorPanel",
	kind: enyo.HFlexBox,
	components: [
		{name: "slidingPane", kind: "HSlidingPane", flex: 1, components: [
			{name: "top", height: "100%", kind:"HSlidingView", components: [
					{kind: "Header", content:"Editor", },
					{kind: "Scroller", components: [
						//Insert your components here
					]}
			]},
			{name: "bottom", kind:"HSlidingView", height: "54px", flex:0, components: [
					{kind: "Header", content:"Preview", className: "enyo-toolbar"},
					{kind: "Scroller", components: [
						//Insert your components here
					]}
			]}
		]}
	]
});
