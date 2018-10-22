const { makeBlock, customMatchers } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ColorHSLBlock = BlockTypes.get( "ColorHSL" );
const { Color } = require( "../../build/core/structs/Color" );

function verify( hue, saturation, lightness, alpha ) {
	const block = makeBlock( ColorHSLBlock, [ hue, saturation, lightness, alpha ] );
	const color = block.getOutputValue( 0 );
	expect( color ).toEqualStruct( Color.fromHSL( hue / 360, saturation / 100, lightness / 100, alpha ) );
}

describe( "ColorHSLBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( ColorHSLBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xffffff };
		expect( ColorHSLBlock.getDefaultInputValues( config ) ).toEqual( [ 0, 0, 100, 1 ] );
	} );
	
	it( "builds a color object", () => {
		verify( 180, 50, 50, 0.5 );
	} );
	
	it( "builds a different color object", () => {
		verify( 90, 25, 75, 0.5 );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( ColorHSLBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "hue", "saturation", "lightness", "opacity" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasColorChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );