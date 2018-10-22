let visualizationJSON = {
	drawables: [
		"Line1",
		"Rect1",
		"RectBL",
		"Cube1",
		"Shape1",
		"Shape2",
		"Shape3",
/*		"RectBC",
		"RectBR",
		"RectML",
		"RectMC",
		"RectMR",
		"RectTL",
		"RectTC",
		"RectTR",*/
		"Rect2",
		"Rect3",
		"Text2Rect",
		"IteratorDrawable1",
		"Ellipse1",
		"Ellipsoid1",
		//"Image1",
		"Path1",
		"Path2",
		"Arc1",
		"Arc2"
	],
	blocks: [
		{
			type: "Point",
			id: "Point1",
			inputs: [
				{ accessType: "Indexed", blockId: "Arithmetic2", index: 0 },
				{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point2",
			inputs: [
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point3",
			inputs: [
				{ accessType: "Value", value: 10 },
				{ accessType: "Value", value: 150 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point4",
			inputs: [
				{ accessType: "Value", value: -150 },
				{ accessType: "Value", value: 10 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point5",
			inputs: [
				{ accessType: "Indexed", blockId: "SmoothValue2", index: 0 },
				{ accessType: "Indexed", blockId: "SmoothValue1", index: 0 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point6",
			inputs: [
				{ accessType: "Value", value: -150 },
				{ accessType: "Value", value: -150 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Point",
			id: "Point7",
			inputs: [
				{ accessType: "Value", value: -110 },
				{ accessType: "Value", value: 180 },
				{ accessType: "Value", value: 0 }
			]
		},
		{
			type: "Image",
			id: "Image1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Value", value: "../images/somaria-block.png" },
				{ accessType: "Value" },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value" }
			]
		},
		{
			type: "Angle",
			id: "Angle1",
			inputs: [
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: "degree" }
			]
		},
		{
			type: "Angle",
			id: "Angle2",
			inputs: [
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 90 },
				{ accessType: "Value", value: "degree" }
			]
		},
		{
			type: "Angle",
			id: "Angle3",
			inputs: [
				{ accessType: "Value", value: 45 },
				{ accessType: "Value", value: 45 },
				{ accessType: "Value", value: 45 },
				{ accessType: "Value", value: "degree" }
			]
		},
		{
			type: "Interaction",
			id: "Interaction1"
		},
		{
			id: "BinarySwitch1",
			type: "BinarySwitch",
			inputs: [
				{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor1", index: 0 },
				{ accessType: "Indexed", blockId: "RGBColor1", index: 0 }
			]
		},
		{
			id: "BinarySwitch2",
			type: "BinarySwitch",
			inputs: [
				{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
				{ accessType: "value", value: 0 },
				{ accessType: "value", value: 100 }
			]
		},
		{
			id: "BinarySwitch3",
			type: "BinarySwitch",
			inputs: [
				{ accessType: "Indexed", blockId: "Interaction1", index: 0 },
				{ accessType: "value", value: 150 },
				{ accessType: "value", value: 100 }
			]
		},
		{
			id: "SmoothValue1",
			type: "SmoothValue",
			inputs: [
				{ accessType: "Indexed", blockId: "BinarySwitch2", index: 0 },
				{ accessType: "Value", value: 0.5 }
			]
		},
		{
			id: "SmoothValue2",
			type: "SmoothValue",
			inputs: [
				{ accessType: "Indexed", blockId: "BinarySwitch3", index: 0 },
				{ accessType: "Value", value: 0.25 }
			]
		},
		{
			id: "SmoothValue3",
			type: "SmoothValue",
			inputs: [
				{ accessType: "Value", value: 180 },
				{ accessType: "Value", value: 3 }
			]
		},
		{
			id: "BinarySwitch4",
			type: "BinarySwitch",
			inputs: [
				{ accessType: "Indexed", blockId: "Wait1", index: 0 },
				{ accessType: "Value", value: 0 },
				{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 }
			]
		},
		{
			type: "Angle",
			id: "Angle4",
			inputs: [
				{ accessType: "Indexed", blockId: "SmoothValue3", index: 0 },
				{ accessType: "Indexed", blockId: "SmoothValue3", index: 0 },
				{ accessType: "Indexed", blockId: "SmoothValue3", index: 0 },
				{ accessType: "Value", value: "degree" }
			]
		},
		{
			type: "Ellipse",
			id: "Ellipse1",
			interactionId: "Interaction1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point5", index: 0 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 30 },
				{ accessType: "Indexed", blockId: "BinarySwitch1", index: 0 },
				{ accessType: "Value" }
			]
		},
		{
			type: "Ellipsoid",
			id: "Ellipsoid1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point7", index: 0 },
				{ accessType: "Value", value: 30 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 70 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Indexed", blockId: "Angle4", index: 0 }
			]
		},
		{
			type: "Shape",
			id: "Shape1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Value", value: [ { x:-150, y: -150, z: 10 }, { x:-100, y: -150, z: 10 }, { x:-100, y: -100, z: 10 }, { x:-150, y:-100, z:10 },
					{ x:-200, y:50, z:10 } ] },
				{ accessType: "Indexed", blockId: "Point3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Indexed", blockId: "Angle1", index: 0 }
			]
		},
		{
			type: "Shape",
			id: "Shape2",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Value", value: [ { x:-150, y: 150, z: 10 }, { x:-100, y: 150, z: 10 }, { x:-100, y: 100, z: 10 }, { x:-150, y:100, z:10 },
					{ x:-200, y:50, z:10 } ] },
				{ accessType: "Indexed", blockId: "Point1", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor1", index: 0 },
				{ accessType: "Indexed", blockId: "Angle1", index: 0 }
			]
		},
		{
			type: "Shape",
			id: "Shape3",
			inputs: [
				{ accessType: "Value", value: true }
			]
		},
		{
			type: "Arc",
			id: "Arc1",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Point3", index: 0 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 30 },
				{ accessType: "Value", value: 20 },
				{ accessType: "Value", value: 28 },
				{ accessType: "Value", value: Math.PI / 2 },
				{ accessType: "Value", value: Math.PI / 3 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 }
			]
		},
		{
			type: "Arc",
			id: "Arc2",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Point3", index: 0 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: 40 },
				{ accessType: "Value", value: 40 },
				{ accessType: "Value", value: Math.PI / 2 },
				{ accessType: "Value", value: Math.PI },
				{ accessType: "Value" }
			]
		},
		{
			type: "Line",
			id: "Line1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point3", index: 0 },
				{ accessType: "Indexed", blockId: "Point4", index: 0 },
				{ accessType: "Value", value: 5 },
				{ accessType: "Indexed", blockId: "RGBColor1", index: 0 }
			]
		},
		{
			id: "EnvironmentVariables1",
			type: "EnvironmentVariables",
			inputs: [
			]
		},
		{
			type: "Text",
			id: "Text2",
			inputs: [
				{ accessType: "Value", value: "Visualization" },
				{ accessType: "Value", value: "Arial" },
				{ accessType: "Value", value: 16 },
				{ accessType: "Value" }
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
			id: "Text2Rect",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point4", index: 0 },
				{ accessType: "Indexed", blockId: "Text2", index: 1 },
				{ accessType: "Indexed", blockId: "Text2", index: 2 },
				{ accessType: "Indexed", blockId: "TransparentColor", index: 0 },
				{ accessType: "Indexed", blockId: "Angle2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value" },
				{ accessType: "Indexed", blockId: "Text2", index: 0 }
			]
		},
		{
			type: "Rectangle",
			id: "Rect1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Indexed", blockId: "EnvironmentVariables1", index: 0 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor1", index: 0 },
				{ accessType: "Indexed", blockId: "Angle1", index: 0 }
			]
		},
		{
			type: "Cube",
			id: "Cube1",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point6", index: 0 },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value", value: 100 },
				{ accessType: "Value", value: 100 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Indexed", blockId: "Angle3", index: 0 },
				{ accessType: "Value", value: "center" },
				{ accessType: "Value", value: "center" },
				{ accessType: "Value", value: "center" }
			]
		},
		{
			type: "Rectangle",
			id: "RectMC",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "center" },
				{ accessType: "Value", value: "center" }
			]
		},
		{
			type: "Rectangle",
			id: "RectTL",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "max" },
				{ accessType: "Value", value: "min" }
			]
		},
		{
			type: "Rectangle",
			id: "RectBR",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "min" },
				{ accessType: "Value", value: "max" }
			]
		},
		{
			type: "Rectangle",
			id: "RectTR",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "max" },
				{ accessType: "Value", value: "max" }
			]
		},
		{
			type: "Rectangle",
			id: "RectBL",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "min" },
				{ accessType: "Value", value: "min" }
			]
		},
		{
			type: "Rectangle",
			id: "RectBC",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "min" },
				{ accessType: "Value", value: "center" }
			]
		},
		{
			type: "Rectangle",
			id: "RectTC",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "max" },
				{ accessType: "Value", value: "center" }
			]
		},
		{
			type: "Rectangle",
			id: "RectML",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "center" },
				{ accessType: "Value", value: "min" }
			]
		},
		{
			type: "Rectangle",
			id: "RectMR",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "Arithmetic3", index: 0 },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value" },
				{ accessType: "Value", value: "center" },
				{ accessType: "Value", value: "max" }
			]
		},
		{
			type: "Rectangle",
			id: "Rect2",
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Indexed", blockId: "Point2", index: 0 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Indexed", blockId: "RGBColor1", index: 0 },
				{ accessType: "Value" }
			]
		},
		{
			type: "Rectangle",
			id: "Rect3",
			inputs: [
				{ accessType: "Value", value: false },
				{ accessType: "Value" },
				{ accessType: "Value", value: 80 },
				{ accessType: "Value", value: 80 },
				{ accessType: "Value" },
				{ accessType: "Value" }
			]
		},
		{
			id: "HexColor1",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0xFF0000 },
				{ accessType: "Indexed", blockId: "Arithmetic4", index: 0 }
			]
		},
		{
			id: "HexColor2",
			type: "ColorHex",
			inputs: [
				{ accessType: "Value", value: 0x00FFFF },
				{ accessType: "Indexed", blockId: "Arithmetic4", index: 0 }
			]
		},
		{
			id: "RGBColor1",
			type: "ColorRGB",
			inputs: [
				{ accessType: "Value", value: 100 },
				{ accessType: "Value", value: 150 },
				{ accessType: "Value", value: 200 },
				{ accessType: "Value", value: 1 }
			]
		},
		{
			id: "Arithmetic1",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 10 },
				{ accessType: "Value", value: 20 },
				{ accessType: "Value", value: "+" }
			]
		},
		{
			id: "Arithmetic2",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 0 },
				{ accessType: "Value", value: 50 },
				{ accessType: "Value", value: "-" }
			]
		},
		{
			id: "Arithmetic3",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 10 },
				{ accessType: "Value", value: 12 },
				{ accessType: "Value", value: "*" }
			]
		},
		{
			id: "Arithmetic4",
			type: "Arithmetic",
			inputs: [
				{ accessType: "Value", value: 1 },
				{ accessType: "Value", value: 2 },
				{ accessType: "Value", value: "/" }
			]
		},
		{
			type: "Path",
			id: "Path1",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value", value: [ { x:-100, y: -100, z: 0 }, { x:-50, y: -100, z: 0 }, { x:-50, y: -50, z: 0 } ] },
				{ accessType: "Indexed", blockId: "HexColor2", index: 0 },
				{ accessType: "Value", value: false }
			]
		},
		{
			type: "Path",
			id: "Path2",
			inputs: [
				{ accessType: "Value" },
				{ accessType: "Value", value: [ { x:-150, y: -150, z: 10 }, { x:-100, y: -150, z: 10 }, { x:-100, y: -100, z: 10 }, { x:-150, y:-100, z:10 },
					{ x:-200, y:50, z:10 } ] },
				{ accessType: "Indexed", blockId: "HexColor1", index: 0 },
				{ accessType: "Value", value: true }
			]
		},
		{
			id: "IteratorDrawable1",
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
					id: "Arithmetic1",
					type: "Arithmetic",
					inputs: [
						{ accessType: "Value", value: 36 },
						{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 },
						{ accessType: "Value", value: "*" }
					]
				},
				{
					id: "Arithmetic2",
					type: "Arithmetic",
					inputs: [
						{ accessType: "Value", value: 12 },
						{ accessType: "Indexed", blockId: "IteratorVariables", index: 0 },
						{ accessType: "Value", value: "*" }
					]
				},
				{
					id: "HexColor1",
					type: "ColorHex",
					inputs: [
						{ accessType: "Value", value: 0x0000FF },
						{ accessType: "Value", value: 0.5 }
					]
				},
				{
					type: "Angle",
					id: "Angle1",
					inputs: [
						{ accessType: "Value", value: 0 },
						{ accessType: "Value", value: 0 },
						{ accessType: "Indexed", blockId: "SmoothValue1", index: 0 },
						{ accessType: "Value", value: "degree" }
					]
				},
				{
					type: "Wait",
					id: "Wait1",
					inputs: [
						{ accessType: "Indexed", blockId: "IteratorVariables", index: 1 }
					]
				},
				{
					type: "Interaction",
					id: "Interaction1"
				},
				{
					id: "BinarySwitch1",
					type: "BinarySwitch",
					inputs: [
						{ accessType: "Indexed", blockId: "Interaction1", index: 1 },
						{ accessType: "Indexed", blockId: "HexColor1", index: 0 },
						{ accessType: "Indexed", blockId: "RGBColor1", index: 0 }
					]
				},
				{
					type: "Point",
					id: "Point1",
					inputs: [
						{ accessType: "Value", value: 150 },
						{ accessType: "Value", value: -150 },
						{ accessType: "Value", value: 0 }
					]
				},
				{
					id: "RGBColor1",
					type: "ColorRGB",
					inputs: [
						{ accessType: "Value", value: 100 },
						{ accessType: "Value", value: 150 },
						{ accessType: "Value", value: 200 },
						{ accessType: "Value", value: 1 }
					]
				},
				{
					id: "BinarySwitch2",
					type: "BinarySwitch",
					inputs: [
						{ accessType: "Indexed", blockId: "Wait1", index: 0 },
						{ accessType: "Value", value: 0 },
						{ accessType: "Indexed", blockId: "Arithmetic1", index: 0 }
					]
				},
				{
					id: "SmoothValue1",
					type: "SmoothValue",
					inputs: [
						{ accessType: "Indexed", blockId: "BinarySwitch2", index: 0 },
						{ accessType: "Value", value: 1 }
					]
				},
				{
					id: "Rect1",
					type: "Rectangle",
					interactionId: "Interaction1",
					inputs: [
						{ accessType: "Value" },
						{ accessType: "Indexed", blockId: "Point1", index: 0 },
						{ accessType: "Value", value: 120 },
						{ accessType: "Indexed", blockId: "Arithmetic2", index: 0 },
						{ accessType: "Indexed", blockId: "BinarySwitch1", index: 0 },
						{ accessType: "Indexed", blockId: "Angle1", index: 0 },
						{ accessType: "Value", value: "center" },
						{ accessType: "Value", value: "center" }
					]
				}
			],
			drawables: [
				"Rect1"
			]
		}
	]
};