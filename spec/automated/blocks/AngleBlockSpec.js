const { makeBlock, Angle, AngleDegrees } = require( "../TestUtils" );
const { BlockTypes } = require( "../../build/core/BlockTypes" );
const AngleBlock = BlockTypes.get( "Angle" );

describe( "AngleBlock", () => {
	it( "is defined as a block type", () => {
		expect( AngleBlock ).toBeDefined();
	} );
	
	it( "defines default input values", () => {
		expect( AngleBlock.getDefaultInputValues( {} ) ).toEqual( [ 0, 0, 0, "radian" ] );
	} );

	it( "builds an angle object using radians", () => {
		let block = makeBlock( AngleBlock, [ 1, 2, 3, "radian" ] );
		let angle = block.getOutputValue( 0 );
		expect( angle ).toEqual( Angle( 1, 2, 3 ) );
	} );
	
	it( "builds a different angle object using radians", () => {
		let block = makeBlock( AngleBlock, [ 6, 5, 4, "radian" ] );
		let angle = block.getOutputValue( 0 );
		expect( angle ).toEqual( Angle( 6, 5, 4 ) );
	} );
	
	it( "builds an angle object using degrees", () => {
		let block = makeBlock( AngleBlock, [ 1, 2, 3, "degree" ] );
		let angle = block.getOutputValue( 0 );
		expect( angle ).toEqual( AngleDegrees( 1, 2, 3 ) );
	} );
	
	it( "builds a different angle object using degrees", () => {
		let block = makeBlock( AngleBlock, [ 6, 5, 4, "degree" ] );
		let angle = block.getOutputValue( 0 );
		expect( angle ).toEqual( AngleDegrees( 6, 5, 4 ) );
	} );
	
	describe( "at runtime", () => {
		let block;
		
		beforeAll( () => {
			block = makeBlock( AngleBlock, [] );
			block.getOutputValue( 0 );
		} );
		
		for( const input of [ "x", "y", "z", "units" ] ) {
			it( `changes texture on new ${input}`, () => {
				block[ input ].valueHasChanged = true;
				expect( block.hasAngleChanged() ).toBe( true );
				block[ input ].valueHasChanged = false;
			} );
		}
	} );
} );