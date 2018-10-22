require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const WaitBlock = BlockTypes.get( "Wait" );

const Mocks = {
	Wait0: {
		id: "WaitBlock",
		type: "WaitBlock",
		inputs: [
			{ accessType: "Value", value: 0 }
		]
	},
	Wait1: {
		id: "WaitBlock",
		type: "WaitBlock",
		inputs: [
			{ accessType: "Value", value: 10 }
		]
	}
};

const renderingContext = {
	animationManager: jasmine.createSpyObj( "animationManager", [ "requestFrame" ] )
};

describe( "WaitBlock", () => {
	let timeoutCallback;

	beforeEach( () => {
		global.window = {
			setTimeout: function( callback, duration ) {
				timeoutCallback = callback;
			}
		};

		spyOn( window, "setTimeout" ).and.callThrough();
	} );

	afterEach( () => {
		global.window = undefined;
	} );

	it( "is defined as a block type", () => {
		expect( WaitBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( WaitBlock.getDefaultInputValues( {} ) ).toEqual( [ 0 ] );
	} );

	it( "should not set timeout for 0 second duration", () => {
		let block = WaitBlock.fromData( WaitBlock, Mocks.Wait0, renderingContext );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
		expect( window.setTimeout ).not.toHaveBeenCalled();
		expect( renderingContext.animationManager.requestFrame ).not.toHaveBeenCalled();
	} );

	it( "should set timeout for 10 second duration", () => {
		let block = WaitBlock.fromData( WaitBlock, Mocks.Wait1, renderingContext );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
		expect( window.setTimeout ).toHaveBeenCalledWith( timeoutCallback, 10000 );
		expect( renderingContext.animationManager.requestFrame ).not.toHaveBeenCalled();
	} );

	it( "should request frame after 10 second timeout", () => {
		let block = WaitBlock.fromData( WaitBlock, Mocks.Wait1, renderingContext );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
		expect( window.setTimeout ).toHaveBeenCalledWith( timeoutCallback, 10000 );
		timeoutCallback();
		expect( renderingContext.animationManager.requestFrame ).toHaveBeenCalled();
		expect( block.getOutputValue( 0 ) ).toBe( 1 );
	} );
} );
