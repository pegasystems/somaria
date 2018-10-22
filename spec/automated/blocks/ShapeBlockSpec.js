const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getQuaternion, verifyColor } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ShapeBlock = BlockTypes.get( "Shape" );

function verifyNoShape( listOfPoints, position, color, rotation ) {
	verifyObjects( makeBlock( ShapeBlock, [ true, listOfPoints, position, color, rotation ] ), 0 );
}

function verifyShape( listOfPoints, position, color, rotation ) {
	let block = makeBlock( ShapeBlock, [ true, listOfPoints, position, color, rotation ] );
	let object = verifyObjects( block, 1 )[ 0 ];
	expect( object.material ).toBeDefined();
	expect( object.material.side ).toBe( THREE.DoubleSide );
	verifyColor( object, color );
	expect( object.geometry ).toBeAny( THREE.ShapeBufferGeometry );
	expect( object.position ).toEqualStruct( new THREE.Vector3( position.x, position.y, position.z ) );
	expect( object.quaternion ).toEqualStruct( getQuaternion( rotation.x, rotation.y, rotation.z ) );
}

describe( "ShapeBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( ShapeBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };

		expect( ShapeBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			[],
			Point( 0, 0, 0 ),
			Color( config.meshColor, 1 ),
			Angle( 0, 0, 0 )
		] );
	} );

	it( "enables", () => {
		let block = makeBlock( ShapeBlock, [ true, [ Point( 1, 2, 3 ) ], Point( 61, 18, 90 ), Color( 0x000000, 1 ), Angle( 33, 57, 10 ) ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );

	it( "disables", () => {
		let block = makeBlock( ShapeBlock, [ false, [ Point( 1, 2, 3 ) ], Point( 61, 18, 90 ), Color( 0x000000, 1 ), Angle( 33, 57, 10 ) ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "it draws nothing when no points are provided", () => {
		verifyNoShape( [], Point( 17, 25, 44 ), Color( 0x000000, 1 ), Angle( 30, 60, 90 ) );
	} );

	it( "it draws nothing when one point is provided", () => {
		verifyNoShape( [ Point( 0, 0, 0 ) ], Point( 17, 25, 44 ), Color( 0x000000, 1 ), Angle( 30, 60, 90 ) );
	} );

	it( "it draws nothing when two points are provided", () => {
		verifyNoShape( [ Point( 0, 0, 0 ), Point( 7, 18, 50 ) ], Point( 17, 25, 44 ), Color( 0x000000, 1 ), Angle( 30, 60, 90 ) );
	} );

	it( "it draws a black shape", () => {
		verifyShape( [ Point( 0, 0, 0 ), Point( 7, 18, 50 ), Point( 14, 4, 21 ) ], Point( 17, 25, 44 ), Color( 0x000000, 1 ), Angle( 30, 60, 90 ) );
	} );

	it( "it draws a closed red shape", () => {
		verifyShape( [ Point( 5, 65, 43 ), Point( 10, 35, 15 ), Point( 45, 26, 66 ) ], Point( 38, 96, 11 ), Color( 0xff0000, 1 ), Angle( 77, 49, 29 ) );
	} );
} );
