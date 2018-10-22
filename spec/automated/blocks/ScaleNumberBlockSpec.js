const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const ScaleNumberBlock = BlockTypes.get( "ScaleNumber" );

describe( "ScaleNumberBlock", () => {
	it( "is defined as a block type", () => {
		expect( ScaleNumberBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( ScaleNumberBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0 ] );
	} );
	
	describe( "numDigitsBeforeDecimalPoint", () => {
		const cases = [
			[ 0, 1 ],
			[ 1, 1 ],
			[ 9, 1 ],
			[ 10, 2 ],
			[ 99, 2 ],
			[ 100, 3 ],
			[ -1, 1 ],
			[ 0.5, 0 ],
			[ -0.5, 0 ]
		];

		for( const [ input, expectation ] of cases ) {
			it( `finds ${expectation} digits in ${input}`, () => {
				expect( ScaleNumberBlock.numDigitsBeforeDecimalPoint( input ) ).toEqual( expectation );
			} );
		}
	} );

	describe( "format number using summary and suffix", () => {
		const cases = [
			[ 0, 0, "0" ],
			[ 5, 3, "5" ],
			[ -5, 3, "-5" ],
			[ 10, 3, "10" ],
			[ 100, 5, "100" ],
			[ 1000, 3, "1.00K" ],
			[ -0.123, 15, "-0.123" ],
			[ 180, 2, "180" ],
			[ 120, 15, "120" ],
			[ 12, 3, "12" ],
			[ 3.14159, 3, "3.14" ],
			[ -3.14159, 3, "-3.14" ],
			[ 300.25, 3, "300" ],
			[ 300.25, 8, "300.25" ],
			[ 3002500000, 8, "3.0025000B" ],
			[ 5007, 3, "5.01K" ],
			[ 10000, 3, "10.0K" ],
			[ 52071, 3, "52.1K" ],
			[ 552871, 3, "553K" ],
			[ 9235976325, 3, "9.24B" ],
			[ 5123658956458, 3, "5.12T" ],
			[ 0.001, 3, "0" ],
			[ 0.1584, 3, "0.16" ],
			[ -0.1584, 3, "-0.16" ],
			[ -3568.16, 4, "-3.568K" ],
			[ 1546866.213, 0, "1.546866213M" ],
			[ 5123658956458000, 3, "5124T" ],
			[ 180, 2, "180" ]
		];

		for( const [ input, maxDigits, expectation ] of cases ) {
			it( `finds ${expectation} for input ${input} with maxDigits ${maxDigits}`, () => {
				const block = makeBlock( ScaleNumberBlock, [ input, maxDigits ] );
				expect( block.getOutputValue( 0 ) ).toBe( expectation );
			} );
		}
	} );
} );