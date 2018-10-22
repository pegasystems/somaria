const { customMatchers } = require( "./TestUtils" );
const Visualization = require( "../build/Visualization.js" ).default;
const Mock = require( "./Mock.js" );

describe( "Visualization Integration Test", () => {
	let WebGLRenderer;
	let element;
	let renderMethod;
	
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
		global.document = {};
		global.window = {
			devicePixelRatio: 1
		};
		renderMethod = jasmine.createSpy( "WebGLRenderer.render" );
		WebGLRenderer = spyOn( THREE, "WebGLRenderer" ).and.returnValue( {
			setPixelRatio: jasmine.createSpy( "WebGLRenderer.setPixelRatio" ),
			setSize: jasmine.createSpy( "WebGLRenderer.setSize" ),
			render: renderMethod,
			domElement: jasmine.createSpyObj( "domElement", [ "addEventListener" ] ),
			clear: jasmine.createSpy( "WebGLRenderer.clear" ),
			dispose: jasmine.createSpy( "WebGLRenderer.dispose" )
		} );
		element = jasmine.createSpyObj( "element", [ "appendChild" ] );
	} );
	
	afterAll( () => {
		global.document = undefined;
		global.window = undefined;
	} );

	it( "renders one drawable", () => {
		global.document.body = element;
		let visualization = new Visualization( null, {
			blocks: [ Mock.Rect1 ],
			drawables: [ Mock.Rect1.id ]
		} );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 10, 20 );
	} );

	it( "does not render disabled drawables", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.Rect3 ],
			drawables: [ Mock.Rect3.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 0 );
	} );
	
	it( "resolves input from other block", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.Rect2, Mock.Arithmetic1 ],
			drawables: [ Mock.Rect2.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 30, 40 );
	} );

	it( "renders multiple visualizations", () => {
		let visualization1 = new Visualization( null, {
			blocks: [ Mock.Rect1 ],
			drawables: [ Mock.Rect1.id ]
		}, element );
		visualization1.render();
		expect( visualization1.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization1.scene.children[ 0 ], 10, 20 );
		
		let visualization2 = new Visualization( null, {
			blocks: [ Mock.Rect2, Mock.Arithmetic1 ],
			drawables: [ Mock.Rect2.id ]
		}, element );
		visualization2.render();
		expect( visualization2.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization2.scene.children[ 0 ], 30, 40 );
	} );

	it( "resolves published inputs and outputs on macro block", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.Rect4, Mock.AreaAndCircumference, Mock.Number10 ],
			drawables: [ Mock.Rect4.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], Math.PI * Math.pow( 10, 2 ), 2 * Math.PI * 10 );
	} );

	it( "macro block initializes broadcast ", () => {
		let testPubSub = {
			publish( name, message ) {
				// do nothing
			}
		};
		Visualization.setPubSub( testPubSub );
		spyOn( testPubSub, "publish" );
		let visualization = new Visualization( null, {
			blocks: [ Mock.Macro1, Mock.Rect1 ],
			drawables: [ Mock.Rect1.id ],
			leafs: [ Mock.Macro1.id ]
		}, element );
		visualization.render();
		expect( testPubSub.publish.calls.count() ).toBe( 1 );
		expect( testPubSub.publish ).toHaveBeenCalledWith( "TestEvent", { test: "pass" } );
	} );

	it( "visualization initializes broadcast ", () => {
		let testPubSub = {
			publish( name, message ) {
				// do nothing
			}
		};
		Visualization.setPubSub( testPubSub );
		spyOn( testPubSub, "publish" );
		let visualization = new Visualization( null, {
			blocks: [ Mock.EventBroadcast1 ],
			leafs: [ Mock.EventBroadcast1.id ]
		}, element );
		visualization.render();
		expect( testPubSub.publish.calls.count() ).toBe( 1 );
		expect( testPubSub.publish ).toHaveBeenCalledWith( "TestEvent", { test: "pass" } );
	} );

	it( "resolves double-published inputs and outputs on macro block", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.Rect5, Mock.NestedCircumference, Mock.Number10 ],
			drawables: [ Mock.Rect5.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 10, 2 * Math.PI * 10 );
	} );
	
	it( "renders two drawables", () => {
		let visualization = new Visualization( null, {
			blocks: [
				Mock.Arithmetic1,
				Mock.Rect2,
				Mock.Rect1
			],
			drawables: [
				Mock.Rect1.id,
				Mock.Rect2.id
			]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 2 );
		assertRectangleSize( visualization.scene.children[ 0 ], 10, 20 );
		assertRectangleSize( visualization.scene.children[ 1 ], 30, 40 );
	} );
	
	it( "renders all drawables at the root level and inside a drawable macro block", () => {
		let visualization = new Visualization( null, {
			blocks: [
				Mock.Arithmetic1,
				Mock.Rect1,
				Mock.Rect2,
				Mock.MacroDrawable
			],
			drawables: [
				Mock.Rect2.id,
				Mock.MacroDrawable.id,
				Mock.Rect1.id
			]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 4 );
		assertRectangleSize( visualization.scene.children[ 0 ], 30, 40 );
		assertRectangleSize( visualization.scene.children[ 1 ], 30, 50 );
		assertRectangleSize( visualization.scene.children[ 2 ], 70, 60 );
		assertRectangleSize( visualization.scene.children[ 3 ], 10, 20 );
	} );
	
	it( "renders all drawables at the root level and repeats inside a drawable iterator block", () => {
		let visualization = new Visualization( null, {
			blocks: [
				Mock.Arithmetic1,
				Mock.Rect1,
				Mock.Rect2,
				Mock.IteratorDrawable
			],
			drawables: [
				Mock.Rect2.id,
				Mock.IteratorDrawable.id,
				Mock.Rect1.id
			]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 32 );
		assertRectangleSize( visualization.scene.children[ 0 ], 30, 40 );
		for( let i = 0; i < 10; i++ ) {
			let arithmetic1 = i * 30;
			let index = 1 + i * 3;
			assertRectangleSize( visualization.scene.children[ index ], 30, arithmetic1 );
			assertRectangleSize( visualization.scene.children[ index + 1 ], arithmetic1, 60 );
			assertRectangleSize( visualization.scene.children[ index + 2 ], i, 10 );
		}
		assertRectangleSize( visualization.scene.children[ 31 ], 10, 20 );
	} );

	it( "drawable iterator block does not throw error if count is negative", () => {
		let visualization = new Visualization( null, {
			blocks: [
				Mock.IteratorDrawable_1
			],
			drawables: [
				Mock.IteratorDrawable_1.id
			]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 0 );
	} );

	it( "resolves external inputs on visualization", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.ExternalInput, Mock.Rect6 ],
			drawables: [ Mock.Rect6.id ]
		}, element );
		visualization.setInputValue( "Width", 25 );
		visualization.setInputValue( "Height", 35 );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 25, 35 );
	} );

	it( "sets Loading manager and calls the onload", () => {
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Image1, Mock.Rect12 ],
			drawables: [ Mock.Rect12.id ]
		}, element );
		let loadHandler;
		let imageSpy = {
			addEventListener: jasmine.createSpy( "addEventListener" ).and.callFake( ( type, handler ) => {
				if( type === "load" ) {
					loadHandler = handler;
				}
			} ),
			removeEventListener: jasmine.createSpy( "removeEventListener" )
		};
		global.document.createElementNS = jasmine.createSpy( "createElementNS" ).and.returnValue( imageSpy );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		loadHandler();
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
	} );
	
	it( "interactions mousedown", () => {
		let objects = createRaycasterSpy();
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Number1, Mock.Number2, Mock.BinarySwitch1, Mock.Interaction1, Mock.Rect7 ],
			drawables: [ Mock.Rect7.id ]
		}, element );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 20, 20 );
		let eventHandler = visualization.eventHandler;
		expect( eventHandler ).toBeDefined();

		let mouseEvent = jasmine.createSpyObj( "MouseEvent", [ "preventDefault", "stopPropagation" ] );
		mouseEvent.target = visualization.renderer.domElement;
		mouseEvent.type = "mousedown";
		objects.push( { object: visualization.scene.children[ 0 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		assertRectangleSize( visualization.scene.children[ 0 ], 40, 40 );

		mouseEvent.type = "mouseup";
		spyOn( visualization.animationManager, "cancelFrame" ).and.callThrough();
		eventHandler.handleEvent( mouseEvent );
		expect( visualization.animationManager.cancelFrame ).toHaveBeenCalled();
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
		assertRectangleSize( visualization.scene.children[ 0 ], 20, 20 );
	} );

	it( "interactions mouseover", () => {
		let objects = createRaycasterSpy();
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Number1, Mock.Number2, Mock.BinarySwitch2, Mock.Interaction1, Mock.Rect8 ],
			drawables: [ Mock.Rect8.id ]
		}, element );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 20, 20 );
		let eventHandler = visualization.eventHandler;
		expect( eventHandler ).toBeDefined();

		let mouseEvent = jasmine.createSpyObj( "MouseEvent", [ "preventDefault", "stopPropagation" ] );
		mouseEvent.target = visualization.renderer.domElement;
		mouseEvent.type = "mousemove";
		objects.push( { object: visualization.scene.children[ 0 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		assertRectangleSize( visualization.scene.children[ 0 ], 40, 40 );

		objects.pop();
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
		assertRectangleSize( visualization.scene.children[ 0 ], 20, 20 );
	} );

	it( "interactions mouseover two objects", () => {
		let objects = createRaycasterSpy();
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Number1, Mock.Number2, Mock.BinarySwitch3, Mock.BinarySwitch2, Mock.Interaction1, Mock.Interaction2, Mock.Rect8, Mock.Rect9 ],
			drawables: [ Mock.Rect9.id, Mock.Rect8.id ]
		}, element );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		expect( visualization.scene.children.length ).toBe( 2 );
		assertRectangleSize( visualization.scene.children[ 0 ], 20, 20 );
		assertRectangleSize( visualization.scene.children[ 1 ], 20, 20 );
		let eventHandler = visualization.eventHandler;
		expect( eventHandler ).toBeDefined();

		let mouseEvent = jasmine.createSpyObj( "MouseEvent", [ "preventDefault", "stopPropagation" ] );
		mouseEvent.target = visualization.renderer.domElement;
		mouseEvent.type = "mousemove";
		objects.push( { object: visualization.scene.children[ 1 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		assertRectangleSize( visualization.scene.children[ 1 ], 40, 40 );

		objects.pop();
		objects.push( { object: visualization.scene.children[ 0 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
		assertRectangleSize( visualization.scene.children[ 0 ], 40, 40 );
		assertRectangleSize( visualization.scene.children[ 1 ], 20, 20 );
	} );

	it( "interactions mousedown in an iterator", () => {
		let objects = createRaycasterSpy();
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Image1, Mock.Rect12, Mock.IteratorDrawable1 ],
			drawables: [ Mock.IteratorDrawable1.id, Mock.Rect12.id ]
		}, element );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		expect( visualization.scene.children.length ).toBe( 11 );
		for( let i = 0; i < 10; i++ ) {
			let arithmetic = i * 25;
			assertRectangleSize( visualization.scene.children[ i ], arithmetic, 60 );
		}
		let eventHandler = visualization.eventHandler;
		expect( eventHandler ).toBeDefined();

		let mouseEvent = jasmine.createSpyObj( "MouseEvent", [ "preventDefault", "stopPropagation" ] );
		mouseEvent.target = visualization.renderer.domElement;
		mouseEvent.type = "mousedown";
		objects.push( { object: visualization.scene.children[ 5 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		for( let i = 0; i < 10; i++ ) {
			let arithmetic = i * 25;
			let value = 60;
			if( i === 5 ) {
				value = 100;
			}
			assertRectangleSize( visualization.scene.children[ i ], arithmetic, value );
		}
		mouseEvent.type = "mouseup";
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
		for( let i = 0; i < 10; i++ ) {
			let arithmetic = i * 25;
			assertRectangleSize( visualization.scene.children[ i ], arithmetic, 60 );
		}
	} );
	it( "interactions mousedown changes iteration count", () => {
		let objects = createRaycasterSpy();
		let renderCount = renderMethod.calls.count();
		let visualization = new Visualization( null, {
			blocks: [ Mock.Interaction1, Mock.BinarySwitch4, Mock.Rect10, Mock.IteratorDrawable2 ],
			drawables: [ Mock.Rect10.id, Mock.IteratorDrawable2.id ]
		}, element );
		visualization.render();
		expect( renderMethod.calls.count() ).toBe( renderCount + 1 );
		expect( visualization.scene.children.length ).toBe( 21 );
		assertRectangleSize( visualization.scene.children[ 0 ], 100, 100 );
		for( let i = 1; i < 21; i += 2 ) {
			assertRectangleSize( visualization.scene.children[ i ], 70, 60 );
		}
		let eventHandler = visualization.eventHandler;
		expect( eventHandler ).toBeDefined();

		let mouseEvent = jasmine.createSpyObj( "MouseEvent", [ "preventDefault", "stopPropagation" ] );
		mouseEvent.target = visualization.renderer.domElement;
		mouseEvent.type = "mousedown";
		objects.push( { object: visualization.scene.children[ 0 ] } );
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 2 );
		expect( visualization.scene.children.length ).toBe( 11 );
		assertRectangleSize( visualization.scene.children[ 0 ], 100, 100 );
		for( let i = 1; i < 11; i += 2 ) {
			assertRectangleSize( visualization.scene.children[ i ], 70, 60 );
		}
		mouseEvent.type = "mouseup";
		eventHandler.handleEvent( mouseEvent );
		expect( renderMethod.calls.count() ).toBe( renderCount + 3 );
		expect( visualization.scene.children.length ).toBe( 21 );
		assertRectangleSize( visualization.scene.children[ 0 ], 100, 100 );
		for( let i = 1; i < 21; i += 2 ) {
			assertRectangleSize( visualization.scene.children[ i ], 70, 60 );
		}
	} );
	it( "non-drawable iterator test", () => {
		let testPubSub = {
			publish( name, message ) {
				// do nothing
			}
		};
		Visualization.setPubSub( testPubSub );
		spyOn( testPubSub, "publish" );
		let visualization = new Visualization( null, {
			blocks: [ Mock.Number10, Mock.Iterator1, Mock.Rect11 ],
			drawables: [ Mock.Rect11.id ],
			leafs: [ Mock.Iterator1.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 180, 90 );
		expect( testPubSub.publish.calls.count() ).toBe( 10 );
		expect( testPubSub.publish ).toHaveBeenCalledWith( "TestEvent", { test: "pass" } );
	} );
	it( "0 count non-drawable iterator test", () => {
		let visualization = new Visualization( null, {
			blocks: [ Mock.Number10, Mock.Iterator2, Mock.Rect11 ],
			drawables: [ Mock.Rect11.id ],
			leafs: [ Mock.Iterator1.id ]
		}, element );
		visualization.render();
		expect( visualization.scene.children.length ).toBe( 1 );
		assertRectangleSize( visualization.scene.children[ 0 ], 100, 100 );
	} );
} );

function createRaycasterSpy() {
	let objects = [];
	spyOn( THREE, "Raycaster" ).and.returnValue( {
		setFromCamera: jasmine.createSpy( "Raycaster.setFromCamera" ),
		intersectObjects: jasmine.createSpy( "Raycaster.intersectObjects" ).and.returnValue( objects )
	} );
	return objects;
}
function assertRectangleSize( rectangle, width, height ) {
	expect( rectangle.scale ).toEqualStruct( new THREE.Vector3( width, height, 1 ) );
}