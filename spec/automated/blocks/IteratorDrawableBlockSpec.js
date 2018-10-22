require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const IteratorDrawableBlock = BlockTypes.get( "IteratorDrawable" );
const { RenderingContext } = require( "../../build/core/RenderingContext" );

describe( "IteratorDrawableBlock", () => {
	it( "is defined as a block type", () => {
		expect( IteratorDrawableBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( IteratorDrawableBlock.getDefaultInputValues( {} ) ).toEqual( [ true, 1 ] );
	} );

	it( "executes all leaf blocks once per iteration", () => {
		const renderingContext = new RenderingContext( {}, {}, {}, {}, {}, {}, {} );
		const block = IteratorDrawableBlock.fromData( IteratorDrawableBlock, {
			inputs: [
				{ accessType: "Value", value: true },
				{ accessType: "Value", value: 3 }
			]
		}, renderingContext );
		spyOn( block, "processLeafs" ).and.callThrough();
		block.create3dObjects();
		expect( block.processLeafs.calls.count() ).toBe( 3 );
	} );
} );
