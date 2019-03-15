const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const NumericComparisonBlock = BlockTypes.get( "NumericComparison" );

describe( "NumericComparisonBlock", () => {
	it( "is defined as a block type", () => {
		expect( NumericComparisonBlock ).not.toBe( undefined );
	} );
		
	it( "defines default input values", () => {
		expect( NumericComparisonBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, "==" ] );
	} );
	
	it( "should compare two values for equality and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 2, "==" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for equality and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 3, "==" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
	
	it( "should compare two values for less than equal and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 2, "!=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
	
	it( "should compare two values for less than equal and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 3, "!=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for greater than and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 4, 2, ">" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for greater than and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 4, ">" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
	
	it( "should compare two values for less than and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 4, "<" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for less than and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 4, 2, "<" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
	
	it( "should compare two values for greater than equals and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 4, 2, ">=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for greater than equals and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 4, ">=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
	
	it( "should compare two values for less than equals and return true", () => {
		let block = makeBlock( NumericComparisonBlock, [ 2, 2, "<=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "should compare two values for less than equals and return false", () => {
		let block = makeBlock( NumericComparisonBlock, [ 4, 2, "<=" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
} );