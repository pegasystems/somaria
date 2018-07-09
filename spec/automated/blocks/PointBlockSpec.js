const { itAsync, makeBlock, verifyStream, Point } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const PointBlock = BlockTypes.get( "Point" );

describe( "PointBlock", () => {
	it( "is defined as a block type", () => {
		expect( PointBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( PointBlock.getDefaultInputValues( undefined ) ).toEqual( [ 0, 0, 0 ] );
	} );
	
	itAsync( "builds a point object", async () => {
		let block = makeBlock( PointBlock, [ 1, 2, 3 ] );
		await verifyStream( block.getOutputStream( 0 ), Point( 1, 2, 3 ) );
	} );
	
	itAsync( "builds a different point object", async () => {
		let block = makeBlock( PointBlock, [ 6, 5, 4 ] );
		await verifyStream( block.getOutputStream( 0 ), Point( 6, 5, 4 ) );
	} );
} );