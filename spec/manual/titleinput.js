let titleVisualizationJSON = {
	drawables: [
		"Text1Rect"
	],
	blocks: [
		{
			id: "TransparentColor",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0x000000 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			id: "TextColor",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0x000000 },
				{ accessType: "Value", value: 1 }
			]
		},
		{
			type: "Text",
			id: "Text1",
			inputs: [
				{ accessType: "Value", value: "Visualization Engine Manual Test" },
				{ accessType: "Value", value: "Arial" },
				{ accessType: "Value", value: 26 },
				{ accessType: "Indexed", blockId: "TextColor", index: 0 }
			]
		},
		{
			type: "Rectangle",
			id: "Text1Rect",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Text1", index: 1 },
				{ accessType: "Indexed", blockId: "Text1", index: 2 },
				{ accessType: "Indexed", blockId: "TransparentColor", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Text1", index: 0 }
			]
		}
	]
};