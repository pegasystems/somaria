const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const CountBlock = BlockTypes.get( "Count" );

describe( "CountBlock", () => {
	it( "is defined as a block type", () => {
		expect( CountBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( CountBlock.getDefaultInputValues( {} ) ).toEqual( [ [] ] );
	} );

	it( "returns size of integer array", () => {
		let items = [ 1, 2, 3 ];
		let block = makeBlock( CountBlock, [ items ] );
		let size = block.getOutputValue( 0 );
		expect( size ).toEqual( 3 );
	} );

	it( "returns size of string array", () => {
		let items = [ "2", "3", "abc" ];
		let block = makeBlock( CountBlock, [ items ] );
		let size = block.getOutputValue( 0 );
		expect( size ).toEqual( 3 );
	} );

	it( "returns size of mix type array", () => {
		let items = [ 1, true, "free" ];
		let block = makeBlock( CountBlock, [ items ] );
		let size = block.getOutputValue( 0 );
		expect( size ).toEqual( 3 );
	} );

	it( "returns 0 for empty array", () => {
		let items = [];
		let block = makeBlock( CountBlock, [ items ] );
		let size = block.getOutputValue( 0 );
		expect( size ).toEqual( 0 );
	} );
} );