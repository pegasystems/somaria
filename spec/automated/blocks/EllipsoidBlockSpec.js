const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getQuaternion } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const { TexturedMaterial } = require( "../../build/core/materials/TexturedMaterial" );
const EllipsoidBlock = BlockTypes.get( "Ellipsoid" );

let scalingManager;

function verify( position, xRadius, yRadius, zRadius, color, angle, texture ) {
	spyOn( THREE, "SphereBufferGeometry" ).and.callThrough().and.callFake( function( radius, widthSegments, heightSegments ) {
		expect( arguments.length ).toBe( 3 );
		expect( radius ).toBe( 1 );
		const resolution = Math.round( Math.PI * Math.sqrt( Math.max( xRadius, yRadius, zRadius ) * scalingManager.getPixelWorldRatio() ) );
		expect( widthSegments ).toBe( resolution );
		expect( heightSegments ).toBe( resolution );
	} );
	let block = makeBlock( EllipsoidBlock, [ true, position, xRadius, yRadius, zRadius, color, angle, texture ] );
	block.setScalingManager( scalingManager );
	let object = verifyObjects( block, 1 )[ 0 ];
	xRadius = xRadius === 0 ? Number.EPSILON : xRadius;
	yRadius = yRadius === 0 ? Number.EPSILON : yRadius;
	zRadius = zRadius === 0 ? Number.EPSILON : zRadius;
	expect( object.material ).toBeAny( TexturedMaterial );
	expect( object.material.side ).toBe( THREE.FrontSide );
	verifyColor( object, color );
	verifyTexture( object, texture );
	expect( object.scale ).toEqualStruct( new THREE.Vector3( xRadius, yRadius, zRadius ) );
	expect( object.position ).toEqualStruct( new THREE.Vector3( position.x, position.y, position.z ) );
	expect( object.quaternion ).toEqualStruct( getQuaternion( angle.x, angle.y, angle.z ) );
	expect( THREE.SphereBufferGeometry ).toHaveBeenCalled();
	expect( object.geometry ).toBeAny( THREE.SphereBufferGeometry );
}

function verifyColor( object, color ) {
	expect( object.material.uniforms.color.value ).toEqual( [ color.r, color.g, color.b, color.a ] );
	expect( object.material.transparent ).toBe( true );
}

function verifyTexture( object, texture ) {
	expect( object.material.uniforms.texture.value ).toBe( texture || null );
}

describe( "EllipsoidBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	beforeEach( () => {
		scalingManager = {
			pixelWorldRatio: 1,
			getPixelWorldRatio: function() {
				return this.pixelWorldRatio;
			}
		};
	} );
	
	it( "is defined as a block type", () => {
		expect( EllipsoidBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( EllipsoidBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			Point( 0, 0, 0 ),
			50,
			50,
			50,
			Color( config.meshColor, 1 ),
			Angle( 0, 0, 0 ),
			null
		] );
	} );
	
	it( "builds an Ellipsoid block from JSON", () => {
		const renderingContext = {
			scalingManager: {},
			config: { meshColor: 0xaabbcc }
		};
		const block = EllipsoidBlock.fromData( EllipsoidBlock, {
			id: "Ellipsoid 1",
			type: "Ellipsoid",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );

	it( "enables", () => {
		let block = makeBlock( EllipsoidBlock, [ true, Point( 1, 2, 3 ), 10, 20, 30, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );

	it( "disables", () => {
		let block = makeBlock( EllipsoidBlock, [ false, Point( 1, 2, 3 ), 10, 20, 30, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "draws an ellipsoid", () => {
		verify( Point( 1, 2, 3 ), 1, 2, 3, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) );
	} );
	
	it( "draws an ellipsoid to scale", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( Point( 1, 2, 3 ), 1, 1, 1, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) );
	} );

	it( "draws a transparent ellipsoid", () => {
		verify( Point( 6, 5, 4 ), 5, 3, 4, Color( 0xffffff, 0.5 ), Angle( 3, 2, 1 ) );
	} );
	
	it( "draws a textured ellipsoid", () => {
		verify( Point( 6, 5, 4 ), 9, 8, 7, Color( 0xffffff, 0.5 ), Angle( 3, 2, 1 ), {} );
	} );
	
	it( "draws an ellipsoid elongated in the Y axis", () => {
		verify( Point( 6, 5, 4 ), 6, 7, 5, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ) );
	} );

	it( "draws a sphere with negative radius", () => {
		verify( Point( 6, 5, 4 ), 0, -2, 1, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ) );
	} );
	
	it( "draws a zero-radius sphere", () => {
		verify( Point( 6, 5, 4 ), 0, 0, 0, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ) );
	} );

	describe( "at runtime", () => {
		let block;

		beforeAll( () => {
			block = makeBlock( EllipsoidBlock, [] );
			block.setScalingManager( scalingManager );
			block.create3dObjects();
		} );

		for( const input of [ "xRadius", "yRadius", "zRadius" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasSizeChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
		
		it( "changes geometry when the scaling factor changes", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasSizeChanged( 1 ) ).toBe( true );
			block.renderedPixelWorldRatio = undefined;
		} );
		
		it( "does not change geometry when the scaling factor has not changed", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasSizeChanged( 2 ) ).toBe( false );
			block.renderedPixelWorldRatio = undefined;
		} );
	} );
} );