const { makeBlock, customMatchers, Point } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const SmoothLineBlock = BlockTypes.get( "SmoothLine" );

let scalingManager;

function verify( inputPoints, closedPath, expectedPoints ) {
	const block = makeBlock( SmoothLineBlock, [ inputPoints, closedPath ] );
	block.setScalingManager( scalingManager );
	const actualPoints = block.getOutputValue( 0 );
	expect( actualPoints.length ).toBe( expectedPoints.length );
	for( let i = 0; i < actualPoints.length; i++ ) {
		expect( actualPoints[ i ] ).toEqualStruct( expectedPoints[ i ] );
	}
}

describe( "SmoothLineBlock", () => {
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
		expect( SmoothLineBlock ).toBeDefined();
	} );
	
	it( "builds a SmoothLine block from JSON", () => {
		const renderingContext = {
			scalingManager: {}
		};
		const block = SmoothLineBlock.fromData( SmoothLineBlock, {
			id: "Smooth Line 1",
			type: "SmoothLine",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );
	
	it( "defines default input values", () => {
		expect( SmoothLineBlock.getDefaultInputValues() ).toEqual( [ [], 0 ] );
	} );
	
	it( "does not interpolate 0 points", () => {
		verify( [], 0 , [] );
	} );
	
	it( "does not interpolate 1 point", () => {
		verify( [ Point( 1, 2, 3 ) ], 0, [ Point( 1, 2, 3 ) ] );
	} );
	
	it( "does not interpolate 2 points", () => {
		verify( [ Point( 1, 2, 3 ), Point( 4, 5, 6 ) ], 0, [ Point( 1, 2, 3 ), Point( 4, 5, 6 ) ] );
	} );
	
	it( "does not interpolate 4 points on a straight line", () => {
		verify( [ Point( 0, 0, 0 ), Point( 4, 4, 4 ), Point( 8, 8, 8 ) ], 0, [ Point( 0, 0, 0 ), Point( 4, 4, 4 ), Point( 8, 8, 8 ) ] );
	} );

	it( "interpolates 3 points", () => {
		verify( [ Point( -10, 10, 0 ), Point( 0, 0, 0 ), Point( 10, 10, 0 ) ], 0, [
			Point( -10, 10, 0 ),
			Point( -2.9289321881345267, 1.4644660940672642, 0 ),
			Point( 0, 0, 0 ),
			Point( 2.928932188134523, 1.464466094067261, 0 ),
			Point( 10, 10, 0 )
		] );
	} );

	it( "interpolates 3 points for closed path", () => {
		verify( [ Point( -10, 10, 0 ), Point( 0, 0, 0 ), Point( 10, 10, 0 ) ], 1, [
			Point( -10.000000000000002, 10.000000000000002, 0 ),
			Point( -8.641624752845962, 6.819309503454549, 0 ),
			Point( -4.010592005210213, 2.0045985168331106, 0 ),
			Point( 0, 0, 0 ),
			Point( 4.010592005210211, 2.004598516833109, 0 ),
			Point( 8.64162475284596, 6.819309503454547, 0 ),
			Point( 10, 10, 0 ),
			Point( 5.0331424552943895, 11.398616950171554, 0 ),
			Point( -5.033142455294386, 11.398616950171554, 0 ),
			Point( -10, 10, 0 )
		] );
	} );
	
	it( "interpolates 4 points", () => {
		verify( [ Point( 0, 0, 0 ), Point( 10, 0, 0 ), Point( 10, 10, 0 ), Point( 0, 10, 0 ) ], 0, [
			Point( 0, 0, 0 ),
			Point( 7.803300858899109, -0.7322330470336315, 0 ),
			Point( 10, 0, 0 ),
			Point( 11.250000000000002, 4.999999999999999, 0 ),
			Point( 10, 10, 0 ),
			Point( 7.803300858899107, 10.732233047033635, 0 ),
			Point( 0, 10, 0 )
		] );
	} );

	it( "interpolates 4 points with closed path", () => {
		verify( [ Point( 0, 0, 0 ), Point( 10, 0, 0 ), Point( 10, 10, 0 ), Point( 0, 10, 0 ) ], 1, [
			Point( 0, 0, 0 ),
			Point( 4.999999999999999, -1.2500000000000002, 0 ),
			Point( 10, 0, 0 ),
			Point( 11.250000000000002, 4.999999999999999, 0 ),
			Point( 10, 10, 0 ),
			Point( 5.000000000000001, 11.250000000000002, 0 ),
			Point( 0, 10, 0 ),
			Point( -1.2500000000000002, 5.000000000000001, 0 ),
			Point( 0, 0, 0 )
		] );
	} );

	it( "interpolates 4 points of bigger square", () => {
		verify( [ Point( 0, 0, 0 ), Point( 50, 0, 0 ), Point( 50, 50, 0 ), Point( 0, 50, 0 ) ], 0, [
			Point( 0, 0, 0 ),
			Point( 17.100424859373685, -1.6495751406263146, 0 ),
			Point( 32.94967993129766, -3.560417316673996, 0 ),
			Point( 43.57584971874737, -3.125, 0 ),
			Point( 48.659570737082426, -1.1067449223247574, 0 ),
			Point( 50, 0, 0 ),
			Point( 53.125, 5.112621779128351, 0 ),
			Point( 55.412658773652744, 13.868194292215398, 0 ),
			Point( 56.24999999999999, 24.999999999999996, 0 ),
			Point( 55.41265877365275, 36.13180570778459, 0 ),
			Point( 53.125, 44.88737822087165, 0 ),
			Point( 50, 50, 0 ),
			Point( 48.659570737082426, 51.106744922324765, 0 ),
			Point( 43.57584971874737, 53.12500000000001, 0 ),
			Point( 32.94967993129766, 53.56041731667399, 0 ),
			Point( 17.100424859373685, 51.64957514062631, 0 ),
			Point( 0, 50, 0 )
		] );
	} );

	it( "interpolates 3 points at a higher pixelWorldRatio", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( [ Point( -10, 10, 10 ), Point( 0, 0, 0 ), Point( 10, 10, 10 ) ], 0, [
			Point( -10, 10, 10 ),
			Point( -6.173165676349102, 5.269126493741796, 5.269126493741796 ),
			Point( -2.9289321881345267, 1.4644660940672636, 1.4644660940672636 ),
			Point( -0.7612046748871318, 0.11147584370176959, 0.11147584370176959 ),
			Point( 0, 0, 0 ),
			Point( 0.7612046748871318, 0.1114758437017697, 0.1114758437017697 ),
			Point( 2.9289321881345236, 1.4644660940672618, 1.4644660940672618 ),
			Point( 6.173165676349102, 5.269126493741797, 5.269126493741797 ),
			Point( 10, 10, 10 )
		] );
	} );
	
	describe( "at runtime", () => {
		let block;
	
		beforeAll( () => {
			block = makeBlock( SmoothLineBlock, [ [] ] );
		} );
	
		it( "changes path new points", () => {
			block.points.valueHasChanged = true;
			expect( block.hasPathChanged( 1 ) ).toBe( true );
			block.points.valueHasChanged = false;
		} );
		
		it( "changes path when the scaling factor changes", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasPathChanged( 1 ) ).toBe( true );
			block.renderedPixelWorldRatio = undefined;
		} );
		
		it( "does not change path when the scaling factor has not changed", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasPathChanged( 2 ) ).toBe( false );
			block.renderedPixelWorldRatio = undefined;
		} );
	} );
} );