const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ConvertRangeBlock = BlockTypes.get( "ConvertRange" );

function verify( valueToScale, sourceStart, sourceEnd, targetStart, targetEnd, expectedResult ) {
	const block = makeBlock( ConvertRangeBlock, [ valueToScale, sourceStart, sourceEnd, targetStart, targetEnd ] );
	expect( block.getOutputValue( 0 ) ).toBe( expectedResult );
}

describe( "ConvertRangeBlock", () => { 
	it( "is defined as a block type", () => {
		expect( ConvertRangeBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ConvertRangeBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, 100, 0, 100 ] );
	} );

	it( "returns the same value", () => {
		verify( 10, 0, 100, 0, 100, 10 );
	} );
	
	it( "returns a decimal value", () => {
		verify( 20, 10, 110, 0, 1, 0.1 );
	} );
	
	it( "returns a negative value", () => {
		verify( 20, 10, 110, 0, -100, -10 );
	} );
	
	it( "returns a negative decimal", () => {
		verify( 50, 0, 100, -1, -2, -1.5 );
	} );
	
	it( "returns a positive value", () => {
		verify( -105, -60, -120, 50, 150, 125 );
	} );
	
	it( "scales based on a floating point range", () => {
		verify( 90, 0, 180, 0, Math.PI, Math.PI / 2 );
	} );
	
	it( "scales down", () => {
		verify( 7, 0, 10, 10, 0, 3 );
	} );
	
	it( "scales down 2", () => {
		verify( 7, 10, 0, 0, 10, 3 );
	} );
	
	it( "scales up 1", () => {
		verify( 3, 0, 10, 10, 0, 7 );
	} );
	
	it( "scales up 2", () => {
		verify( 3, 10, 0, 0, 10, 7 );
	} );
} );