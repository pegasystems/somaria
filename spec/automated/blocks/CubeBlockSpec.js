const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getTranslatedMatrix } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const { TexturedMaterial } = require( "../../build/core/materials/TexturedMaterial" );
const CubeBlock = BlockTypes.get( "Cube" );

function verify( position, width, height, depth, color, angle, xAnchor, yAnchor, zAnchor, anchorX, anchorY, anchorZ, texture ) {
	let block = makeBlock( CubeBlock, [ true, position, width, height, depth, color, angle, xAnchor, yAnchor, zAnchor, texture ] );
	let object = verifyObjects( block, 1 )[ 0 ];
	expect( object.material ).toBeAny( TexturedMaterial );
	expect( object.material.side ).toBe( THREE.FrontSide );
	verifyColor( object, color );
	verifyTexture( object, texture );
	expect( object.geometry ).toBeDefined();
	expect( object.geometry ).toBeAny( THREE.BoxBufferGeometry );
	let scale = Point( width, height, depth );
	expect( object.matrix ).toEqualStruct( getTranslatedMatrix( position, scale, angle, anchorX, anchorY, anchorZ ) );
	expect( object.geometry.parameters.width ).toBe( 1 );
	expect( object.geometry.parameters.height ).toBe( 1 );
	expect( object.geometry.parameters.depth ).toBe( 1 );
}

function verifyColor( object, color ) {
	expect( object.material.uniforms.color.value ).toEqual( [ color.r, color.g, color.b, color.a ] );
	expect( object.material.transparent ).toBe( true );
}

function verifyTexture( object, texture ) {
	expect( object.material.uniforms.texture.value ).toBe( texture || null );
}

describe( "CubeBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( CubeBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };

		expect( CubeBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			Point( 0, 0, 0 ),
			100,
			100,
			100,
			Color( config.meshColor, 1 ),
			Angle( 0, 0, 0 ),
			"center",
			"center",
			"center",
			null
		] );
	} );
	
	it( "enables", () => {
		let block = makeBlock( CubeBlock, [ true, Point( 0, 0, 0 ), 30, 20, 40, Color( 0xff0000, 1 ), Angle( 30, 15, 57 ), "min", "max", "center" ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );
	
	it( "disables", () => {
		let block = makeBlock( CubeBlock, [ false, Point( 0, 0, 0 ), 30, 20, 40, Color( 0xff0000, 1 ), Angle( 30, 15, 57 ), "min", "max", "center" ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "draws a cube", () => {
		verify( Point( 9, 8, 7 ), 30, 20, 40, Color( 0xff0000, 1 ), Angle( 30, 15, 57 ), "center", "center", "center", 0, 0, 0 );
	} );
	
	it( "draws another cube", () => {
		verify( Point( 5, 4, 3 ), 1, 10, 13, Color( 0xffeedd, 0.2 ), Angle( 1, 2, 3 ), "center", "center", "center", 0, 0, 0 );
	} );
	
	it( "draws a textured cube", () => {
		verify( Point( 9, 8, 7 ), 30, 20, 40, Color( 0xff0000, 1 ), Angle( 30, 15, 57 ), "center", "center", "center", 0, 0, 0, {} );
	} );
	
	const xAnchors = [
		{ name: "min", value: 0.5 },
		{ name: "center", value: 0 },
		{ name: "max", value: -0.5 }
	];
	const yAnchors = [
		{ name: "max", value: -0.5 },
		{ name: "center", value: 0 },
		{ name: "min", value: 0.5 }
	];
	const zAnchors = [
		{ name: "max", value: 0.5 },
		{ name: "center", value: 0 },
		{ name: "min", value: -0.5 }
	];
	
	for( const xAnchor of xAnchors ) {
		for( const yAnchor of yAnchors ) {
			for( const zAnchor of zAnchors ) {
				it( `draws a cube anchored (${xAnchor.name}, ${yAnchor.name}, ${zAnchor.name})`, () => {
					verify( Point( 9, 8, 7 ), 30, 20, 40, Color( 0xff0000, 1 ), Angle( 1, 2, 3 ),
						xAnchor.name, yAnchor.name, zAnchor.name, xAnchor.value, yAnchor.value, zAnchor.value );
				} );
			}
		}
	}
	
	describe( "at runtime", () => {
		let block = makeBlock( CubeBlock, [] );
		block.create3dObjects();
		
		for( const input of [ "width", "height", "depth", "position", "rotation", "xAnchor", "yAnchor", "zAnchor" ] ) {
			it( `changes alignment on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasAlignmentChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );