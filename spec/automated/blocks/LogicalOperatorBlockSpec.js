const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const LogicalOperatorBlock = BlockTypes.get( "LogicalOperator" );

function verifyOnce( elseValue, thenValue, operator, expectation ) {
	let block = makeBlock( LogicalOperatorBlock, [ elseValue, thenValue, operator ] );
	expect( block.getOutputValue( 0 ) ).toBe( expectation );
}

function verify( operator, truthTable ) {
	const truthyValues = [ 1, 2, 100, -3 ];
	const falseyValue = 0;
	
	for( let truthyValue of truthyValues ) {
		verifyOnce( falseyValue, falseyValue, operator, truthTable[ 0 ] );
		verifyOnce( falseyValue, truthyValue, operator, truthTable[ 1 ] );
		verifyOnce( truthyValue, falseyValue, operator, truthTable[ 2 ] );
		verifyOnce( truthyValue, truthyValue, operator, truthTable[ 3 ] );
	}
}

describe( "LogicalOperatorBlock", () => {
	it( "is defined as a block type", () => {
		expect( LogicalOperatorBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( LogicalOperatorBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, "AND" ] );
	} );
	
	it( "should return correct values for AND", () => { 
		verify( "AND", [ 0, 0, 0, 1 ] );
	} );
	
	it( "should return correct values for NAND", () => { 
		verify( "NAND", [ 1, 1, 1, 0 ] );
	} );
		
	it( "should return correct values for OR ", () => { 
		verify( "OR", [ 0, 1, 1, 1 ] );
	} );
	
	it( "should return correct values for NOR", () => { 
		verify( "NOR", [ 1, 0, 0, 0 ] );
	} );
	
	it( "should return correct values for XOR", () => { 
		verify( "XOR", [ 0, 1, 1, 0 ] );
	} );
		
	it( "should return correct values for NXOR", () => { 
		verify( "NXOR", [ 1, 0, 0, 1 ] );
	} );
} ); 
