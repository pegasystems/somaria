const { itAsync, makeBlock, verifyStream } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const BinarySwitchBlock = BlockTypes.get( "BinarySwitch" );

describe( "BinarySwitchBlock", () => {
	it( "is defined as a block type", () => {
		expect( BinarySwitchBlock ).not.toBe( undefined );
	} );
	
	it( "defines default input values", () => {
		expect( BinarySwitchBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, 1 ] );
	} );
	
	itAsync( "should return true value when switch value is set to true", async () => {
		let block = makeBlock( BinarySwitchBlock, [ 1, 0, 2 ] );
		await verifyStream( block.getOutputStream( 0 ), 2 );
	} );
	
	itAsync( "should return false value when switch value is set to false", async () => {
		let block = makeBlock( BinarySwitchBlock, [ 0, 0, 2 ] );
		await verifyStream( block.getOutputStream( 0 ), 0 );
	} );
} );