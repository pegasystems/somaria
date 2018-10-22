const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const DimensionBlock = BlockTypes.get( "Dimension" );

const testDimension = {
	title: "Count",
	labels: [ "0", "5", "10", "15", "20" ],
	bounds: [
		{ min: 0, max: 2 },	
		{ min: 0, max: 20 }	
	],
	series: [
		{
			values: [
				[ 0, 8	],
				[ 1, 12 ],
				[ 2, 20 ]
			]
		}
	]
};

describe( "DimensionBlock", () => {
	it( "is defined as a block type", () => {
		expect( DimensionBlock ).toBeDefined();
	} );

	it( "does not extract data for undefined input", () => {
		expect( DimensionBlock.getDefaultInputValues( undefined ) ).toEqual( [ {} ] );
	} );

	it( "defines default input values", () => {
		expect( DimensionBlock.getDefaultInputValues( {} ) ).toEqual( [ {} ] );
	} );

	it( "extracts title properly", () => {
		const block = makeBlock( DimensionBlock, [ { title: "Title" } ] );
		expect( block.getOutputValue( 0 ) ).toBe( "Title" );
	} );

	it( "extracts labels properly", () => {
		const dimension = { labels: [ "Label1", "Label2" ] };
		const block = makeBlock( DimensionBlock, [ dimension ] );
		expect( block.getOutputValue( 1 ) ).toBe( dimension.labels );
	} );

	it( "extracts singular bounds properly", () => {
		const dimension = { bounds: [ { min: 0, max: 3 } ] };
		const block = makeBlock( DimensionBlock, [ dimension ] );
		expect( block.getOutputValue( 2 ) ).toBe( dimension.bounds );
	} );

	it( "extracts multiple bounds properly", () => {
		const dimension = { bounds: [ { min: 0, max: 3 }, { min: 15, max: 30 } ] };
		const block = makeBlock( DimensionBlock, [ dimension ] );
		expect( block.getOutputValue( 2 ) ).toBe( dimension.bounds );
	} );

	it( "extracts series properly", () => {
		const block = makeBlock( DimensionBlock, [ testDimension ] );
		expect( block.getOutputValue( 3 ) ).toBe( testDimension.series );
	} );

	it( "extracts childSet properly", () => {
		const block = makeBlock( DimensionBlock, [ testDimension ] );
		expect( block.getOutputValue( 4 ) ).toBe( testDimension.childSet );
	} );
} );