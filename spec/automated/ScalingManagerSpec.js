const THREE = require( "three" );
const { ScalingManager } = require( "../build/core/ScalingManager.js" );

describe( "ScalingManager", () => {
	function verifyScaling( config, canvasWidth, canvasHeight, aspect, expectedFov, expectedPixelWorldRatio ) {
		const camera = new THREE.PerspectiveCamera( config.fov, 1.5, 1, 10 );
		const scalingManager = new ScalingManager( camera, config );
		scalingManager.resize( canvasWidth, canvasHeight );
		
		expect( camera ).toBeDefined();
		expect( camera.fov ).toBeCloseTo( expectedFov, 2 );
		expect( camera.aspect ).toBe( aspect );
		expect( camera.near ).toBe( 1 );
		expect( camera.far ).toBe( 10 );
		
		expect( scalingManager.getPixelWorldRatio() ).toBe( expectedPixelWorldRatio );
	}
	
	it( "scales to fit a larger canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fit"
		}, 600, 600, 1, 30, 1.2 );
	} );
	
	it( "scales to fit a smaller canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fit"
		}, 200, 200, 1, 30, 0.4 );
	} );
	
	it( "scales to fit a wider canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fit"
		}, 500, 250, 2, 30, 0.5 );
	} );
	
	it( "scales to fit a narrower canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fit"
		}, 250, 500, 0.5, 56.37, 0.5 );
	} );
	
	it( "scales to fill a larger canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fill"
		}, 600, 600, 1, 30, 1.2 );
	} );
	
	it( "scales to fill a smaller canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fill"
		}, 200, 200, 1, 30, 0.4 );
	} );
	
	it( "scales to fill a wider canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fill"
		}, 500, 250, 2, 15.26, 1 );
	} );
	
	it( "scales to fill a narrower canvas", () => {
		verifyScaling( {
			width: 500,
			height: 500,
			fov: 30,
			scalingMode: "fill"
		}, 250, 500, 0.5, 30, 1 );
	} );
	
	it( "does not scale", () => {
		verifyScaling( {
			width: 500,
			height: 200,
			fov: 30,
			scalingMode: "none"
		}, 250, 500, 0.5, 67.63, 1 );
	} );
} );