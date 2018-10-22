const { makeBlock, Color } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ColorRGBBlock = BlockTypes.get( "ColorRGB" );

describe( "ColorRGBBlock", () => {
	it( "is defined as a block type", () => {
		expect( ColorRGBBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( ColorRGBBlock.getDefaultInputValues( config ) ).toEqual( [ 0xaa, 0xbb, 0xcc, 1 ] );
	} );
	
	it( "builds a color object", () => {
		let block = makeBlock( ColorRGBBlock, [ 10, 20, 30, 0.5 ] );
		let color = block.getOutputValue( 0 );
		expect( color ).toEqual( Color( 0x0a141e, 0.5 ) );
	} );
	
	it( "builds a different color object", () => {
		let block = makeBlock( ColorRGBBlock, [ 0, 122, 255, 1.0 ] );
		let color = block.getOutputValue( 0 );
		expect( color ).toEqual( Color( 0x007aff, 1.0 ) );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( ColorRGBBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "red", "green", "blue", "opacity" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasColorChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );