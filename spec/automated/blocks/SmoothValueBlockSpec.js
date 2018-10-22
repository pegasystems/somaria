require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const SmoothValueBlock = BlockTypes.get( "SmoothValue" );

const Mocks = {
	SmoothValue0: {
		id: "SmoothValueBlock",
		type: "SmoothValueBlock",
		inputs: [
			{ accessType: "Value", value: 0 },
			{ accessType: "Value", value: 0 }
		]
	},
	SmoothValue1: {
		id: "SmoothValueBlock",
		type: "SmoothValueBlock",
		inputs: [
			{ accessType: "Value", value: 1 },
			{ accessType: "Value", value: 1 }
		]
	}
};

const renderingContext = {
	animationManager: jasmine.createSpyObj( "animationManager", [ "requestFrame" ] )
};

describe( "SmoothValueBlock", () => {
	it( "is defined as a block type", () => {
		expect( SmoothValueBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( SmoothValueBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0 ] );
	} );
	
	it( "should not interpolate 0", () => {
		let block = SmoothValueBlock.fromData( SmoothValueBlock, Mocks.SmoothValue0, renderingContext );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
		expect( renderingContext.animationManager.requestFrame ).toHaveBeenCalled();
	} );
	
	it( "should interpolate 1", () => {
		let block = SmoothValueBlock.fromData( SmoothValueBlock, Mocks.SmoothValue1, renderingContext );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
		let startTime = block.startTime;
		block.interpolateValue( startTime + 500 );
		expect( block.interpolatedValue ).toBe( 0.5 );
		block.interpolateValue( startTime + 1000 );
		expect( block.interpolatedValue ).toBe( 1.0 );
	} );
} );