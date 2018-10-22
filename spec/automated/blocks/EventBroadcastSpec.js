require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const EventBroadcast = BlockTypes.get( "EventBroadcast" );
const Visualization = require( "../../build/Visualization" ).default;
const { EventsManager } = require( "../../build/core/EventsManager" );
const { BlockFactory } = require( "../../build/core/BlockFactory.js" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );

const Mocks = {
	EventBroadcastPublish: {
		id: "EventBroadcast1",
		type: "EventBroadcast",
		inputs: [
			{ accessType: "Value", value: 1 },
			{ accessType: "Value", value: "TestEvent" },
			{ accessType: "Value", value: { test: "pass" } }
		]
	},
	EventBroadcastNoPublish: {
		id: "EventBroadcast2",
		type: "EventBroadcast",
		inputs: [
			{ accessType: "Value", value: 0 },
			{ accessType: "Value", value: "TestEvent" },
			{ accessType: "Value", value: { test: "event" } }
		]

	}
};

let testPubSub = {
	publish( name, message ) {
		// do nothing
	}
};

Visualization.setPubSub( testPubSub );

let renderingContext = new RenderingContext( {}, {}, {}, {}, {}, {}, testPubSub );

describe( "EventBroadcast", () => {
	it( "is defined as a block type", () => {
		expect( EventBroadcast ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( EventBroadcast.getDefaultInputValues( {} ) ).toEqual( [ 0, "", "" ] );
	} );
} );
describe( "An event is published and", () => {
	beforeEach( () => {
		spyOn( testPubSub, "publish" );
	} );
	it( "is triggered", () => {
		let broadcast = BlockFactory.fromData( Mocks.EventBroadcastPublish, renderingContext );
		broadcast.execute();
		expect( testPubSub.publish ).toHaveBeenCalledWith( "TestEvent", { test: "pass" } );
	} );

	it( "is not triggered", () => {
		let broadcast = BlockFactory.fromData( Mocks.EventBroadcastNoPublish, renderingContext );

		expect( testPubSub.publish ).not.toHaveBeenCalled();
	} );
} );