const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const VariableListBlock = BlockTypes.get( "VariableList" );
const { IteratorBlockScope } = require( "../../build/core/IteratorBlockScope" );

let scope;
let block;
function verify( value, sample, isPersisted, expectedValue ) {
	block = makeBlock( VariableListBlock, [ value, sample, isPersisted ], [ "VariableList1", scope ] );
	block.renderingContext = { frameIndex: 0 };
	expect( block.getOutputValue() ).toEqual( expectedValue );
}

describe( "VariableListBlock", () => {
	beforeEach( () => {
		scope = new IteratorBlockScope();
	} );

	it( "is defined as a block type", () => {
		expect( VariableListBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( VariableListBlock.getDefaultInputValues( null ) ).toEqual( [
			"Value", 1, 1
		] );
	} );

	it( "does not add value to list if sample is zero", () => {
		verify( "TestValue", 0, 1, [] );
	} );

	it( "adds value to list if sample is non-zero", () => {
		verify( "TestValue", 1, 1, [ "TestValue" ] );
	} );

	it( "adds value to list if sample is non-zero - multiple values", () => {
		verify( "TestValue1", 1, 1, [ "TestValue1" ] );
		verify( "TestValue2", 0, 1, [ "TestValue1" ] );
		verify( "TestValue3", 1, 1, [ "TestValue1", "TestValue3" ] );
	} );
	
	it( "clears value in list if persist is set to false", () => {
		verify( "TestValue1", 1, 1, [ "TestValue1" ] );
		block.iteratorScope.currentIndex = 0;
		verify( "TestValue1", 1, 0, [ "TestValue1" ] );
	} );
} );