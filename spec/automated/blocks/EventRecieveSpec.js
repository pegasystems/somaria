require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const EventReceive = BlockTypes.get( "EventReceive" );
const Visualization = require( "../../build/Visualization" ).default;
const { EventsManager } = require( "../../build/core/EventsManager" );
const { BlockFactory } = require( "../../build/core/BlockFactory.js" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );

const Mocks = {
	EventReceive: {
		id: "EventReceive1",
		type: "EventReceive",
		inputs: [
			{ accessType: "name", value: "ReceiveTestEvent" },
			{ accessType: "intialValue", value: -1 }
		]
	}
};

describe( "EventReceive", () => {
	it( "is defined as a block type", () => {
		expect( EventReceive ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( EventReceive.getDefaultInputValues() ).toEqual( [ "", 0 ] );
	} );
} );

describe( "An event is subscribed to", () => {
	let animationManager;

	beforeEach( () => {
		animationManager = jasmine.createSpyObj( "animationManager", [ "requestFrame" ] );
	} );

	it( "has the correct initial value", () => {
		const testPubSub = {
			subscribe( name, callback ) {
				return name;
			}
		};
		Visualization.setPubSub( testPubSub );
		const renderingContext = new RenderingContext( { render: jasmine.createSpy( "renderScene" ) }, {}, {}, {}, animationManager, {}, testPubSub );

		const block = BlockFactory.fromData( Mocks.EventReceive, renderingContext );

		expect( block.getOutputValue( 0 ) ).toEqual( -1 );
	} );

	it( "registers correctly with the events manager", () => {
		const testPubSub = {
			subscribe( name, callback ) {
				callback( "abc" );
				return name;
			}
		};
		Visualization.setPubSub( testPubSub );
		const renderingContext = new RenderingContext( { render: jasmine.createSpy( "renderScene" ) }, {}, {}, {}, animationManager, {}, testPubSub );

		spyOn( testPubSub, "subscribe" );
		const block = BlockFactory.fromData( Mocks.EventReceive, renderingContext );

		expect( testPubSub.subscribe ).toHaveBeenCalledWith( "ReceiveTestEvent", jasmine.any( Function ) );
	} );

	it( "has the correct output value", () => {
		const testPubSub = {
			subscribe( name, callback ) {
				callback( "abc" );
				return name;
			}
		};
		Visualization.setPubSub( testPubSub );
		const renderingContext = new RenderingContext( { render: jasmine.createSpy( "renderScene" ) }, {}, {}, {}, animationManager, {}, testPubSub );

		const block = BlockFactory.fromData( Mocks.EventReceive, renderingContext );

		expect( block.getOutputValue() ).toBe( "abc" );
		expect( animationManager.requestFrame ).toHaveBeenCalled();
	} );
} );