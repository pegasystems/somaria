exports.Rect1 = {
	id: "Rect1",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value", value: 10 },
		{ accessType: "Value", value: 20 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.Rect2 = {
	id: "Rect2",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 },
		{ accessType: "Value", value: 40 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.Rect3 = {
	id: "Rect3",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value", value: 0 },
		{ accessType: "Value" },
		{ accessType: "Value", value: 40 },
		{ accessType: "Value", value: 40 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.Arithmetic1 = {
	id: "Arithmetic1",
	type: "Arithmetic",
	inputs: [
		{ accessType: "Value", value: 25 },
		{ accessType: "Value", value: 5 },
		{ accessType: "Value", value: "+" }
	]
};
exports.Number10 = {
	id: "Number10",
	type: "Number",
	inputs: [
		{ accessType: "Value", value: 10 }
	]
};
exports.EventBroadcast1 = {
	id: "EventBroadcast1",
	type: "EventBroadcast",
	inputs: [
		{ accessType: "Value", value: 1 },
		{ accessType: "Value", value: "TestEvent" },
		{ accessType: "Value", value: { test: "pass" } }
	]
};

exports.Macro1 = {
	id: "Macro1",
	type: "Macro",
	leafs: [ 
		exports.EventBroadcast1.id 
	],
	blocks: [
		exports.EventBroadcast1
	],
	publishedOutputs: [
	]
};

exports.AreaAndCircumference = {
	id: "AreaAndCircumference",
	type: "Macro",
	blocks: [
		{
			id: "Number10",
			type: "Number",
			inputs: [
				{ accessType: "Value", value: 20 }
			]
		},
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Radius", blockId: "Number10", index: 0 }
			]
		},
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 2 * Math.PI },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Radius" },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Arithmetic2",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: Math.PI },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Arithmetic3",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Radius" },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Radius" },
				{ accessType: "Value", value: "*" }
			]
		}
	],
	publishedOutputs: [
		{ accessType: "Indexed", id: "Circumference", blockId: "Arithmetic1", index: 0 },
		{ accessType: "Indexed", id: "Area", blockId: "Arithmetic2", index: 0 }
	]
};
exports.Rect4 = {
	id: "Rect4",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Published", blockId: "AreaAndCircumference", reference: "Area" },
		{ accessType: "Published", blockId: "AreaAndCircumference", reference: "Circumference" },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.NestedCircumference = {
	id: "NestedCircumference",
	type: "Macro",
	blocks: [
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Radius", blockId: "Number10", index: 0 }
			]
		},
		{
			id: "Circumference",
			type: "Macro",
			blocks: [
				{
					id: "PublishedInputs",
					type: "PublishedInputs",
					publishedOutputs: [
						{ accessType: "Published", id: "Radius", blockId: "PublishedInputs", reference: "Radius" }
					]
				},
				{
					id: "Arithmetic1",
					type: "Arithmetic",
					inputs: [
						{ accessType: "Value", value: 2 * Math.PI },
						{ accessType: "Published", blockId: "PublishedInputs", reference: "Radius" },
						{ accessType: "Value", value: "*" }
					]
				}
			],
			publishedOutputs: [
				{ accessType: "Indexed", id: "Circumference", blockId: "Arithmetic1", index: 0 }
			]
		}
	],
	publishedOutputs: [
		{ accessType: "Published", id: "Circumference", blockId: "Circumference", reference: "Circumference" }
	]
};
exports.Rect5 = {
	id: "Rect5",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value", value: 10 },
		{ accessType: "Published", blockId: "NestedCircumference", reference: "Circumference" },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.MacroDrawable = {
	id: "MacroDrawable",
	type: "MacroDrawable",
	blocks: [
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Width", blockId: "Arithmetic1", index: 0 }
			]
		},
		{
			id: "Rect2",
			type: "Rectangle",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Width" },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		},
		{
			id: "Rect1",
			type: "Rectangle",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Value", value: 70 },
				{ accessType: "Value", value: 60 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		}
	],
	drawables: [
		"Rect2",
		"Rect1"
	]
};
exports.IteratorDrawable_1 = {
	id: "IteratorDrawable_1",
	type: "IteratorDrawable",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value", value: -1 }
	],
	blocks: [
	],
	drawables: [
	]
};

