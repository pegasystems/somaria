const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const BoundsBlock = BlockTypes.get( "Bounds" );

describe( "BoundsBlock", () => {
	it( "is defined as a block type", () => {
		expect( BoundsBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( BoundsBlock.getDefaultInputValues( {} ) ).toEqual( [ {} ] );
	} );

	it( "outputs undefined if bounds are undefined", () => {
		let block = makeBlock( BoundsBlock, [ undefined ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
		expect( block.getOutputValue( 1 ) ).toBeUndefined();
	} );

	it( "outputs the value for the minimum", () => {
		let block = makeBlock( BoundsBlock, [ { min: 0, max: 1 } ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );

	it( "outputs the value for the maximum", () => {
		let block = makeBlock( BoundsBlock, [ { min: 0, max: 100 } ] );
		expect( block.getOutputValue( 1 ) ).toBe( 100 );
	} );
} );