const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const RoundNumberBlock = BlockTypes.get( "RoundNumber" );

describe( "RoundNumberBlock", () => {
	it( "is defined as a block type", () => {
		expect( RoundNumberBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( RoundNumberBlock.getDefaultInputValues( undefined ) ).toEqual( [ 0, 0 ] );
	} );
	
	it( "rounds down to nearest integer", () => {
		let block = makeBlock( RoundNumberBlock, [ 1.1, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "rounds up to nearest integer", () => {
		let block = makeBlock( RoundNumberBlock, [ 1.5, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 2 );
	} );
	
	it( "rounds down to nearest negative integer", () => {
		let block = makeBlock( RoundNumberBlock, [ -1.6, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( -2 );
	} );
	
	it( "rounds up to nearest negative integer", () => {
		let block = makeBlock( RoundNumberBlock, [ -1.5, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( -1 );
	} );

	it( "rounds down to nearest 2 decimal places", () => {
		let block = makeBlock( RoundNumberBlock, [ 1.1239, 2 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1.12 );
	} );
	
	it( "rounds up to nearest 2 decimal places", () => {
		let block = makeBlock( RoundNumberBlock, [ 1.1251, 2 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1.13 );
	} );
} );