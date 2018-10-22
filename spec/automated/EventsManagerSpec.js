const { EventsManager } = require( "../build/core/EventsManager.js" );

let pubsub;

describe( "EventsManager", () => {
	let manager;
	let callback = () => {
		//dummy function
	};

	beforeEach( () => {
		pubsub = {
			subscribe( name, callbackFunction ) {
				return name + "-a";
			},
			publish( name, data ) {
				// do nothing
			},
			unsubscribe( token ) {
				// do nothing
			}
		};
		spyOn( pubsub, "publish" );
		spyOn( pubsub, "subscribe" ).and.callThrough();
		spyOn( pubsub, "unsubscribe" );
		manager = new EventsManager( pubsub );
	} );

	it( "can publish", () => {
		manager.publish( "name", "data" );

		expect( pubsub.publish ).toHaveBeenCalledWith( "name", "data" );
	} );

	it( "can subscribe", () => {
		manager.subscribe( "name", callback );

		expect( pubsub.subscribe ).toHaveBeenCalledWith( "name", callback );
		let tokens = manager.getCurrentSubscriptionTokens();
		expect( tokens.length ).toBe( 1 );
	} );

	it( "can subscribe multiple", () => {
		manager.subscribe( "name1", callback );
		manager.subscribe( "name2", callback );

		let tokens = manager.getCurrentSubscriptionTokens();
		expect( tokens.length ).toBe( 2 );
		expect( tokens.pop() ).toBe( "name2-a" );
		expect( tokens.pop() ).toBe( "name1-a" );
	} );

	it( "can unsubscribe all", () => {
		manager.subscribe( "name1", callback );
		manager.subscribe( "name2", callback );

		manager.unsubscribeAll();

		let tokens = manager.getCurrentSubscriptionTokens();
		expect( tokens.length ).toBe( 0 );
	} );
} );