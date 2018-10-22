const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const BinarySwitchBlock = BlockTypes.get( "BinarySwitch" );

describe( "BinarySwitchBlock", () => {
	it( "is defined as a block type", () => {
		expect( BinarySwitchBlock ).not.toBe( undefined );
	} );
	
	it( "defines default input values", () => {
		expect( BinarySwitchBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, 1 ] );
	} );
	
	it( "should return true value when switch value is set to true", () => {
		let block = makeBlock( BinarySwitchBlock, [ 1, 0, 2 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 2 );
	} );
	
	it( "should return false value when switch value is set to false", () => {
		let block = makeBlock( BinarySwitchBlock, [ 0, 0, 2 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
} );