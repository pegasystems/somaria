const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );
const EnvironmentVariablesBlock = BlockTypes.get( "EnvironmentVariables" );

const Mock = {
	type: "EnvironmentVariables",
	inputs: []
};

function verify( config, canvasWidth, canvasHeight, pixelWorldRatio, expectedWidth, expectedHeight, expectedBackgroundColor ) {
	let renderingContext = new RenderingContext(
		{ // Visualization
			renderer: {
				getSize: () => ( {
					width: canvasWidth,
					height: canvasHeight
				} )
			}
		},
		config, // config
		undefined, // external inputs
		undefined, // EventHandler
		undefined, // AnimationManager
		{ // ScalingManager
			getPixelWorldRatio: () => pixelWorldRatio
		}
	);
	
	let block = EnvironmentVariablesBlock.fromData( EnvironmentVariablesBlock, Mock, renderingContext );
	
	expect( block.getOutputValue( 0 ) ).toBe( expectedWidth );
	expect( block.getOutputValue( 1 ) ).toBe( expectedHeight );
	expect( block.getOutputValue( 2 ) ).toBe( expectedBackgroundColor );
	expect( block.getOutputValue( 3 ) ).toBeUndefined();
}

describe( "EnvironmentVariablesBlock", () => {
	it( "is defined as a block type", () => {
		expect( EnvironmentVariablesBlock ).toBeDefined();
	} );
	
	it( "returns the correct values for a visualization", () => {
		verify( {
			width: 500,
			height: 500,
			backgroundColor: 0xFFFFFF
		}, 500, 500, 1, 500, 500, 0xFFFFFF );
	} );
	
	it( "returns the correct values for cropped visualization", () => {
		verify( {
			width: 500,
			height: 250,
			scalingMode: "fit",
			backgroundColor: 0x000000
		}, 500, 500, 1, 500, 500, 0x000000 );
	} );
	
	it( "returns the correct values for a scaled, cropped visualization", () => {
		verify( {
			width: 500,
			height: 500,
			scalingMode: "fit",
			backgroundColor: 0x000000
		}, 250, 500, 0.5, 500, 1000, 0x000000 );
	} );
} );