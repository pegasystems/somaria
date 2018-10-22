const { makeBlock, customMatchers, Point, Angle, Color } = require( "../TestUtils" );
const { verifyObjects, getTranslatedMatrix, verifyColor } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const TriangleBlock = BlockTypes.get( "Triangle" );

function verify( position, width, height, color, angle, verticalAnchor, horizontalAnchor, anchorX, anchorY ) {
	let block = makeBlock( TriangleBlock, [ true, position, width, height, color, angle, verticalAnchor, horizontalAnchor ] );
	let object = verifyObjects( block, 1 )[ 0 ];
	let scale = Point( width, height, 1 );
	expect( object.matrix ).toEqualStruct( getTranslatedMatrix( position, scale, angle, anchorX, anchorY, 0 ) );
	expect( object.material ).toBeDefined();
	expect( object.material.side ).toBe( THREE.DoubleSide );
	verifyColor( object, color );
	expect( object.geometry ).toBeDefined();
}

describe( "TriangleBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "is defined as a block type", () => {
		expect( TriangleBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { meshColor: 0xaabbcc };
		expect( TriangleBlock.getDefaultInputValues( config ) ).toEqual( [
			true,
			Point( 0, 0, 0 ),
			100,
			100,
			Color( config.meshColor, 1 ),
			Angle( 0, 0, 0 ),
			"center",
			"center"
		] );
	} );
	
	it( "enables", () => {
		let block = makeBlock( TriangleBlock, [ true, Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( true );
	} );
	
	it( "disables", () => {
		let block = makeBlock( TriangleBlock, [ false, Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ) ] );
		expect( block.isEnabled.getValue() ).toBe( false );
	} );

	it( "draws a triangle", () => {
		verify( Point( 1, 2, 3 ), 10, 20, Color( 0x000000, 1 ), Angle( 4, 5, 6 ), "center", "center", 0, 0 );
	} );
	
	it( "draws a transparent triangle", () => {
		verify( Point( 6, 5, 4 ), 20, 10, Color( 0xffffff, 0.5 ), Angle( 3, 2, 1 ), "center", "center", 0, 0 );
	} );
	
	const horizontalAnchors = [
		{ name: "min", value: 0.5 },
		{ name: "center", value: 0 },
		{ name: "max", value: -0.5 }
	];
	const verticalAnchors = [
		{ name: "max", value: -0.5 },
		{ name: "center", value: 0 },
		{ name: "min", value: 0.5 }
	];

	for( const verticalAnchor of verticalAnchors ) {
		for( const horizontalAnchor of horizontalAnchors ) {
			it( `draws a triangle anchored (${verticalAnchor.name}, ${horizontalAnchor.name})`, () => {
				verify( Point( 6, 5, 4 ), 20, 10, Color( 0x00ff00, 0.8 ), Angle( 1, 2, 3 ),
					verticalAnchor.name, horizontalAnchor.name, horizontalAnchor.value, verticalAnchor.value );
			} );
		}
	}
	
	describe( "at runtime", () => {
		let block = makeBlock( TriangleBlock, [] );
		block.create3dObjects();
		
		for( const input of [ "width", "height", "position", "rotation", "horizontalAnchor", "verticalAnchor" ] ) {
			it( `changes alignment on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasAlignmentChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );