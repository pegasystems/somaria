const { customMatchers } = require( "../TestUtils" );
const { Color } = require( "../../build/core/structs/Color" );

function verify( color, red, green, blue, alpha ) {
	expect( color.r ).toBe( red );
	expect( color.g ).toBe( green );
	expect( color.b ).toBe( blue );
	expect( color.a ).toBe( alpha );
	expect( color.toArray() ).toEqual( [ red, green, blue, alpha ] );
}

describe( "Color", () => {
	it( "initializes from hex", () => {
		verify( Color.fromHex( 0x336699, 0.5 ), 0.2, 0.4, 0.6, 0.5 );
	} );
	
	it( "initializes from different hex", () => {
		verify( Color.fromHex( 0xcc9966, 1.0 ), 0.8, 0.6, 0.4, 1.0 );
	} );
	
	it( "initializes from rgb", () => {
		verify( Color.fromRGB( 0, 0.5, 1.0, 0.25 ), 0, 0.5, 1.0, 0.25 );
	} );
	
	it( "initializes from different rgb", () => {
		verify( Color.fromRGB( 0.4, 0.75, 0.1, 0.5 ), 0.4, 0.75, 0.1, 0.5 );
	} );
	
	it( "initializes from hsl", () => {
		verify( Color.fromHSL( 0.5, 0.5, 0.75, 0.125 ), 0.625, 0.875, 0.875, 0.125 );
	} );
	
	it( "initializes from  different hsl", () => {
		verify( Color.fromHSL( 0.75, 0.25, 0.75, 0 ), 0.75, 0.6875, 0.8125, 0 );
	} );
	
	it( "is equal to self", () => {
		const color = new Color( 0, 0, 0, 0 );
		expect( color.equals( color ) ).toBe( true );
	} );
	
	it( "is equal to identical Color", () => {
		expect( Color.fromRGB( 0.1, 0.2, 0.3, 0.5 ).equals( Color.fromRGB( 0.1, 0.2, 0.3, 0.5 ) ) ).toBe( true );
	} );
	
	it( "is equal to identical Color instantiated differently", () => {
		expect( Color.fromRGB( 0.2, 0.4, 0.6, 0.5 ).equals( Color.fromHex( 0x336699, 0.5 ) ) ).toBe( true );
	} );
	
	it( "is not equal to different color", () => {
		expect( Color.fromRGB( 0.1, 0.2, 0.3, 0.5 ).equals( Color.fromRGB( 0.3, 0.2, 0.1, 0.75 ) ) ).toBe( false );
	} );
} );