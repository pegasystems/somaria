require( "./TestUtils" );
const { Theme } = require( "../build/core/Theme" );
const { Color } = require( "../build/core/structs/Color" );
const { defaultThemeJSON } = require( "../build/core/themes/somaria-default-theme" );

describe( "Theme", () => {
	it( "can create a theme from generated json", () => {
		const themeJSON = {
			ColorPalette: [ 
				0x179595,
				0xE10B81,
				0x2B38A1
			],
			FontFamily: "Helvetica"
		};
		const theme = Theme.fromJSON( themeJSON );
		expect( theme.themeAttributes.size ).toBe( 2 );

		const colorPaletteAttribute = theme.getThemeAttributeValue( "ColorPalette" );
		expect( colorPaletteAttribute.length ).toBe( 3 );
		for ( let i = 0; i < colorPaletteAttribute.length; i++ ) {
			expect( colorPaletteAttribute[ i ] ).toEqual( Color.fromHex( themeJSON.ColorPalette[ i ], 1 ) );
		}

		const fontFamilyAttribute = theme.getThemeAttributeValue( "FontFamily" );
		expect( fontFamilyAttribute ).toBe( themeJSON.FontFamily );
	} );

	it( "can create default theme", () => {
		const theme = Theme.fromJSON( defaultThemeJSON );
		const colorPalette = [
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
		expect( theme.getThemeAttributeValue( "ColorPalette" ) ).toEqual( colorPalette );
		expect( theme.getThemeAttributeValue( "FontFamily" ) ).toBe( "Helvetica" );
		expect( theme.themeAttributes.size ).toBe( 2 );
	} );
} );