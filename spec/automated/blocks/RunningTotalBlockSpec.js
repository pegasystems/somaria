const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const RunningTotalBlock  = BlockTypes.get( "RunningTotal" );
const { IteratorBlockScope } = require( "../../build/core/IteratorBlockScope" );

let scope;
function verify( inputValue, expectedValue ) {
	let block = makeBlock( RunningTotalBlock, [ inputValue ], [ "RunningTotal1", scope ] );
	expect( block.getOutputValue() ).toBe( expectedValue );
}

describe( "RunningTotalBlock", () => {
	beforeEach( () => {
		scope = new IteratorBlockScope();
		scope.currentIndex = 0;
	} );

	it( "is defined as a block type", () => {
		expect( RunningTotalBlock ).toBeDefined();
	} );

	it( "defines default input value", () => {
		expect( RunningTotalBlock.getDefaultInputValues( null ) ).toEqual( [ 0 ] );
	} );

	it( "sets value to 1", () => {
		verify( 1, 1 );
	} );

	it( "resets on a new frame", () => {
		verify( 1, 1 );
		verify( 1, 1 );
		verify( 1, 1 );
	} );

	it( "adds positive numbers to running total of 1", () => {
		verify( 1, 1 );
		scope.currentIndex++;
		verify( 1, 2 );
		scope.currentIndex++;
		verify( 1, 3 );
		scope.currentIndex++;
		verify( 1, 4 );
	} );

	it( "adds negative numbers to running total of -1", () => {
		verify( -1, -1 );
		scope.currentIndex++;
		verify( -1, -2 );
		scope.currentIndex++;
		verify( -1, -3 );
		scope.currentIndex++;
		verify( -1, -4 );
	} );
} );