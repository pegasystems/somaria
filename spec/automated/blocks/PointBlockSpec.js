const { makeBlock, Point } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const PointBlock = BlockTypes.get( "Point" );

describe( "PointBlock", () => {
	it( "is defined as a block type", () => {
		expect( PointBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( PointBlock.getDefaultInputValues( undefined ) ).toEqual( [ 0, 0, 0 ] );
	} );
	
	it( "builds a point object", () => {
		let block = makeBlock( PointBlock, [ 1, 2, 3 ] );
		let point = block.getOutputValue( 0 );
		expect( point ).toEqual( Point( 1, 2, 3 ) );
	} );
	
	it( "builds a different point object", () => {
		let block = makeBlock( PointBlock, [ 6, 5, 4 ] );
		let point = block.getOutputValue( 0 );
		expect( point ).toEqual( Point( 6, 5, 4 ) );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( PointBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "x", "y", "z" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasPointChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );