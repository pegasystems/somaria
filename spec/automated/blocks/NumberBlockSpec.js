const { itAsync, makeBlock, verifyStream } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const NumberBlock = BlockTypes.get( "Number" );

describe( "NumberBlock", () => {
	it( "is defined as a block type", () => {
		expect( NumberBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( NumberBlock.getDefaultInputValues( {} ) ).toEqual( [ 0 ] );
	} );

	itAsync( "outputs a number", async () => {
		let block = makeBlock( NumberBlock, [ 1 ] );
		await verifyStream( block.getOutputStream( 0 ), 1 );
	} );

	itAsync( "outputs a different number", async () => {
		let block = makeBlock( NumberBlock, [ -2 ] );
		await verifyStream( block.getOutputStream( 0 ), -2 );
	} );
} );