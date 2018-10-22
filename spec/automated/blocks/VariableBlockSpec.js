const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const VariableBlock = BlockTypes.get( "Variable" );
const { IteratorBlockScope } = require( "../../build/core/IteratorBlockScope" );

let scope;
function verify( inputs, expectedValue ) {
	let block = makeBlock( VariableBlock, inputs, [ "Variable1", scope ] );
	block.renderingContext = { frameIndex: 0 };
	expect( block.getOutputValue() ).toBe( expectedValue );
}

describe( "VariableBlock", () => {
	beforeEach( () => {
		scope = new IteratorBlockScope();
	} );
	it( "is defined as a block type", () => {
		expect( VariableBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( VariableBlock.getDefaultInputValues( null ) ).toEqual( [
			"Value", 0, 1, ""
		] );
	} );

	it( "sets value if sample is non-zero and reset is zero integer", () => {
		verify( [ "TestValue", 1, 0, "ResetValue" ], "TestValue" );
	} );

	it( "sets resetvalue if reset is non-zero and sample is zero integer", () => {
		verify( [ "TestValue", 0, 2, "ResetValue" ], "ResetValue" );
	} );

	it( "sets resetvalue if reset is non-zero and sample is non-zero integer", () => {
		verify( [ "TestValue", 2, 1, "ResetValue" ], "TestValue" );
	} );

	it( "sets resetvalue if reset is zero and sample is zero integer", () => {
		verify( [ "TestValue", 0, 0, "ResetValue" ], "ResetValue" );
	} );

	it( "retains previous value if reset is zero and sample is zero integer", () => {
		verify( [ "OldValue", 1, 0, "ResetValue" ], "OldValue" );
		verify( [ "NewValue", 0, 0, "ResetValue" ], "OldValue" );
	} );
} );