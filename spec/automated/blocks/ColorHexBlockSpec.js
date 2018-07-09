const { itAsync, makeBlock, verifyStream, Color } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ColorHexBlock = BlockTypes.get( "ColorHex" );

describe( "ColorHexBlock", () => {
	it( "is defined as a block type", () => {
		expect( ColorHexBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( ColorHexBlock.getDefaultInputValues( config ) ).toEqual( [ config.meshColor, 1 ] );
	} );
	
	itAsync( "builds a color object", async () => {
		const block = makeBlock( ColorHexBlock, [ 0x0a141e, 0.5 ] );
		await verifyStream( block.getOutputStream( 0 ).skip( 1 ), Color( 0x0a141e, 0.5 ) );
	} );
	
	itAsync( "builds a different color object", async () => {
		const block = makeBlock( ColorHexBlock, [ 0x007aff, 1.0 ] );
		await verifyStream( block.getOutputStream( 0 ).skip( 1 ), Color( 0x007aff, 1.0 ) );
	} );
} );