enyo.kind({
	name: 'markdownHelper',
	kind: enyo.Popup,
	defaultKind: "Item",
	components: [
		{className: "enyo-first", components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"Headline 1\n" + 
					"==========\n" + 
					"\n" +
					"Headline 2\n" + 
					"----------\n" +
					"\n" +
					"### Headline 3"
				},
				{kind: "Label", content:"Headlines"}
			]}
		]},
		{components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"Paragraphs are separated by an empty line\n" + 
					"\n" + 
					"Linebreaks are preceded by two spaces at the end of the line"
				},
				{kind: "Label", content:"Paragraphs"}
			]}
		]},
		{components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					" 1. Numbered Listitem\n" + 
					" 2. Numbered Listitem \n" + 
					"   * Nested unordered List"
				},
				{kind: "Label", content:"Lists"}
			]}
		]},
		{components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"> A Quote\n" +
					"> > A nested Quote"
				},
				{kind: "Label", content:"Quotes"}
			]}
		]},
		{components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"----"
				},
				{kind: "Label", content:"Horizontal Rules"}
			]}
		]},
		{components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"[link name][alias]\n" + 
					"\n" + 
					"  [alias]: http://www.google.de/"
				},
				{kind: "Label", content:"Links"}
			]}
		]},
		{className: "enyo-last", components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"    /* indented by 4 or more spaces */\n"+
					"    function(x,y)..."
				},
				{kind: "Label", content:"Code"}
			]}
		]}
	]
});
