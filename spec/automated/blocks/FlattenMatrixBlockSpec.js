const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const FlattenMatrixBlock = BlockTypes.get( "FlattenMatrix" );

function verify( inputValue, expectedValue ) {
	let block = makeBlock( FlattenMatrixBlock, [ inputValue ] );
	expect( block.getOutputValue() ).toEqual( expectedValue );
}

describe( "FlattenMatrixBlock", () => {
	it( "is defined as a block type", () => {
		expect( FlattenMatrixBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( FlattenMatrixBlock.getDefaultInputValues( {} ) ).toEqual( [ [] ] );
	} );

	it( "returns flatten list when given simple array", () => {
		verify( [ 1, 2, 3, 4 ] , [ 1, 2, 3, 4 ] );
	} );

	it( "returns flatten list when given 2d array", () => {
		verify( [ [ 1, 2 ], [ 3, 4 ] ] , [ 1, 2, 3, 4 ] );
	} );

	it( "returns flatten list when given multidimentional array", () => {
		verify( [ [ 1, 2 ], [ 3, 4 ], [ [ 5, 6 ], [ 7, 8 ], [ 9, 10, 11 ] ] ] , [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] );
	} );

	it( "returns flatten list when given multidimentional character array", () => {
		verify( [ "a", "b", [ "c" ] ] , [ "a", "b", "c" ] );
	} );

	it( "returns flatten list when given mixed array", () => {
		verify( [ [ 3, [ 1, "flatten", [ 2, "matrix", [ 2, 5 ] ] ], 1, [ 9, [ {}, [ 2, true ] ] ] ] ] , 
			[ 3, 1, "flatten", 2, "matrix", 2, 5, 1, 9, {}, 2, true ] );
	} );
} );
