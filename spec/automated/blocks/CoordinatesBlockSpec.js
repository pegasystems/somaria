const { makeBlock, Point, precision } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const CoordinatesBlock = BlockTypes.get( "Coordinates" );

const piOverTwo = Math.PI / 2;

describe( "CoordinatesBlock", () => {
	it( "is defined as a block type", () => {
		expect( CoordinatesBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( CoordinatesBlock.getDefaultInputValues() ).toEqual( [ Point( 0, 0, 0 ), piOverTwo, 0, 0 ] );
	} );

	it( "builds a point object with no radius", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), 0, 0, 0 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 20, 30 );
	} );

	it( "builds a point object with no rotation", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), 0, 0, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 20, 60 );
	} );
	
	it( "builds a point object with a 90 degree azimuth", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), piOverTwo, 0, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 40, 20, 30 );
	} );
	
	it( "builds a point object with a 90 degree azimuth and 90 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), piOverTwo, piOverTwo, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 50, 30 );
	} );
	
	it( "builds a point object with a 180 degree azimuth and 90 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), Math.PI, piOverTwo, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 20, 0 );
	} );
	
	it( "builds a point object with a 270 degree azimuth and 90 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), Math.PI + piOverTwo, piOverTwo, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, -10, 30 );
	} );
	
	it( "builds a point object with a 90 degree azimuth and 180 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), piOverTwo, Math.PI, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, -20, 20, 30 );
	} );
	
	it( "builds a point object with a 90 degree azimuth and 270 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), piOverTwo, Math.PI + piOverTwo, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, -10, 30 );
	} );
	
	it( "builds a point object with a 180 degree azimuth and 180 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), Math.PI, Math.PI, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 20, 0 );
	} );
	
	it( "builds a point object with a 270 degree azimuth and 270 degree polar", () => {
		let block = makeBlock( CoordinatesBlock, [ Point( 10, 20, 30 ), Math.PI + piOverTwo, Math.PI + piOverTwo, 30 ] );
		let point = block.getOutputValue( 0 );
		assertPoint( point, 10, 50, 30 );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( CoordinatesBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "origin", "azimuth", "polar", "radius" ] ) {
			it( `changes texture on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasPointChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );

function assertPoint( point, x, y, z ) {
	expect( point.x ).toBeCloseTo( x, precision );
	expect( point.y ).toBeCloseTo( y, precision );
	expect( point.z ).toBeCloseTo( z, precision );
}