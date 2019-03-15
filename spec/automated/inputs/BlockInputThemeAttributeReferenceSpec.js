const { BlockInputThemeAttributeReference } = require( "../../build/core/inputs/BlockInputThemeAttributeReference" );
const { Color } = require( "../../build/core/structs/Color" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );
const { Theme } = require( "../../build/core/Theme" );

const testThemeJSON = {
	ColorPalette: [
		0xFF0000,
		0x00FF00,
		0x0000FF
	],
	FontFamily: "Open Sans"
};
const testThemeReference = "testTheme";
const defaultThemeAttribute = [
	Color.fromHex( 0x179595, 1 ),
	Color.fromHex( 0xE10B81, 1 ),
	Color.fromHex( 0x2B38A1, 1 ),
	Color.fromHex( 0xFFCA5F, 1 ),
	Color.fromHex( 0xA9D400, 1 ),
	Color.fromHex( 0x295ED9, 1 ),
	Color.fromHex( 0x585B73, 1 ),
	Color.fromHex( 0xD91C29, 1 ),
	Color.fromHex( 0x20AA50, 1 )
];
const testThemeAttributeReference = "FontFamily";
const testThemeAttribute = testThemeJSON.FontFamily;

let MockRenderingContext;

function registerTestThemes( themeReference ) {
	Theme.registerTheme( testThemeReference, testThemeJSON );
	MockRenderingContext = new RenderingContext( {}, { theme: themeReference }, {}, {}, {}, {}, {} );
}

describe( "BlockInputThemeAttributeReference", () => {
	afterEach( () => {
		Theme.registeredThemes.delete( testThemeReference );
	} );
	
	it( "returns default value when actual value is undefined", () => {
		registerTestThemes( "default" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, undefined,  "DefaultValue" );
		expect( input.getValue() ).toEqual( "DefaultValue" );
	} );

	it( "returns the actual theme from the reference", () => {
		registerTestThemes( "testTheme" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference, defaultThemeAttribute );
		expect( input.getValue() ).toEqual( testThemeAttribute );
	} );

	it( "initializes as uncached", () => {
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference,  defaultThemeAttribute );
		expect( input.isCached() ).toBe( false );
	} );

	it( "is cached after getValue()", () => {
		registerTestThemes( "default" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference,  defaultThemeAttribute );
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );

	it( "is uncached after getUncachedValue()", () => {
		registerTestThemes( "default" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference,  defaultThemeAttribute );
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );

	it( "initializes as changed", () => {
		registerTestThemes( "default" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference,  defaultThemeAttribute );
		expect( input.hasChanged() ).toBe( true );
	} );
	
	it( "is unchanged after second getValue()", () => {
		registerTestThemes( "testTheme" );
		const input = new BlockInputThemeAttributeReference( MockRenderingContext, testThemeAttributeReference,  defaultThemeAttribute );
		input.getValue();
		MockRenderingContext.frameIndex++;
		expect( input.getValue() ).toBe( testThemeAttribute );
		expect( input.hasChanged() ).toBe( false );
	} );
} );
