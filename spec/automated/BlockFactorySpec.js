const { itAsync, verifyStream } = require( "./TestUtils" );
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
		const block = BlockFactory.fromData( Mock.NumberBlock, {} );
		verifyStream( block.getOutputStream( 0 ), 0 );
	} );
} );