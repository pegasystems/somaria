const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getQuaternion, verifyColor } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const LineBlock = BlockTypes.get( "Line" );

function verify( block, position, width, height, angle, color ) {
	let objects = block.create3dObjects();
	let object = verifyObjects( block, 1 )[ 0 ];
	expect( object.scale ).toEqualStruct( new THREE.Vector3( width, height, 1 ) );
	expect( object.position ).toEqualStruct( new THREE.Vector3( position.x, position.y, position.z ) );
	expect( object.quaternion ).toEqualStruct( getQuaternion( angle.x, angle.y, angle.z ) );
	expect( object.geometry ).toBeDefined();
	expect( object.material.side ).toBe( THREE.DoubleSide );
	verifyColor( object, color );
}

describe( "LineBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( LineBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( LineBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			Point( 0, 0, 0 ),
			Point( 0, 0, 0 ),
			1,
			Color( config.meshColor, 1 )
		] );
	} );

	it( "enables", () => {
		let block = makeBlock( LineBlock, [ Point( 1, 2, 3 ), Point( 4, 5, 6 ), 2, Color( 0x112233, 0.5 ) ], [ true ] );
		expect( block.isEnabled ).toBe( true );
	} );

	it( "disables", () => {
		let block = makeBlock( LineBlock, [ Point( 1, 2, 3 ), Point( 4, 5, 6 ), 2, Color( 0x112233, 0.5 ) ], [ false ] );
		expect( block.isEnabled ).toBe( false );
	} );

	it( "draws a horizontal line", () => {
		let block = makeBlock( LineBlock, [ Point( 0, 0, 0 ), Point( 80, 0, 0 ), 10, Color( 0xFFFFFF, 1 ) ], [ true ] );
		verify( block, Point( 40, 0, 0 ), 80, 10, Angle( 0, 0, 0 ), Color( 0xFFFFFF, 1 ) );
	} );

	it( "draws a vertical line", () => {
		let block = makeBlock( LineBlock, [ Point( 0, 0, 0 ), Point( 0, 60, 0 ), 15, Color( 0xFFFFFF, 1 ) ], [ true ] );
		verify( block, Point( 0, 30, 0 ), 60, 15, Angle( 0, 0, Math.PI / 2 ), Color( 0xFFFFFF, 1 ) );
	} );

	it( "is parallel to the xy plane", () => {
		let block = makeBlock( LineBlock, [ Point( 0, 0, 0 ), Point( 30, 0, 40 ), 10, Color( 0xFFFFFF, 1 ) ], [ true ] );
		verify( block, Point( 15, 0, 20 ), 50, 10, Angle( 0, 0, 0 ), Color( 0xFFFFFF, 1 ) );
	} );

	it( "preserves color and opacity", () => {
		let block = makeBlock( LineBlock, [ Point( 0, 0, 0 ), Point( 80, 0, 0 ), 10, Color( 0x1267AB, 0.5 ) ], [ true ] );
		verify( block, Point( 40, 0, 0 ), 80, 10, Angle( 0, 0, 0 ), Color( 0x1267AB, 0.5 ) );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( LineBlock, [] );
			block.create3dObjects();
		} );
		
		for( const input of [ "startPosition", "endPosition" ] ) {
			it( `changes texture on new ${input} value`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.havePositionsChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );