const { BlockInputExternalReference } = require( "../../build/core/inputs/BlockInputExternalReference" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );
const { Theme } = require( "../../build/core/Theme" );

let MockRenderingContext;
const testTheme = {
	ColorPalette: [
		0xFF0000,
		0x00FF00,
		0x0000FF
	],
	FontFamily: "Open Sans"
};

describe( "BlockInputExternalReference", () => {
	beforeAll( () => {
		Theme.registerTheme( "testTheme", testTheme );
		MockRenderingContext = new RenderingContext( {}, { theme: "testTheme" }, new Map( [ [ "value", 10 ] ] ), {}, {}, {}, {} );
	} );

	it( "returns the default value if no fallback access type or external input is defined", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, undefined, "ColorPalette", undefined, "fallback", "default" );
		expect( input.getValue() ).toBe( "default" );
	} );

	it( "returns the external value by when the external input id is defined", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		expect( input.getValue() ).toBe( 10 );
	} );

	it( "returns the theme attribute value when the fallback access type is theme and the external input id is undefined", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, undefined, "ColorPalette", "Theme", "fallback", "default" );
		let registeredTheme = MockRenderingContext.getRegisteredTheme( "testTheme" );
		let colorPalette = registeredTheme.getThemeAttributeValue( "ColorPalette" );
		expect( input.getValue() ).toEqual( colorPalette );
	} );

	it( "returns the fallback value when the fallback access type is value and the external input id is undefined", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, undefined, "ColorPalette", "Value", "fallback", "default" );
		expect( input.getValue() ).toBe( "fallback" );
	} );
	
	it( "initializes as uncached", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		expect( input.isCached() ).toBe( false );
	} );

	it( "initializes as changed", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		expect( input.hasChanged() ).toBe( true );
	} );

	it( "is unchanged after getValue()", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		input.getValue();
		expect( input.hasChanged() ).toBe( false );
	} );

	it( "is cached after getValue()", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );

	it( "is uncached after getUncachedValue()", () => {
		const input = new BlockInputExternalReference( MockRenderingContext, "value", "ColorPalette", undefined, "fallback", "default" );
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );
} );