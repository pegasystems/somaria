const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const LookupIndexedBlock = BlockTypes.get( "LookupIndexed" );

describe( "LookupIndexedBlock", () => {
	it( "is defined as a block type", () => {
		expect( LookupIndexedBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( LookupIndexedBlock.getDefaultInputValues( null ) ).toEqual( [ [], 0 ] );
	} );

	it( "outputs undefined if index out of bounds", () => {
		let block = makeBlock( LookupIndexedBlock, [ [ "one" ], 1 ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );

	it( "outputs undefined if list is null", () => {
		let block = makeBlock( LookupIndexedBlock, [ null, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );
	
	it( "outputs undefined if list is undefined", () => {
		let block = makeBlock( LookupIndexedBlock, [ undefined, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );

	it( "outputs index value from given list", () => {
		let block = makeBlock( LookupIndexedBlock, [ [ "one", "two" ], 1 ] );
		expect( block.getOutputValue( 0 ) ).toBe( "two" );
	} );
} );