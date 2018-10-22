require( "./TestUtils" );
const { BlockFactory } = require( "../build/core/BlockFactory.js" );

const Mock = {
	NumberBlock: {
		id: "Number10",
		type: "Number",
		inputs: []
	}
};

describe( "BlockFactory", () => {
	it( "fills in missing input", () => {
		let block = BlockFactory.fromData( Mock.NumberBlock, {} );
		expect( block.getOutputValue( 0 ) ).toBe( 0 );
	} );
} );