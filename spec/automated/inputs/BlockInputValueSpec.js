const { BlockInputValue } = require( "../../build/core/inputs/BlockInputValue.js" );

describe( "BlockInputValue", () => {
	it( "returns default value when actual value is undefined", () => {
		const input = new BlockInputValue( undefined, 1 );
		expect( input.getValue() ).toBe( 1 );
	} );
	
	it( "returns actual value when actual value is not undefined", () => {
		const input = new BlockInputValue( 2, 1 );
		expect( input.getValue() ).toBe( 2 );
	} );
	
	it( "initializes as uncached", () => {
		const input = new BlockInputValue( 2, 1 );
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "is cached after getValue()", () => {
		const input = new BlockInputValue( 2, 1 );
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );
	
	it( "is uncached after getUncachedValue()", () => {
		const input = new BlockInputValue( 2, 1 );
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "initializes as changed", () => {
		const input = new BlockInputValue( 2, 1 );
		expect( input.hasChanged() ).toBe( true );
	} );
	
	it( "is unchanged after getValue()", () => {
		const input = new BlockInputValue( 2, 1 );
		input.getValue();
		expect( input.hasChanged() ).toBe( false );
	} );
	
	it( "is changed after getUncachedValue()", () => {
		const input = new BlockInputValue( 2, 1 );
		input.getUncachedValue();
		expect( input.hasChanged() ).toBe( true );
	} );
} );