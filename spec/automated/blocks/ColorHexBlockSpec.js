const { makeBlock, Color } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ColorHexBlock = BlockTypes.get( "ColorHex" );

describe( "ColorHexBlock", () => {
	it( "is defined as a block type", () => {
		expect( ColorHexBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( ColorHexBlock.getDefaultInputValues( config ) ).toEqual( [ config.meshColor, 1 ] );
	} );
	
	it( "builds a color object", () => {
		let block = makeBlock( ColorHexBlock, [ 0x0a141e, 0.5 ] );
		let color = block.getOutputValue( 0 );
		expect( color ).toEqual( Color( 0x0a141e, 0.5 ) );
	} );
	
	it( "builds a different color object", () => {
		let block = makeBlock( ColorHexBlock, [ 0x007aff, 1.0 ] );
		let color = block.getOutputValue( 0 );
		expect( color ).toEqual( Color( 0x007aff, 1.0 ) );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( ColorHexBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "rgb", "opacity" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasColorChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );