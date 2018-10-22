const { makeBlock } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const RandomBlock = BlockTypes.get( "Random" );

function verify( minValue, maxValue, sample, expectedResult ) {
	let block = makeBlock( RandomBlock, [ minValue, maxValue, sample ] );
	expect( block.getOutputValue( 0 ) ).toBe( expectedResult );
}

describe( "RandomBlock", () => {
	let randomValue = 0;

	beforeAll( () => {
		spyOn( Math, "random" ).and.callFake( function() {
			return randomValue;
		} );
	} );

	it( "is defined as a block type", () => {
		expect( RandomBlock ).toBeDefined();
	} );

	it( "defines default input values", () => {
		expect( RandomBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 1, 0 ] );
	} );

	it( "returns a random value", () => {
		randomValue = 0.5;
		verify( 0, 1, 0, 0.5 );
	} );

	it( "returns a different random value", () => {
		randomValue = 0.75;
		verify( 0, 1, 0, 0.75 );
	} );

	it( "returns a scaled random value", () => {
		randomValue = 0.75;
		verify( -10, 30, 0, 20 );
	} );

	it( "returns a different scaled random value", () => {
		randomValue = 0.25;
		verify( -30, 10, 0, -20 );
	} );

	it( "returns the same value if the sample remains at zero", () => {
		randomValue = 0.25;
		let block = makeBlock( RandomBlock, [ 0, 1, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0.25 );
		randomValue = 0.75;
		expect( block.getOutputValue( 0 ) ).toBe( 0.25 );
	} );

	it( "returns a different random value when the sample becomes nonzero", () => {
		randomValue = 0.25;
		let block = makeBlock( RandomBlock, [ 0, 1, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0.25 );
		randomValue = 0.75;
		block.sample.value = 1.0;
		block.sample.hasChanged = true;
		expect( block.getOutputValue( 0 ) ).toBe( 0.75 );
	} );

	it( "returns a the same random value scaled differently when the minimum value changes", () => {
		randomValue = 0.25;
		let block = makeBlock( RandomBlock, [ 0, 1, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0.25 );
		randomValue = 0.75;
		block.minValue.value = -1.0;
		block.minValue.hasChanged = true;
		expect( block.getOutputValue( 0 ) ).toBe( -0.5 );
	} );

	it( "returns a the same random value scaled differently when the maximum value changes", () => {
		randomValue = 0.25;
		let block = makeBlock( RandomBlock, [ 0, 1, 0 ] );
		expect( block.getOutputValue( 0 ) ).toBe( 0.25 );
		randomValue = 0.75;
		block.maxValue.value = 2.0;
		block.maxValue.hasChanged = true;
		expect( block.getOutputValue( 0 ) ).toBe( 0.5 );
	} );
} );