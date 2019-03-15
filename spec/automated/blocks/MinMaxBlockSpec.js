const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const MinMaxBlock = BlockTypes.get( "MinMax" );

function verify( values, min, max ) {
	let block = makeBlock( MinMaxBlock, [ values ] );
	expect( block.getOutputValue( 0 ) ).toBe( min );
	expect( block.getOutputValue( 1 ) ).toBe( max );
}

describe( "MinMaxBlock", () => {
	it( "is defined as a block type", () => {
		expect( MinMaxBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( MinMaxBlock.getDefaultInputValues( {} ) ).toEqual( [ [] ] );
	} );
	
	it( "returns 0 for empty array", () => {
		verify( [], 0, 0 );
	} );
	
	it( "returns min and max of integer array", () => {
		verify( [ 1, 2, 3 ], 1, 3 );
	} );
	
	it( "returns min and max of floating point array", () => {
		verify( [ 3.45, 2.2, 1.34 ], 1.34, 3.45 );
	} );
	
	it( "returns min and max of mixed integer array", () => {
		verify( [ -5, 0, -2.5, -3.14, 17, -8, 4 ], -8, 17 );
	} );
} );