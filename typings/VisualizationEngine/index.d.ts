type BlockId = string;

type BlockInputJSON = {
	id?: string;
	accessType: string;
	blockId?: string;
	index?: number;
	fallbackAccessType?: string;
	themeAttributeType?: string;
	reference?: BlockId;
	value?: any;
};

type BlockJSON = {
	id: BlockId,
	type: string,
	interactionId?: string,
	inputs: BlockInputJSON[];
	blocks?: BlockJSON[];
	drawables?: BlockId[];
	leafs?: BlockId[];
	publishedOutputs?: BlockInputJSON[];
};

type Cartesian = THREE.Vector3;

type Angle = THREE.Vector3;

type DataSet = Dimension[];

interface Dimension {
	title?: string;
	labels?: string[];
	bounds?: Bounds[];
	series?: Series[];
	childSet?: DataSet;
}

interface Bounds {
	min?: number;
	max?: number;
}

interface Series {
	title?: string;
	values: Attribute[][];
	childSet?: DataSet;
}

type Attribute = any;