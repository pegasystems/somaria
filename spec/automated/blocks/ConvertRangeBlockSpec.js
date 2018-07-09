const { itAsync, makeBlock, verifyStream } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ConvertRangeBlock = BlockTypes.get( "ConvertRange" );

async function verify( valueToScale, sourceStart, sourceEnd, targetStart, targetEnd, expectedResult ) {
	const block = makeBlock( ConvertRangeBlock, [ valueToScale, sourceStart, sourceEnd, targetStart, targetEnd ] );
	await verifyStream( block.getOutputStream( 0 ), expectedResult );
}

describe( "ConvertRangeBlock", () => { 
	it( "is defined as a block type", () => {
		expect( ConvertRangeBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ConvertRangeBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, 100, 0, 100 ] );
	} );

	itAsync( "returns the same value", async () => {
		verify( 10, 0, 100, 0, 100, 10 );
	} );
	
	itAsync( "returns a decimal value", async () => {
		verify( 20, 10, 110, 0, 1, 0.1 );
	} );
	
	itAsync( "returns a negative value", async () => {
		verify( 20, 10, 110, 0, -100, -10 );
	} );
	
	itAsync( "returns a negative decimal", async () => {
		verify( 50, 0, 100, -1, -2, -1.5 );
	} );
	
	itAsync( "returns a positive value", async () => {
		verify( -105, -60, -120, 50, 150, 125 );
	} );
	
	itAsync( "scales based on a floating point range", async () => {
		verify( 90, 0, 180, 0, Math.PI, Math.PI / 2 );
	} );
	
	itAsync( "scales down", async () => {
		verify( 7, 0, 10, 10, 0, 3 );
	} );
	
	itAsync( "scales down 2", async () => {
		verify( 7, 10, 0, 0, 10, 3 );
	} );
	
	itAsync( "scales up 1", async () => {
		verify( 3, 0, 10, 10, 0, 7 );
	} );
	
	itAsync( "scales up 2", async () => {
		verify( 3, 10, 0, 0, 10, 7 );
	} );
} );