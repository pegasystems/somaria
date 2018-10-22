const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ArithmeticBlock = BlockTypes.get( "Arithmetic" );

describe( "ArithmeticBlock", () => {
	it( "is defined as a block type", () => {
		expect( ArithmeticBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ArithmeticBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, "+" ] );
	} );
	
	it( "adds two numbers", () => {
		let block = makeBlock( ArithmeticBlock, [ 2, 2, "+" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 4 );
	} );
	
	it( "subtracts two numbers", () => {
		let block = makeBlock( ArithmeticBlock, [ 3, 2, "-" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "multiplies two numbers", () => {
		let block = makeBlock( ArithmeticBlock, [ 3, 2, "*" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 6 );
	} );
	
	it( "divides two numbers", () => {
		let block = makeBlock( ArithmeticBlock, [ 8, 2, "/" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 4 );
	} );
	
	it( "finds the remainder given two numbers", () => {
		let block = makeBlock( ArithmeticBlock, [ 10, 3, "%" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
	
	it( "raises the first number to the power of the second number", () => {
		let block = makeBlock( ArithmeticBlock, [ 4, 3, "^" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 64 );
	} );
	
	it( "falls back to zero", () => {
		let block = makeBlock( ArithmeticBlock, [ 2, 2, "?" ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
} );