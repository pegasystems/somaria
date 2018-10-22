require( "./TestUtils" );
const { EventHandler } = require( "../build/core/EventHandler" );

describe( "EventHandler", () => {
	let visualization;
	let animationManager;
	
	beforeEach( () => {
		visualization = {
			render: jasmine.createSpy( "visualization.render" ),
			renderer: {
				domElement: jasmine.createSpyObj( "visualization.renderer.domElement", [ "addEventListener" ] )
			},
			camera: {}
		};
		animationManager = jasmine.createSpyObj( "animationManager", [ "requestFrame", "cancelFrame" ] );
	} );
	
	it( "listens for mouse events", () => {
		const eventHandler = new EventHandler( visualization, animationManager );
		
		const eventListenerSpy = visualization.renderer.domElement.addEventListener;
		
		expect( eventListenerSpy ).toHaveBeenCalledWith( "mousedown", eventHandler, false );
		expect( eventListenerSpy ).toHaveBeenCalledWith( "mouseup", eventHandler, false );
		expect( eventListenerSpy ).toHaveBeenCalledWith( "mousemove", eventHandler, false );
	} );
	
	describe( "handleEvent", () => {
		let event;
		
		beforeEach( () => {
			event = jasmine.createSpyObj( "animationManager", [ "stopPropagation", "preventDefault" ] );
		} );
		
		it( "does nothing when no events are registered", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			spyOn( eventHandler, "shouldRenderForEvent" ).and.returnValue( true );
			
			eventHandler.handleEvent( event );
			
			expect( event.stopPropagation ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
			
			expect( visualization.render ).not.toHaveBeenCalled();
			expect( animationManager.cancelFrame ).not.toHaveBeenCalled();
		} );
		
		it( "does nothing when no events are registered after clear of events", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			eventHandler.addEventListener( { id: 1 }, () => {} );
			
			spyOn( eventHandler, "shouldRenderForEvent" ).and.returnValue( true );
			
			eventHandler.clearRegistered3dObjects();
			
			eventHandler.handleEvent( event );
			
			expect( event.stopPropagation ).not.toHaveBeenCalled();
			expect( event.preventDefault ).not.toHaveBeenCalled();
			
			expect( visualization.render ).not.toHaveBeenCalled();
			expect( animationManager.cancelFrame ).not.toHaveBeenCalled();
		} );
		
		it( "does not invoke render", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			eventHandler.addEventListener( { id: 1 }, () => {} );
			
			spyOn( eventHandler, "shouldRenderForEvent" ).and.returnValue( false );
			
			eventHandler.handleEvent( event );
			
			expect( event.stopPropagation ).toHaveBeenCalled();
			expect( event.preventDefault ).toHaveBeenCalled();
			
			expect( visualization.render ).not.toHaveBeenCalled();
			expect( animationManager.cancelFrame ).not.toHaveBeenCalled();
		} );
		
		it( "invokes render and stops bubbling", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			eventHandler.addEventListener( { id: 1 }, () => {} );
			
			spyOn( eventHandler, "shouldRenderForEvent" ).and.returnValue( true );
			
			eventHandler.handleEvent( event );
			
			expect( event.stopPropagation ).toHaveBeenCalled();
			expect( event.preventDefault ).toHaveBeenCalled();
			
			expect( visualization.render ).toHaveBeenCalled();
			expect( animationManager.cancelFrame ).toHaveBeenCalled();
		} );
	} );
	
	describe( "getMouseCoordinates", () => {
		it( "returns a scaled vector according to canvas size", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			visualization.renderer.domElement.clientWidth = 100;
			visualization.renderer.domElement.clientHeight = 200;
			
			const event = { offsetX: 50, offsetY: 150 };
			
			const coordinates = eventHandler.getMouseCoordinates( event );
			
			expect( coordinates ).toEqual( jasmine.any( THREE.Vector2 ) );
			expect( coordinates.x ).toBe( 0.0 );
			expect( coordinates.y ).toBe( -0.5 );
		} );
		
		it( "returns another scaled vector according to canvas size", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			visualization.renderer.domElement.clientWidth = 80;
			visualization.renderer.domElement.clientHeight = 20;
			
			const event = { offsetX: 30, offsetY: 5 };
			
			const coordinates = eventHandler.getMouseCoordinates( event );
			
			expect( coordinates ).toEqual( jasmine.any( THREE.Vector2 ) );
			expect( coordinates.x ).toBe( -0.25 );
			expect( coordinates.y ).toBe( 0.5 );
		} );
	} );
	
	describe( "getObjectAtCoordinates", () => {
		let raycaster;
		
		beforeEach( () => {
			raycaster = jasmine.createSpyObj( "THREE.Raycaster", [ "setFromCamera", "intersectObjects" ] );
			raycaster.intersectObjects.and.returnValue( [] );
			spyOn( THREE, "Raycaster" ).and.returnValue( raycaster );
		} );
		
		it( "returns undefined when no objects are intersected", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			const coordinates = new THREE.Vector2( 10, 20 );
			
			const object = eventHandler.getObjectAtCoordinates( coordinates );
		
			expect( raycaster.setFromCamera ).toHaveBeenCalledWith( coordinates, visualization.camera );
			expect( object ).toBe( undefined );
		} );
		
		it( "returns the only intersected object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			const coordinates = new THREE.Vector2( 20, 30 );
			
			const intersections = [ { object: {} } ];
			
			raycaster.intersectObjects.and.returnValue( Array.from( intersections ) );
			
			const object = eventHandler.getObjectAtCoordinates( coordinates );
		
			expect( raycaster.setFromCamera ).toHaveBeenCalledWith( coordinates, visualization.camera );
			expect( object ).toBe( intersections[ 0 ].object );
		} );
		
		it( "returns the closest intersected object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			const coordinates = new THREE.Vector2( 40, 50 );
			
			const intersections = [
				{ distance: 1, object: { id: 0 } },
				{ distance: 0, object: { id: 1 } }
			];
			
			raycaster.intersectObjects.and.returnValue( Array.from( intersections ) );
			
			const object = eventHandler.getObjectAtCoordinates( coordinates );
		
			expect( raycaster.setFromCamera ).toHaveBeenCalledWith( coordinates, visualization.camera );
			expect( object ).toBe( intersections[ 1 ].object );
		} );
		
		it( "returns the closest intersected object with the highest id", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			const coordinates = new THREE.Vector2( 10, 20 );
			
			const intersections = [
				{ distance: 0, object: { id: 1 } },
				{ distance: 0, object: { id: 3 } },
				{ distance: 0, object: { id: 2 } },
				{ distance: 1, object: { id: 0 } }
			];
			
			raycaster.intersectObjects.and.returnValue( Array.from( intersections ) );
			
			const object = eventHandler.getObjectAtCoordinates( coordinates );
		
			expect( raycaster.setFromCamera ).toHaveBeenCalledWith( coordinates, visualization.camera );
			expect( object ).toBe( intersections[ 1 ].object );
		} );
		
		it( "returns the closest intersected object with the highest id ignoring double precision", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			const coordinates = new THREE.Vector2( 10, 20 );
			
			const intersections = [
				{ distance: 587.4630803353414, object: { id: 1 } },
				{ distance: 587.4630803353416, object: { id: 3 } },
				{ distance: 587.4630803353419, object: { id: 2 } },
				{ distance: 587.4630803353423, object: { id: 4 } },
				{ distance: 587.4630803353433, object: { id: 5 } },
				{ distance: 1, object: { id: 0 } }
			];
			
			raycaster.intersectObjects.and.returnValue( Array.from( intersections ) );
			
			const object = eventHandler.getObjectAtCoordinates( coordinates );
		
			expect( raycaster.setFromCamera ).toHaveBeenCalledWith( coordinates, visualization.camera );
			expect( object ).toBe( intersections[ 4 ].object );
		} );
	} );
	
	describe( "invokeCallback", () => {
		it( "should send mousedown signal to registered callback", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			const callback = jasmine.createSpy( "block event callback" );
			
			eventHandler.addEventListener( { id: 1 }, callback );
			
			eventHandler.invokeCallback( "mousedown", object, 1 );
			
			expect( callback ).toHaveBeenCalledWith( "mousedown", 1 );
		} );
		
		it( "should send mouseover signal to registered callback", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			const callback = jasmine.createSpy( "block event callback" );
			
			eventHandler.addEventListener( { id: 1 }, callback );
			
			eventHandler.invokeCallback( "mouseover", object, 0 );
			
			expect( callback ).toHaveBeenCalledWith( "mouseover", 0 );
		} );
	} );
	
	describe( "shouldRenderForEvent", () => {
		it( "should not render mousedown on nothing", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( undefined );
			
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousedown" } );
			
			expect( shouldRender ).toBe( false );
			expect( invokeCallbackSpy ).not.toHaveBeenCalled();
		} );
		
		it( "should render mousedown on object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( object );
			
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousedown" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mousedown", object, 1 );
		} );
		
		it( "should not render mouseup on nothing", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( undefined );
			
			eventHandler.shouldRenderForEvent( { type: "mousedown" } );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mouseup" } );
			
			expect( shouldRender ).toBe( false );
			expect( invokeCallbackSpy ).not.toHaveBeenCalled();
		} );
		
		it( "should render mouseup on object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( object );
			
			eventHandler.shouldRenderForEvent( { type: "mousedown" } );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mouseup" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mousedown", object, 0 );
		} );
		
		it( "should render mouseup on clicked object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const mousedownObject = { id: 1 };
			const mouseupObject = { id: 2 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			const getObjectSpy = spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( mousedownObject );
			
			eventHandler.shouldRenderForEvent( { type: "mousedown" } );
			
			getObjectSpy.and.returnValue( mouseupObject );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mouseup" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy.calls.count() ).toBe( 2 );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mousedown", mousedownObject, 0 );
		} );
		
		it( "should not render mouseover on nothing", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( undefined );
			
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			expect( shouldRender ).toBe( false );
			expect( invokeCallbackSpy ).not.toHaveBeenCalled();
		} );
		
		it( "should render mouseover on object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( object );
			
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mouseover", object, 1 );
		} );
		
		it( "should not render mouseover on same object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( object );
			
			eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			expect( shouldRender ).toBe( false );
			expect( invokeCallbackSpy.calls.count() ).toBe( 1 );
		} );
		
		it( "should render mouseover off object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const object = { id: 1 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			const getObjectSpy = spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( object );
			
			eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			getObjectSpy.and.returnValue( undefined );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mouseover", object, 0 );
		} );
		
		it( "should render mouseover on new object", () => {
			const eventHandler = new EventHandler( visualization, animationManager );
			
			const objectOne = { id: 1 };
			const objectTwo = { id: 2 };
			
			const invokeCallbackSpy = spyOn( eventHandler, "invokeCallback" );
			const getObjectSpy = spyOn( eventHandler, "getObjectAtCoordinates" ).and.returnValue( objectOne );
			
			eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			getObjectSpy.and.returnValue( objectTwo );
			const shouldRender = eventHandler.shouldRenderForEvent( { type: "mousemove" } );
			
			expect( shouldRender ).toBe( true );
			expect( invokeCallbackSpy ).toHaveBeenCalledWith( "mouseover", objectTwo, 1 );
		} );
	} );
} );