exports.IteratorDrawable = {
	id: "IteratorDrawable",
	type: "IteratorDrawable",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value", value: 10 }
	],
	blocks: [
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Width", blockId: "Arithmetic1", index: 0 }
			]
		},
		{
			id: "IteratorVariables",
			type: "IteratorVariables"
		},
		{
			id: "MacroDrawable",
			type: "MacroDrawable",
			blocks: [
				{
					id: "IteratorVariables",
					type: "IteratorVariables"
				},
				{
					id: "Rect1",
					type: "Rectangle",
					inputs: [
						{ accessType: "Value" },
						{ accessType: "Value" },
						{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
						{ accessType: "Indexed", blockId: "IteratorVariables", index: 0 },
						{ accessType: "Value" },
						{ accessType: "Value" }
					]
				}
			],
			drawables: [
				"Rect1"
			]			
		} ,
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Width" },
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Arithmetic2",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 6 },
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 0 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Rect2",
			type: "Rectangle",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Width" },
				{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		},
		{
			id: "Rect1",
			type: "Rectangle",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 },
				{ accessType: "Indexed", blockId: "Arithmetic2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		}
	],
	drawables: [
		"Rect2",
		"Rect1",
		"MacroDrawable"
	]
};

exports.ExternalInput = {
	id: "PublishedInputs",
	type: "PublishedInputs",
	publishedOutputs: [
		{ accessType: "External", id: "Width" },
		{ accessType: "External", id: "Height" }
	]
};

exports.Rect6 = {
	id: "Rect6",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Published", blockId: "PublishedInputs", reference: "Width" },
		{ accessType: "Published", blockId: "PublishedInputs", reference: "Height" },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};

exports.Image1 = {
	id: "Image1",
	type: "Image",
	inputs: [
		{ accessType: "Value", value: "../images/analytics-good.svg" }
	]
};
exports.Number1 = {
	id: "Number1",
	type: "Number",
	inputs: [
		{ accessType: "Value", value: 20 }
	]
};

exports.Number2 = {
	id: "Number2",
	type: "Number",
	inputs: [
		{ accessType: "Value", value: 40 }
	]
};

exports.BinarySwitch1 = {
	id: "BinarySwitch1",
	type: "BinarySwitch",
	inputs: [
		{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
		{ accessType: "Indexed", blockId: "Number1", index: 0 },
		{ accessType: "Indexed", blockId: "Number2", index: 0 }
	]
};

exports.BinarySwitch2 = {
	id: "BinarySwitch2",
	type: "BinarySwitch",
	inputs: [
		{ accessType: "Indexed", blockId: "Interaction1", index: 1 },
		{ accessType: "Indexed", blockId: "Number1", index: 0 },
		{ accessType: "Indexed", blockId: "Number2", index: 0 }
	]
};

exports.BinarySwitch3 = {
	id: "BinarySwitch3",
	type: "BinarySwitch",
	inputs: [
		{ accessType: "Indexed", blockId: "Interaction2", index: 1 },
		{ accessType: "Indexed", blockId: "Number1", index: 0 },
		{ accessType: "Indexed", blockId: "Number2", index: 0 }
	]
};

exports.Interaction1 = {
	id: "Interaction1",
	type: "Interaction"
};

exports.Interaction2 = {
	id: "Interaction2",
	type: "Interaction"
};

exports.Rect7 = {
	id: "Rect7",
	type: "Rectangle",
	interactionId: "Interaction1",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "BinarySwitch1", index: 0 },
		{ accessType: "Indexed", blockId: "BinarySwitch1", index: 0 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};

exports.Rect9 = {
	id: "Rect9",
	type: "Rectangle",
	interactionId: "Interaction2",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "BinarySwitch3", index: 0 },
		{ accessType: "Indexed", blockId: "BinarySwitch3", index: 0 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};

exports.Rect8 = {
	id: "Rect8",
	type: "Rectangle",
	interactionId: "Interaction1",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "BinarySwitch2", index: 0 },
		{ accessType: "Indexed", blockId: "BinarySwitch2", index: 0 },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};

exports.IteratorDrawable1 = {
	id: "IteratorDrawable1",
	type: "IteratorDrawable",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value", value: 10 }
	],
	blocks: [
		{
			id: "IteratorVariables",
			type: "IteratorVariables"
		},
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 25 },
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Arithmetic2",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 6 },
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 0 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Interaction1",
			type: "Interaction"
		},
		{
			id: "BinarySwitch1",
			type: "BinarySwitch",
			inputs: [
				{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
				{ accessType: "Indexed", blockId: "Arithmetic2", index: 0 },
				{ accessType: "Value", value: 100 }
			]
		},
		{
			id: "Rect1",
			type: "Rectangle",
			interactionId: "Interaction1",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 },
				{ accessType: "Indexed", blockId: "BinarySwitch1", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		}
	],
	drawables: [
		"Rect1"
	]
};

