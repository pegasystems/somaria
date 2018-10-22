const { makeBlock, customMatchers } = require( "../TestUtils" );
const { verifyObjects, getQuaternion } = require( "../DrawableTestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ImageBlock = BlockTypes.get( "Image" );

let loadSpy;
let loadingManager;

describe( "ImageBlock", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
		element = jasmine.createSpyObj( "element", [ "appendChild" ] );
	} );
	
	beforeEach( () => {
		loadSpy = jasmine.createSpy( "TextureLoader.load" );
		loadingManager = spyOn( THREE, "LoadingManager" ).and.returnValue( {
			itemStart: jasmine.createSpy( "LoadingManager.itemStart" )
		} );
		spyOn( THREE, "TextureLoader" ).and.returnValue( {
			load: loadSpy.and.returnValue( {
				dispose : jasmine.createSpy( "Texture.dispose" ),
				image : {
					width : 10,
					height: 20
				}
			} )
		} );
	} );
	
	it( "is defined as a block type", () => {
		expect( ImageBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		const config = { url: "" };
		expect( ImageBlock.getDefaultInputValues( config ) ).toEqual( [ config.url ] );
	} );
	
	it( "draws a image", () => {
		const block = makeBlock( ImageBlock, [ "" ] );
		expect( block.getOutputValue( 1 ) ).toEqual( 10 );
		expect( block.getOutputValue( 2 ) ).toEqual( 20 );
	} );
	
	it( "disposes old image", () => {
		const block = makeBlock( ImageBlock, [ "../../images/analytics-good.svg" ] );
		block.getOutputValue( 0 );
		block.url.value = "new image";
		block.url.valueHasChanged = true;
		const oldTexture = block.texture;
		block.getOutputValue( 0 );
		verifyURL( "new image" );
		expect( oldTexture.dispose ).toHaveBeenCalled();
	} );
} );

function verifyURL( url ) {
	expect( loadSpy ).toHaveBeenCalledWith( url );
}