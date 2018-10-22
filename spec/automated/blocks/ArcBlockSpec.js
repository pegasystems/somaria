const { makeBlock, customMatchers, precision, Angle, AngleDegrees, Point, Color } = require( "../TestUtils" );
const { verifyObjects } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ArcBlock = BlockTypes.get( "Arc" );

let scalingManager;

function verify( position, xOuterRadius, yOuterRadius, xInnerRadius, yInnerRadius, sweepAngle, startAngle, color, expectedVertices ) {
	let block = makeBlock( ArcBlock, [ true, position, xOuterRadius, yOuterRadius, xInnerRadius, yInnerRadius, sweepAngle, startAngle, color ] );
	block.setScalingManager( scalingManager );
	let object = verifyObjects( block, 1 )[ 0 ];
	expect( object.position ).toEqualStruct( new THREE.Vector3( position.x, position.y, position.z ) );
	expect( object.material ).toBeDefined();
	expect( object.material.color.getHex() ).toBe( color.getHex() );
	expect( object.material.transparent ).toBe( true );
	expect( object.material.opacity ).toBe( color.a );
	expect( object.material.side ).toBe( THREE.DoubleSide );
	expect( object.geometry ).toBeAny( THREE.BufferGeometry );
	expect( object.geometry.attributes.position.array ).toApproximate( expectedVertices );
	expect( object.geometry.index.array.length ).toBe( ( ( expectedVertices.length / 3 ) - 2 ) * 3 );
}

describe( "ArcBlock", () => {
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
		expect( ArcBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		let config = { meshColor: 0x112233 };
		expect( ArcBlock.getDefaultInputValues( config ) ).toEqual( [ true, Point( 0, 0, 0 ), 50, 50, 0, 0, Math.PI / 2, 0, Color( config.meshColor, 1 ) ] );
	} );
	
	it( "builds an Arc block from JSON", () => {
		const renderingContext = {
			scalingManager: {},
			config: { meshColor: 0xaabbc }
		};
		const block = ArcBlock.fromData( ArcBlock, {
			id: "Arc 1",
			type: "Arc",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );

	it( "enables", () => {
		let block = makeBlock( ArcBlock, [ true, Point( 6, 5, 4 ), 20, 10, 5, 7, 1, 2, Color( 0xffffff, 0.5 ) ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );

	it( "disables", () => {
		let block = makeBlock( ArcBlock, [ false, Point( 6, 5, 4 ), 20, 10, 5, 7, 1, 2, Color( 0xffffff, 0.5 ) ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "draws a transparent arc", () => {
		verify( Point( 6, 5, 4 ), 2, 1, 0.25, 0.5, 1, 2, Color( 0xffffff, 0.5 ),
			[ -0.10403671115636826, 0.4546487033367157, 0, -0.832293689250946, 0.9092974066734314, 0,
			-0.24749812483787537, 0.07056000083684921, 0, -1.979984998703003, 0.14112000167369843, 0 ] );
	} );

	it( "draws a transparent arc to scale", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( Point( 1, 2, 3 ), 2, 2, 1, 1, Math.PI / 3, Math.PI / 2, Color( 0x445566, 0.75 ),
			[ 0, 1, 0, 0, 2, 0, -0.5, 0.8660253882408142, 0, -1, 1.7320507764816284, 0, -0.8660253882408142, 0.5, 0, -1.7320507764816284, 1, 0 ] );
	} );
	
	it( "draws a very narrow arc", () => {
		verify( Point( 6, 5, 4 ), 3, 2, 2, 1, 0.05, 2, Color( 0x000000, 1 ),
			[ -0.832293689250946, 0.9092974066734314, 0, -1.2484405040740967, 1.8185948133468628, 0,
			-0.9221453666687012, 0.8873623609542847, 0, -1.3832180500030518, 1.7747247219085693, 0 ] );
	} );
	
	it( "draws a wide negative arc", () => {
		verify( Point( 6, 5, 4 ), 0.5, 0.5, 0, 0, -Math.PI, 2, Color( 0x000000, 1 ),
			[ 0, 0, 0, -0.2080734223127365, 0.4546487033367157, 0, 0, 0, 0, 0.4546487033367157, 0.2080734223127365, 0, 0, 0, 0, 0.2080734223127365, -0.4546487033367157, 0 ] );
	} );
	
	it( "draws a zero sweep arc", () => {
		verify( Point( 6, 5, 4 ), 4, 4, 2, 2, 0, 0, Color( 0x000000, 1 ),
			[ 2, 0, 0, 4, 0, 0,
			2, 0, 0, 4, 0, 0 ] );
	} );
	
	it( "draws a zero width arc", () => {
		verify( Point( 6, 5, 4 ), 4, 4, 4, 4, Math.PI / 2, 0, Color( 0x000000, 1 ),
			[ 4, 0, 0, 4, 0, 0, 3.464101552963257, 2, 0, 3.464101552963257, 2, 0, 2, 3.464101552963257, 0, 2, 3.464101552963257, 0, 0, 4, 0, 0, 4, 0 ] );
	} );
	
	it( "draws an arc with zero sweep and zero width", () => {
		verify( Point( 6, 5, 4 ), 4, 4, 4, 4, 0, 0, Color( 0x000000, 1 ),
			[ 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0 ] );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( ArcBlock, [] );
			block.setScalingManager( scalingManager );
			block.create3dObjects();
		} );
		
		for( const input of [ "xOuterRadius", "yOuterRadius", "xInnerRadius", "yInnerRadius", "sweepAngle", "startAngle" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasShapeChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
		
		it( "changes geometry when the scaling factor changes", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasShapeChanged( 1 ) ).toBe( true );
			block.renderedPixelWorldRatio = undefined;
		} );
		
		it( "does not change geometry when the scaling factor has not changed", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasShapeChanged( 2 ) ).toBe( false );
			block.renderedPixelWorldRatio = undefined;
		} );
	} );
} );