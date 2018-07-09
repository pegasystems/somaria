const { itAsync, makeBlock, verifyStream } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ArithmeticBlock = BlockTypes.get( "Arithmetic" );

describe( "ArithmeticBlock", () => {
	it( "is defined as a block type", () => {
		expect( ArithmeticBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ArithmeticBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, "+" ] );
	} );
	
	itAsync( "adds two numbers", async () => {
		const block = makeBlock( ArithmeticBlock, [ 2, 2, "+" ] );
		await verifyStream( block.getOutputStream( 0 ), 4 );
	} );
	
	itAsync( "subtracts two numbers", async () => {
		let block = makeBlock( ArithmeticBlock, [ 3, 2, "-" ] );
		await verifyStream( block.getOutputStream( 0 ), 1 );
	} );
	
	itAsync( "multiplies two numbers", async () => {
		let block = makeBlock( ArithmeticBlock, [ 3, 2, "*" ] );
		await verifyStream( block.getOutputStream( 0 ), 6 );
	} );
	
	itAsync( "divides two numbers", async () => {
		let block = makeBlock( ArithmeticBlock, [ 8, 2, "/" ] );
		await verifyStream( block.getOutputStream( 0 ), 4 );
	} );
	
	itAsync( "finds the remainder given two numbers", async () => {
		let block = makeBlock( ArithmeticBlock, [ 10, 3, "%" ] );
		await verifyStream( block.getOutputStream( 0 ), 1 );
	} );
	
	itAsync( "raises the first number to the power of the second number", async () => {
		let block = makeBlock( ArithmeticBlock, [ 4, 3, "^" ] );
		await verifyStream( block.getOutputStream( 0 ), 64 );
	} );
	
	itAsync( "falls back to addition", async () => {
		let block = makeBlock( ArithmeticBlock, [ 2, 2, "?" ] );
		await verifyStream( block.getOutputStream( 0 ), 4 );
	} );
} );