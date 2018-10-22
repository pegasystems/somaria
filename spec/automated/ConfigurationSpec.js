require( "./TestUtils" );
const { Configuration } = require( "../build/core/Configuration" );

describe( "Configuration", () => {
	it( "defines default values", () => {
		const config = new Configuration( {} );
		expect( config.width ).toBe( 500 );
		expect( config.height ).toBe( 500 );
		expect( config.scalingMode ).toBe( "fit" );
		expect( config.fov ).toBe( 50 );
		expect( config.backgroundColor ).toBe( 0x1D2427 );
		expect( config.meshColor ).toBe( 0xFFFFFF );
		expect( config.origin.x ).toBe( 0 );
		expect( config.origin.y ).toBe( 0 );
		expect( config.origin.z ).toBe( 0 );
		expect( config.fontSize ).toBe( 16 );
		expect( config.theme ).toBe( "default" );
		expect( config.antialias ).toBe( true );
	} );
	
	it( "has custom config", () => {
		const config = new Configuration( {
			width: 300,
			height: 400,
			scalingMode: "fill",
			fov: 70,
			backgroundColor: 0xaabbcc,
			meshColor: 0x112233,
			origin: {
				x: 10,
				y: 20,
				z: -30
			},
			fontSize: 19,
			theme: "default",
			antialias: false
		} );
		expect( config.width ).toBe( 300 );
		expect( config.height ).toBe( 400 );
		expect( config.scalingMode ).toBe( "fill" );
		expect( config.fov ).toBe( 70 );
		expect( config.backgroundColor ).toBe( 0xaabbcc );
		expect( config.meshColor ).toBe( 0x112233 );
		expect( config.origin.x ).toBe( 10 );
		expect( config.origin.y ).toBe( 20 );
		expect( config.origin.z ).toBe( -30 );
		expect( config.fontSize ).toBe( 19 );
		expect( config.theme ).toBe( "default" );
		expect( config.antialias ).toBe( false );
	} );
	
	it( "corrects invalid scaling mode", () => {
		const config = new Configuration( {
			scalingMode: "stretch"
		} );
		expect( config.scalingMode ).toBe( "fit" );
	} );
	
	it( "corrects invalid colors", () => {
		const config = new Configuration( {
			backgroundColor: -0x112233,
			meshColor: 0xFFFFFFF
		} );
		expect( config.backgroundColor ).toBe( 0x000000 );
		expect( config.meshColor ).toBe( 0xFFFFFF );
	} );
	
	it( "allows zero for numeric values", () => {
		const config = new Configuration( {
			width: 0,
			height: 0,
			fov: 0,
			backgroundColor: 0x000000,
			meshColor: 0x000000,
			fontSize: 0
		} );
		expect( config.width ).toBe( 0 );
		expect( config.height ).toBe( 0 );
		expect( config.fov ).toBe( 0 );
		expect( config.backgroundColor ).toBe( 0x000000 );
		expect( config.meshColor ).toBe( 0x000000 );
		expect( config.fontSize ).toBe( 0 );
	} );
} );