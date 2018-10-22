const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const LookupKeyedBlock = BlockTypes.get( "LookupKeyed" );

describe( "LookupKeyedBlock", () => {
	it( "is defined as a block type", () => {
		expect( LookupKeyedBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( LookupKeyedBlock.getDefaultInputValues( {} ) ).toEqual( [ {}, "" ] );
	} );

	it( "outputs undefined if key not found", () => {
		let block = makeBlock( LookupKeyedBlock, [ {}, "key" ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );

	it( "outputs undefined if structure is null", () => {
		let block = makeBlock( LookupKeyedBlock, [ null, "key" ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );
	
	it( "outputs undefined if structure is undefined", () => {
		let block = makeBlock( LookupKeyedBlock, [ undefined, "key" ] );
		expect( block.getOutputValue( 0 ) ).toBeUndefined();
	} );

	it( "outputs value for give key in structure", () => {
		let block = makeBlock( LookupKeyedBlock, [ { k1: "value1", k2: "value2" }, "k2" ] );
		expect( block.getOutputValue( 0 ) ).toBe( "value2" );
	} );
} );