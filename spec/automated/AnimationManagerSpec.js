const { AnimationManager } = require( "../build/core/AnimationManager.js" );

describe( "AnimationManager", () => {
	const renderCallback = jasmine.createSpy( "renderCallback" );
	
	let requestId;
	let animationCallback;
	
	beforeEach( () => {
		requestId = -1;
		global.window = {
			requestAnimationFrame: function( callback ) {
				animationCallback = callback;
				return ++requestId;
			},
			cancelAnimationFrame: function() {
				return;
			}
		};
		
		renderCallback.calls.reset();
		
		spyOn( window, "requestAnimationFrame" ).and.callThrough();
		spyOn( window, "cancelAnimationFrame" );
	} );
	
	afterEach( () => {
		global.window = undefined;
	} );
	
	it( "requests a frame", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		expect( window.requestAnimationFrame ).toHaveBeenCalled();
		expect( renderCallback ).not.toHaveBeenCalled();
	} );
	
	it( "calls render callback on frame", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		animationCallback();
		expect( renderCallback.calls.count() ).toBe( 1 );
	} );
	
	it( "only requests one frame at a time", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		animationManager.requestFrame();
		animationManager.requestFrame();
		animationManager.requestFrame();
		expect( window.requestAnimationFrame.calls.count() ).toBe( 1 );
		animationCallback();
		expect( renderCallback.calls.count() ).toBe( 1 );
	} );
	
	it( "requests a frame after a frame has already been completed", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		animationCallback();
		animationManager.requestFrame();
		animationCallback();
		animationManager.requestFrame();
		animationCallback();
		expect( renderCallback.calls.count() ).toBe( 3 );
	} );
	
	it( "cancels a frame", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		animationManager.cancelFrame();
		expect( window.cancelAnimationFrame ).toHaveBeenCalledWith( requestId );
	} );
	
	it( "cancels a frame which is not the first", () => {
		const animationManager = new AnimationManager( renderCallback );
		animationManager.requestFrame();
		animationCallback();
		animationManager.requestFrame();
		animationManager.cancelFrame();
		expect( window.cancelAnimationFrame ).toHaveBeenCalledWith( requestId );
	} );
} );