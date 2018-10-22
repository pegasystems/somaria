const { makeBlock, customMatchers, Point, Angle, Color, getQuaternion } = require( "../TestUtils" );
const { verifyObjects, verifyColor } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const PathBlock = BlockTypes.get( "Path" );

function verifyPath( listOfPoints, color, isClosed ) {
	let block = makeBlock( PathBlock, [ true, listOfPoints, color, isClosed ] );
	let object = verifyObjects( block, 1 )[ 0 ];
	expect( object.material ).toBeDefined();
	expect( object.material ).toBeAny( THREE.LineBasicMaterial );
	verifyColor( object, color );
	expect( object.material.side ).toBe( THREE.DoubleSide );
	expect( object.geometry ).toBeDefined();
	expect( object ).toBeAny( THREE.Line );
	let pointArray = object.geometry.attributes.position.array;
	expect( pointArray ).toBeDefined();
	assertPathPoints( pointArray, listOfPoints, isClosed );
}

function assertPathPoints( vertices, listOfPoints, isClosed ) {
	if( isClosed ) {
		expect( vertices.length ).toBe( ( listOfPoints.length + 1 ) * 3 );
	}
	else {
		expect( vertices.length ).toBe( listOfPoints.length * 3 );
	}
	let i = 0;
	for( let point of listOfPoints ) {
		expect( vertices[ i++ ] ).toBe( point.x );
		expect( vertices[ i++ ] ).toBe( point.y );
		expect( vertices[ i++ ] ).toBe( point.z );
	}
	if( isClosed ) {
		expect( vertices[ i++ ] ).toBe( listOfPoints[ 0 ].x );
		expect( vertices[ i++ ] ).toBe( listOfPoints[ 0 ].y );
		expect( vertices[ i++ ] ).toBe( listOfPoints[ 0 ].z );
	}
}

describe( "PathBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( PathBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };

		expect( PathBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			[],
			Color( config.meshColor, 1 ),
			false
		] );
	} );

	it( "enables", () => {
		let block = makeBlock( PathBlock, [ true, Point( 1, 2, 3 ), Color( 0x000000, 1 ), true ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );

	it( "disables", () => {
		let block = makeBlock( PathBlock, [ false, Point( 1, 2, 3 ), Color( 0x000000, 1 ), false ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );
	
	it( "it draws nothing if no points are specified", () => {
		let block = makeBlock( PathBlock, [ true, [], Color( 0x000000, 1 ), false ] );
		verifyObjects( block, 0 );
	} );
	
	it( "it draws nothing if only one point is specified", () => {
		let block = makeBlock( PathBlock, [ true, [ Point( 7, 18, 50 ) ], Color( 0x000000, 1 ), false ] );
		verifyObjects( block, 0 );
	} );

	it( "it draws a black line", () => {
		verifyPath( [ Point( 0, 0, 0 ), Point( 7, 18, 50 ), Point( 14, 4, 21 ) ], Color( 0x000000, 1 ), false );
	} );

	it( "it draws a closed red line", () => {
		verifyPath( [ Point( 5, 65, 43 ), Point( 10, 35, 15 ), Point( 45, 26, 66 ) ], Color( 0xff0000, 1 ), true );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( PathBlock, [] );
			block.create3dObjects();
		} );
		
		for( const input of [ "list", "isClosed" ] ) {
			it( `changes line on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasPathChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );
