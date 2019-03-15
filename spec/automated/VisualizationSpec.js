require( "./TestUtils" );
const THREE = require( "three" );
const Visualization = require( "../build/Visualization.js" ).default;
const { Color } = require( "../build/core/structs/Color" );
const { Theme } = require( "../build/core/Theme" );
const defaultThemeJSON = require( "../build/core/themes/somaria-default-theme" );

function makeCanvas( width, height ) {
	return {
		appendChild: jasmine.createSpy( "element.appendChild" ),
		offsetWidth: width,
		offsetHeight: height,
		addEventListener: jasmine.createSpy( "element.addEventListener" )
	};
}

describe( "Visualization", () => {
	let WebGLRenderer;
	let rendererOptions;
	let eventsManager;
	
	beforeAll( () => {
		global.window = {
			requestAnimationFrame: function( callback ) {
				callback();
				return 0;
			}
		};
		WebGLRenderer = spyOn( THREE, "WebGLRenderer" ).and.callFake( function( options ) {
			rendererOptions = options;
			return {
				setPixelRatio: jasmine.createSpy( "WebGLRenderer.setPixelRatio" ),
				setSize: jasmine.createSpy( "WebGLRenderer.setSize" ),
				render: jasmine.createSpy( "WebGLRenderer.render" ),
				domElement: options.canvas,
				clear: jasmine.createSpy( "WebGLRenderer.clear" ),
				dispose: jasmine.createSpy( "WebGLRenderer.dispose" )
			};
		} );
	} );

	beforeEach( () => {
		Visualization.registerTheme( "default", defaultThemeJSON );
	} );

	afterAll( () => {
		global.window = undefined;
	} );

	afterEach( () => {
		Theme.registeredThemes.clear();
	} );

	it( "disposes all events", () => {
		let element = makeCanvas( 500, 500 );
		let visualization = new Visualization( undefined, null, element );
		let eventsManager = jasmine.createSpyObj( "EventsManager", [ "unsubscribeAll" ] );
		spyOn( visualization.renderingContext, "getEventsManager" ).and.returnValue( eventsManager );
		visualization.dispose();
		expect( eventsManager.unsubscribeAll ).toHaveBeenCalled();
	} );

	it( "defines config", () => {
		let element = makeCanvas( 500, 500 );
		let visualization = new Visualization( undefined, null, element );
		expect( visualization.config ).toBeDefined();
	} );

	it( "block type exposed", () => {
		expect( Visualization.BlockTypes ).toBeDefined();
		expect( Visualization.BlockTypes.get( "Rectangle" ) ).toBeDefined();
	} );

	it( "initializes scene and camera", () => {
		let element = makeCanvas( 200, 100 );
		let visualization = new Visualization( {
			width: 200,
			height: 100,
			fov: 50
		}, null, element );
		visualization.render();
		let scene = visualization.scene;
		expect( scene ).toBeDefined();
		expect( scene.background.getHex() ).toBe( visualization.config.backgroundColor );

		let camera = visualization.camera;
		expect( camera ).toBeDefined();
		expect( camera.aspect ).toBe( 2 );
		expect( camera.fov ).toBe( 50 );
		expect( camera.near ).toBe( 1 );
		expect( camera.far ).toBe( Number.MAX_SAFE_INTEGER );
		expect( camera.position.x ).toBe( 0 );
		expect( camera.position.y ).toBe( 0 );
		expect( camera.position.z ).toBeCloseTo( 107.23, 2 );
		expect( camera.getWorldDirection( new THREE.Vector3() ).normalize() ).toEqual( new THREE.Vector3().set( -0, -0, -1 ) );
	} );
	
	it( "places the scene according to the configured origin", () => {
		let element = makeCanvas( 500, 500 );
		let visualization = new Visualization( {
			origin: {
				x: -250,
				y: -251,
				z: -252
			}
		}, null, element );
		visualization.render();

		let scene = visualization.scene;
		expect( scene.position.x ).toBe( -250 );
		expect( scene.position.y ).toBe( -251 );
		expect( scene.position.z ).toBe( -252 );

		let camera = visualization.camera;
		expect( camera ).toBeDefined();
		expect( camera.aspect ).toBe( 1 );
		expect( camera.fov ).toBe( 50 );
		expect( camera.near ).toBe( 1 );
		expect( camera.far ).toBe( Number.MAX_SAFE_INTEGER );
		expect( camera.position.x ).toBe( 0 );
		expect( camera.position.y ).toBe( 0 );
		expect( camera.position.z ).toBeCloseTo( 536.13, 2 );
		expect( camera.getWorldDirection( new THREE.Vector3() ).normalize() ).toEqual( new THREE.Vector3().set( -0, -0, -1 ) );
		
		let renderer = visualization.renderer;
		expect( renderer.setSize ).toHaveBeenCalledWith( 500, 500, false );
	} );
	
	it( "creates a renderer and calls render()", () => {
		global.window.devicePixelRatio = 2;
		
		let element = makeCanvas( 200, 100 );
		let visualization = new Visualization( {
			width: 200,
			height: 100
		}, null, element );
		visualization.render();

		let renderer = visualization.renderer;

		expect( WebGLRenderer ).toHaveBeenCalledWith( {
			antialias: true,
			canvas: element
		} );
		expect( renderer.toneMapping ).toBe( THREE.NoToneMapping );
		expect( renderer.maxMorphTargets ).toBe( 0 );
		expect( renderer.maxMorphNormals ).toBe( 0 );
		expect( renderer.autoClear ).toBe( false );
		expect( renderer.setPixelRatio ).toHaveBeenCalledWith( 2 );
		expect( renderer.setSize ).toHaveBeenCalledWith( 200, 100, false );
		expect( renderer.render ).toHaveBeenCalledWith( visualization.scene, visualization.camera );
		expect( rendererOptions.antialias ).toBe( true );
		
		global.window.devicePixelRatio = undefined;
	} );
	
	it( "creates a renderer with different options and calls render()", () => {
		let element = makeCanvas( 400, 500 );
		let visualization = new Visualization( {
			width: 400,
			height: 500,
			antialias: false
		}, null, element );
		visualization.render();
		
		let renderer = visualization.renderer;
		
		expect( WebGLRenderer ).toHaveBeenCalledWith( {
			antialias: false,
			canvas: element
		} );
		expect( renderer.toneMapping ).toBe( THREE.NoToneMapping );
		expect( renderer.maxMorphTargets ).toBe( 0 );
		expect( renderer.maxMorphNormals ).toBe( 0 );
		expect( renderer.autoClear ).toBe( false );
		expect( renderer.setPixelRatio ).toHaveBeenCalledWith( 1 );
		expect( renderer.setSize ).toHaveBeenCalledWith( 400, 500, false );
		expect( renderer.render ).toHaveBeenCalledWith( visualization.scene, visualization.camera );
	} );
	
	it( "resizes", () => {
		global.window.devicePixelRatio = 2;
		
		let element = makeCanvas( 200, 100 );
		let visualization = new Visualization( {
			width: 200,
			height: 100
		}, null, element );
		visualization.render();
	
		let renderer = visualization.renderer;
	
		expect( WebGLRenderer ).toHaveBeenCalledWith( {
			antialias: true,
			canvas: element
		} );
		expect( renderer.setPixelRatio ).toHaveBeenCalledWith( 2 );
		expect( renderer.setSize ).toHaveBeenCalledWith( 200, 100, false );
		expect( visualization.scalingManager.getPixelWorldRatio() ).toBe( 1 );
		
		global.window.devicePixelRatio = 1;
		element.offsetWidth = 800;
		element.offsetHeight = 400;
		visualization.resize();
		
		expect( renderer.setPixelRatio ).toHaveBeenCalledWith( 1 );
		expect( renderer.setSize ).toHaveBeenCalledWith( 800, 400, false );
		expect( visualization.scalingManager.getPixelWorldRatio() ).toBe( 4 );
		
		global.window.devicePixelRatio = undefined;
	} );

	const customTheme1 = {
		ColorPalette: [
			0xFFFFFF,
			0x000000,
			0xFFFABC
		],
		FontFamily: "Helvetica"
	};
	const customTheme2 = {
		ColorPalette: [
			0xFFCC02,
			0xAABBCC
		],
		FontFamily: "Comic Sans"
	};

	it( "register a custom theme", () => {
		Visualization.registerTheme( "TestTheme", customTheme1 );
		expect( Theme.registeredThemes.size ).toBe( 2 );
	} );

	it( "registers more than one theme", () => {
		Visualization.registerTheme( "TestTheme1", customTheme1 );
		Visualization.registerTheme( "TestTheme2", customTheme2 );
		expect( Theme.registeredThemes.size ).toBe( 3 );
	} );
} );
