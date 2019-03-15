const { makeBlock, customMatchers, Color } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );
const TextBlock = BlockTypes.get( "Text" );

const contextSpy = {
	measureText: jasmine.createSpy( "measureText" ).and.callFake( ( text ) => {
		return { width: text.length * window.devicePixelRatio * scalingManager.getPixelWorldRatio() };
	} ),
	fillText: jasmine.createSpy( "fillText" )
};
const canvasSpy = {
	getContext: jasmine.createSpy( "getContext" ).and.returnValue( contextSpy )
};
let scalingManager;
let config;
let renderingContext;

function verify( text, fontName, fontSize, color, expectedWidth, expectedHeight, maxWidth, wrap, expectedText ) {
	const block = makeBlock( TextBlock, [ text, fontName, fontSize, color, maxWidth, wrap ], [], renderingContext );
	block.setScalingManager( scalingManager );
	text = String( text );
	expect( block.getOutputValue( 1 ) ).toEqual( expectedWidth );
	expect( block.getOutputValue( 2 ) ).toEqual( expectedHeight );
	
	const pixelWorldRatio = window.devicePixelRatio * scalingManager.getPixelWorldRatio();
	
	const texture = block.getOutputValue( 0 );
	expect( texture ).toBeAny( THREE.CanvasTexture );
	expect( texture.image ).toBe( canvasSpy );
	expect( canvasSpy.width ).toBe( expectedWidth * pixelWorldRatio );
	expect( canvasSpy.height ).toBe( expectedHeight * pixelWorldRatio );
	if( wrap ) {
		expect( contextSpy.fillText.calls.count() ).toBe( expectedText.length );
		for( let i = 0; i < expectedText.length ; i++ ) {
			expect( contextSpy.fillText ).toHaveBeenCalledWith( expectedText[i], 0, ( fontSize * 1.25 * pixelWorldRatio ) * ( i + 0.5 ) );
		}
	}
	else {
		expect( contextSpy.fillText.calls.count() ).toBe( 1 );
		if( maxWidth && text.length > maxWidth ) {
			let truncatedText = text.substring( 0, maxWidth - 3 ) + "...";
			expect( contextSpy.fillText ).toHaveBeenCalledWith( truncatedText, 0, ( fontSize * 1.25 * pixelWorldRatio ) / 2 );
		}
		else {
			expect( contextSpy.fillText ).toHaveBeenCalledWith( text, 0, ( fontSize * 1.25 * pixelWorldRatio ) / 2 );
		}
	}

	expect( contextSpy.font ).toBe( ( fontSize * pixelWorldRatio ) + "px " + fontName );
	expect( contextSpy.fillStyle ).toBe( "#" + color.getHexString() );
}

describe( "TextBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
		global.document = {
			createElement: jasmine.createSpy( "createElement" ).and.returnValue( canvasSpy )
		};
		global.window = {
			devicePixelRatio: 1
		};
	} );
	
	beforeEach( () => {
		contextSpy.fillText.calls.reset();
		global.window.devicePixelRatio = 1;
		scalingManager = {
			pixelWorldRatio: 1,
			getPixelWorldRatio: function() {
				return this.pixelWorldRatio;
			}
		};
		config = {
			theme: "default",
			fontSize: 18,
			meshColor: 0x112233
		};
		renderingContext = new RenderingContext( {}, config, {}, {}, {}, { pixelWorldRatio: 1, getPixelWorldRatio: () => this.pixelWorldRatio }, {} );
	} );

	afterAll( () => {
		global.window = undefined;
		global.document = undefined;
	} );

	it( "builds a Text block from JSON", () => {
		const block = TextBlock.fromData( TextBlock, {
			id: "Text 1",
			type: "Text",
			inputs: []
		}, renderingContext );
		expect( block.scalingManager ).toBe( renderingContext.scalingManager );
	} );

	it( "is defined as a block type", () => {
		expect( TextBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( TextBlock.getDefaultInputValues( config, renderingContext ) ).toEqual( [
			"",
			"Helvetica",
			config.fontSize,
			Color( config.meshColor, 1 ),
			0,
			false
		] );
	} );

	it( "outputs proper width and height", () => {
		verify( "test", "Comic Sans", 16, Color( 0xaabbcc, 1 ), 4, 20 );
	} );
	
	it( "outputs proper width and height with different DPI", () => {
		window.devicePixelRatio = 2;
		verify( "test", "Comic Sans", 16, Color( 0x554433, 1 ), 4, 20 );
	} );
	
	it( "outputs proper width and height when scaled up", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( "test", "Comic Sans", 16, Color( 0x554433, 1 ), 4, 20 );
	} );
	
	it( "outputs proper width and height when scaled down", () => {
		scalingManager.pixelWorldRatio = 0.5;
		verify( "test", "Comic Sans", 16, Color( 0x554433, 1 ), 4, 20 );
	} );

	it( "draws text with truncate", () => {
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 15, 30, 15 );
	} );

	it( "wraps text", () => {
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 15, 60, 15, true, [ "Very Very", "LongText" ] );
	} );

	it( "wraps text with long word", () => {
		verify( "LongWord Text", "Comic Sans", 24, Color( 0x000000, 1 ), 5, 90, 5, true, [ "Long-", "Word", "Text" ] );
	} );

	it( "wraps text with single long word", () => {
		verify( "LongWord", "Comic Sans", 24, Color( 0x000000, 1 ), 5, 60, 5, true, [ "Long-", "Word" ] );
	} );

	it( "draws number with truncate", () => {
		verify( 1234567890, "Comic Sans", 24, Color( 0x000000, 1 ), 5, 30, 5 );
	} );

	it( "draws text with max width without truncate", () => {
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 18, 30, 18 );
	} );
	
	it( "draws text with max width with truncate on high DPI", () => {
		window.devicePixelRatio = 2;
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 10, 30, 10 );
	} );
	
	it( "draws text with max width without truncate on high DPI", () => {
		window.devicePixelRatio = 2;
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 15, 30, 15 );
	} );
	
	it( "draws text with max width with truncate when scaled up", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 10, 30, 10 );
	} );
	
	it( "draws text with max width without truncate when scaled up", () => {
		scalingManager.pixelWorldRatio = 2;
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 15, 30, 15 );
	} );
	
	it( "exits the while loop when truncating", () => {
		verify( "Very Very LongText", "Comic Sans", 24, Color( 0x000000, 1 ), 1, 30, 1 );
	} );
	
	describe( "at runtime", () => {
		let block;

		beforeAll( () => {
			block = makeBlock( TextBlock, [ "text", , 12 ], [], renderingContext );
		} );

		for( const input of [ "text", "fontFamily", "fontSize", "color", "maxWidth" ] ) {
			it( `changes texture on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasTextureChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
		
		it( "changes texture when the scaling factor changes", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasTextureChanged( 1 ) ).toBe( true );
			block.renderedPixelWorldRatio = undefined;
		} );
		
		it( "does not change texture when the scaling factor has not changed", () => {
			block.renderedPixelWorldRatio = 2;
			expect( block.hasTextureChanged( 2 ) ).toBe( false );
			block.renderedPixelWorldRatio = undefined;
		} );
	} );
} );