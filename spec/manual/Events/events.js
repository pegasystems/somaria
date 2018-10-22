let eventsJSON = {
	drawables: [
		"Text1Rect",
		"Rect1"
	],
	leafs: [
		"BroadcastEvent1"
	],
	blocks: [
		{
			type: "Interaction",
			id: "Interaction1"
		},
		{
			type: "Point",
			id: "Point2",
			inputs: [
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 40 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "EventReceive",
			id: "ReceiveEvent1",
			inputs: [
				{ accessType: "Value", value: "testMessage" }
			]
		},
		{
			type: "EventBroadcast",
			id: "BroadcastEvent1",
			inputs: [
				{ accessType: "Indexed", blockId:"Interaction1", index: 0 },
				{ accessType: "Value", value: "testMessage", index: 1 },
				{ accessType: "Value", value: "Good bye roger", index: 2}
			]
		},
		{
			type: "Text",
			id: "Text1",
			inputs: [
				{ accessType: "Indexed", blockId: "ReceiveEvent1", index: 0 },
				{ accessType: "Value", value: "Arial" },
				{ accessType: "Value", value: 26 },
				{ accessType: "Indexed", blockId: "RectColor", index: 0 }
			]
		},
		{
			type: "Rectangle",
			id: "Text1Rect",
			interactionId: "Interaction1",
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
		},
		{
			id: "RectColor",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0xFFFFFF },
				{ accessType: "Value", value: 1 }
			]
		},
		{
			id: "TransparentColor",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0x000000 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Rectangle",
			id: "Rect1",
			interactionId: "Interaction1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", output: 0 },
				{ accessType: "Value", value: 40 },
				{ accessType: "Value", value: 40},
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		}
	]
};