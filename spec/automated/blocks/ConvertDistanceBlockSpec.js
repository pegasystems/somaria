const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ConvertDistanceBlock = BlockTypes.get( "ConvertDistance" );

let scalingManager;

function verify( pixelWorldRatio, inputDistance, convertTo, expectedDistance ) {
	scalingManager.pixelWorldRatio = pixelWorldRatio;
	let block = makeBlock( ConvertDistanceBlock, [ inputDistance, convertTo ] );
	block.setScalingManager( scalingManager );
	expect( block.getOutputValue( 0 ) ).toBe( expectedDistance );
}

describe( "ConvertDistanceBlock", () => {
	beforeEach( () => {
		scalingManager = {
			pixelWorldRatio: 1,
			getPixelWorldRatio: function() {
				return this.pixelWorldRatio;
			}
		};
	} );
	
	it( "is defined as a block type", () => {
		expect( ConvertDistanceBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ConvertDistanceBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, "pixels" ] );
	} );
	
	it( "builds a ConvertDistance block from JSON", () => {
		const renderingContext = {
			scalingManager: {}
		};
		const block = ConvertDistanceBlock.fromData( ConvertDistanceBlock, {
			id: "Convert distance 1",
			type: "ConvertDistance",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );
	
	it( "converts equivalent world units to pixels", () => {
		verify( 1, 10, "pixels", 10 );
	} );
	
	it( "converts equivalent pixels to world units", () => {
		verify( 1, 20, "units", 20 );
	} );
	
	it( "performs no conversion when the convert to unit is unknown", () => {
		verify( 4, 20, "meters", 20 );
	} );
	
	it( "converts world units to pixels at double size", () => {
		verify( 2, 10, "pixels", 20 );
	} );
	
	it( "converts world units to pixels at half size", () => {
		verify( 0.5, 10, "pixels", 5 );
	} );
	
	it( "converts pixels to world units at double size", () => {
		verify( 2, 10, "units", 5 );
	} );
	
	it( "converts pixels to world units at half size", () => {
		verify( 0.5, 10, "units", 20 );
	} );
} );