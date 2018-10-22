const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const SeriesBlock = BlockTypes.get( "Series" );

const testDimesion = {
	title: "Count",
	labels: [ "0", "5", "10", "15", "20" ],
	bounds: [
		{ min: 0, max: 2	},
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
const testSeries = {
	title: "testSeries",
	values: [
		[ 0, 8	],
		[ 1, 12 ],
		[ 2, 20 ]
	],
	childSet: [ testDimesion ]
};

describe( "SeriesBlock", () => {
	it( "is defined as a block type", () => {
		expect( SeriesBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( SeriesBlock.getDefaultInputValues( {} ) ).toEqual( [ {} ] );
	} );

	it( "outputs undefined if series are undefined", () => {
		let block = makeBlock( SeriesBlock, [ undefined ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
		expect( block.getOutputValue( 1 ) ).toBeUndefined();
		expect( block.getOutputValue( 2 ) ).toBeUndefined();
	} );

	it( "outputs the value of the title", () => {
		let block = makeBlock( SeriesBlock, [ testSeries ] );
		expect( block.getOutputValue( 0 ) ).toBe( "testSeries" );
	} );

	it( "outputs the value for the array values", () => {
		let block = makeBlock( SeriesBlock, [ testSeries ] );
		expect( block.getOutputValue( 1 ) ).toBe( testSeries.values );
	} );

	it( "outputs the value of the childSet", () => {
		let block = makeBlock( SeriesBlock, [ testSeries ] );
		expect( block.getOutputValue( 2 ) ).toBe( testSeries.childSet );
	} );
} );