enyo.kind({
	name: 'typewriterHelper',
	kind: "Popup",
	defaultKind:"Item",
	components: [
		{className: "enyo-first", components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
					"Title of Work\n" + 
					"=============\n" +
					"\n" +
					"This text is styled to resemble a cover page\n" +
					"\n" +
					"----\n" +
					"\n" +
					"The horizontal ruler (above) makes this become regular text"
				},
				{kind: "Label", content:"Cover Page"}
			]}
		]},
		{className: "enyo-last", components: [
			{kind: "HFlexBox", components: [
				{className: "markdownHelper", flex: 1, content: ""+
			"Title of Work\n" + 
			"=============\n" +
			"\n" +
			"This text is styled to resemble a cover page\n" +
			"\n" +
			"First Chapter\n" +
			"-------------\n" +
			"\n" +
			"This text is not on the cover page but the first chapter"
				},
				{kind: "Label", content:"Cover Page"}
			]}
		]}
	]
});
