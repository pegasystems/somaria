const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const CastTypeBlock = BlockTypes.get( "CastType" );

function verify( input, type, expected ) {
	let block = makeBlock( CastTypeBlock, [ input, type ] );
	let value = block.getOutputValue( 0 );
	expect( value ).toEqual( expected );
}
describe( "CastTypeBlock", () => {
	it( "is defined as a block type", () => {
		expect( CastTypeBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( CastTypeBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, "number" ] );
	} );

	it( "casts a number value to string", () => {
		verify( 2, "string", "2" );
	} );

	it( "casts a string value to number", () => {
		verify( "2", "number", 2 );
	} );

	it( "casts a invalid string value to number and return NaN", () => {
		verify( "2A", "number", NaN );
	} );

	it( "casts a string decimal value to number", () => {
		verify( "2.56", "number", 2.56 );
	} );

	it( "casts a string containing a number in scientific notation to number", () => {
		verify( "-2.31e-13", "number", -2.31e-13 );
	} );
	
	it( "casts a number to a string in scientific notation", () => {
		verify( -0.000000000000231, "string", "-2.31e-13" );
	} );
} );