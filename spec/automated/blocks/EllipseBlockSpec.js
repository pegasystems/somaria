const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getQuaternion } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const { TexturedMaterial } = require( "../../build/core/materials/TexturedMaterial" );
const EllipseBlock = BlockTypes.get( "Ellipse" );

let scalingManager;

function verify( position, xRadius, yRadius, color, angle, texture ) {
	let block = makeBlock( EllipseBlock, [ true, position, xRadius, yRadius, color, angle, texture ] );
	block.setScalingManager( scalingManager );
	let object = verifyObjects( block, 1 )[ 0 ];
	xRadius = xRadius === 0 ? Number.EPSILON : xRadius;
	yRadius = yRadius === 0 ? Number.EPSILON : yRadius;
	expect( object.scale ).toEqualStruct( new THREE.Vector3( xRadius, yRadius, 1 ) );
	expect( object.position ).toEqualStruct( new THREE.Vector3( position.x, position.y, position.z ) );
	expect( object.quaternion ).toEqualStruct( getQuaternion( angle.x, angle.y, angle.z ) );
	expect( object.material ).toBeAny( TexturedMaterial );
	expect( object.material.side ).toBe( THREE.DoubleSide );
	verifyColor( object, color );
	verifyTexture( object, texture );
	expect( object.geometry ).toBeAny( THREE.BufferGeometry );
	const resolution = Math.max( 3, Math.round( 2 * Math.PI * Math.sqrt( Math.max( xRadius, yRadius ) * scalingManager.getPixelWorldRatio() ) ) );
	expect( object.geometry.attributes.position.array.length ).toBe( resolution * 3 );
	expect( object.geometry.attributes.uv.array.length ).toBe( resolution * 2 );
	expect( object.geometry.index.array.length ).toBe( ( resolution - 2 ) * 3 );
}

function verifyColor( object, color ) {
	expect( object.material.uniforms.color.value ).toEqual( [ color.r, color.g, color.b, color.a ] );
	expect( object.material.transparent ).toBe( true );
}

function verifyTexture( object, texture ) {
	expect( object.material.uniforms.texture.value ).toBe( texture || null );
}

describe( "EllipseBlock", () => {
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
		expect( EllipseBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( EllipseBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			Point( 0, 0, 0 ),
			50,
			50,
			Color( config.meshColor, 1 ),
			Angle( 0, 0, 0 ),
			null
		] );
	} );
	
	it( "builds an Ellipse block from JSON", () => {
		const renderingContext = {
			scalingManager: {},
			config: { meshColor: 0xaabbcc }
		};
		const block = EllipseBlock.fromData( EllipseBlock, {
			id: "Ellipse 1",
			type: "Ellipse",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );
	
	it( "enables", () => {
		let block = makeBlock( EllipseBlock, [ true, Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );
	
	it( "disables", () => {
		let block = makeBlock( EllipseBlock, [ false, Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "draws an ellipse", () => {
		verify( Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) );
	} );
	
	it( "draws an ellipse to scale", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) );
	} );
	
	it( "draws a transparent ellipse", () => {
		verify( Point( 6, 5, 4 ), 40, 10, Color( 0xffffff, 0.5 ), Angle( 3, 2, 1 ) );
	} );
	
	it( "draws a zero-radius ellipse", () => {
		verify( Point( 6, 5, 4 ), 0, 0, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ) );
	} );
	
	it( "draws an ellipse with a negative radius", () => {
		verify( Point( 6, 5, 4 ), -2, 0, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ) );
	} );

	it( "draws a textured ellipse", () => {
		verify( Point( 6, 5, 4 ), 2, 2, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ), {} );
	} );
	
	it( "generates appropriate geometry", () => {
		let block = makeBlock( EllipseBlock, [ true, Point( 6, 5, 4 ), 0.5, 0.5, Color( 0xffffff, 1 ), Angle( 3, 2, 1 ), {} ] );
		block.setScalingManager( scalingManager );
		let object = verifyObjects( block, 1 )[ 0 ];
		const positionAttribute = object.geometry.attributes.position;
		const uvAttribute = object.geometry.attributes.uv;
		expect( object.geometry.attributes.position.array ).toApproximate( [ 1, 0,  0, 0, -1, 0, 0, 1, 0, -1, 0, 0 ] );
		expect( object.geometry.attributes.uv.array ).toApproximate( [ 1, 0.5, 0.5, 0, 0.5, 1, 0, 0.5 ] );
		expect( object.geometry.index.array ).toApproximate( [ 0, 1, 2, 1, 2, 3 ] );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( EllipseBlock, [] );
			block.setScalingManager( scalingManager );
			block.create3dObjects();
		} );
		
		for( const input of [ "xRadius", "yRadius" ] ) {
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