exports.BinarySwitch4 = {
	id: "BinarySwitch4",
	type: "BinarySwitch",
	inputs: [
		{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
		{ accessType: "Value", value: 10 },
		{ accessType: "Value", value: 5 }
	]
};
exports.Rect10 = {
	id: "Rect10",
	type: "Rectangle",
	interactionId: "Interaction1",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.IteratorDrawable2 = {
	id: "IteratorDrawable2",
	type: "IteratorDrawable",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "BinarySwitch4", index: 0 }
	],
	blocks: [
		{
			id: "IteratorVariables",
			type: "IteratorVariables"
		},
		{
			id: "MacroDrawable1",
			type: "MacroDrawable",
			blocks: [
				{
					id: "Rect1",
					type: "Rectangle",
					inputs: [
						{ accessType: "Value" },
						{ accessType: "Value" },
						{ accessType: "Value", value: 70 },
						{ accessType: "Value", value: 60 },
						{ accessType: "Value" },
						{ accessType: "Value" }
					]
				}
			],
			drawables: [
				"Rect1"
			]
		},
		{
			id: "Rect1",
			type: "Rectangle",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		}
	],
	drawables: [
		"MacroDrawable1",
		"Rect1"
	]
};
exports.Iterator1 = {
	id: "Iterator1",
	type: "Iterator",
	inputs: [
		{ accessType: "Value", value: 10 }
	],
	leafs : [
		exports.EventBroadcast1.id
	],
	blocks: [
		exports.EventBroadcast1,
		{
			id: "IteratorVariables",
			type: "IteratorVariables"
		},
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Input1", blockId: "Number10", index: 0 }
			]
		},
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Input1" },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Nested1",
			type: "Macro",
			blocks: [
				{
					id: "PublishedInputs",
					type: "PublishedInputs",
					publishedOutputs: [
						{ accessType: "Indexed", id: "NestedTest1", blockId: "IteratorVariables", index: 1 }
					]
				},
				{
					id: "Arithmetic1",
					type: "Arithmetic",
					inputs: [
						{ accessType: "Value", value: 20 },
						{ accessType: "Published", blockId: "PublishedInputs", reference: "NestedTest1" },
						{ accessType: "Value", value: "*" }
					]
				}
			],
			publishedOutputs: [
				{ accessType: "Indexed", id: "NestedOut1", blockId: "Arithmetic1", index: 0 }
			]
		}
	],
	publishedOutputs: [
		{ accessType: "Indexed", id: "Test1", blockId: "Arithmetic1", index: 0 },
		{ accessType: "Published", id: "Test2", blockId: "Nested1", reference: "NestedOut1" }
	]
};
exports.Iterator2 = {
	id: "Iterator1",
	type: "Iterator",
	inputs: [
		{ accessType: "Value", value: 0 }
	],
	blocks: [
		{
			id: "IteratorVariables",
			type: "IteratorVariables"
		},
		{
			id: "PublishedInputs",
			type: "PublishedInputs",
			publishedOutputs: [
				{ accessType: "Indexed", id: "Input1", blockId: "Number10", index: 0 }
			]
		},
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
				{ accessType: "Published", blockId: "PublishedInputs", reference: "Input1" },
				{ accessType: "Value", value: "*" }
			]
		}
	],
	publishedOutputs: [
		{ accessType: "Indexed", id: "Test1", blockId: "Arithmetic1", index: 0 },
		{ accessType: "Indexed", id: "Test2", blockId: "IteratorVariables", index: 0 }
	]
};
exports.Rect11 = {
	id: "Rect11",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Published", blockId: "Iterator1", reference: "Test2" },
		{ accessType: "Published", blockId: "Iterator1", reference: "Test1" },
		{ accessType: "Value" },
		{ accessType: "Value" }
	]
};
exports.Rect12 = {
	id: "Rect12",
	type: "Rectangle",
	inputs: [
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "Image1", index: "1" },
		{ accessType: "Indexed", blockId: "Image1", index: "2" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Value" },
		{ accessType: "Indexed", blockId: "Image1", index: "0" }

	]
};