const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const NumberBlock = BlockTypes.get( "Number" );

describe( "NumberBlock", () => {
	it( "is defined as a block type", () => {
		expect( NumberBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( NumberBlock.getDefaultInputValues( {} ) ).toEqual( [ 0 ] );
	} );

	it( "outputs a number", () => {
		let block = makeBlock( NumberBlock, [ 1 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );

	it( "builds a different point object", () => {
		let block = makeBlock( NumberBlock, [ -2 ] );
		expect( block.getOutputValue( 0 ) ).toBe( -2 );
	} );
} );