const { BlockInputIndexedReference } = require( "../../build/core/inputs/BlockInputIndexedReference.js" );

describe( "BlockInputIndexedReference", () => {
	let MockRenderingContext;
	let MockBlock;
	let blockOutputValue;
	
	beforeEach( () => {
		MockRenderingContext = {
			frameIndex: 0,
			interpretBlockById: jasmine.createSpy( "interpretBlockById" ).and.callFake( function( blockId ) {
				return MockBlock;
			} )
		};
		
		blockOutputValue = undefined;
		
		MockBlock = {
			getOutputValue: jasmine.createSpy( "getOutputValue" ).and.callFake( function( index ) {
				return blockOutputValue;
			} )
		};
	} );
	
	it( "returns default value when actual value is undefined", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		expect( input.getValue() ).toBe( 1 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point1" );
		expect( MockBlock.getOutputValue ).toHaveBeenCalledWith( 0 );
	} );
	
	it( "returns actual value when actual value is not undefined", () => {
		blockOutputValue = 2;
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point2", 0, 1 );
		expect( input.getValue() ).toBe( 2 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point2" );
		expect( MockBlock.getOutputValue ).toHaveBeenCalledWith( 0 );
	} );
	
	it( "returns actual value from nonzero output index when actual value is not undefined", () => {
		blockOutputValue = 4;
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point3", 3, 1 );
		expect( input.getValue() ).toBe( 4 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point3" );
		expect( MockBlock.getOutputValue ).toHaveBeenCalledWith( 3 );
	} );
	
	it( "initializes as uncached", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "is cached after getValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );
	
	it( "is uncached after getUncachedValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "is uncached after frameIndex is incremented", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "is cached after frameIndex is incremented and getValue() is called", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );
	
	it( "is uncached after frameIndex is incremented and getUncachedValue() is called", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );
	
	it( "initializes as changed", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		expect( input.hasChanged() ).toBe( true );
	} );
	
	it( "is unchanged after first getValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		expect( input.hasChanged() ).toBe( false );
	} );
	
	it( "is unchanged after second getValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		blockOutputValue = 3;
		expect( input.getValue() ).toBe( 3 );
		expect( input.hasChanged() ).toBe( false );
	} );
	
	it( "is unchanged after second getValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		expect( input.getValue() ).toBe( 1 );
		expect( input.hasChanged() ).toBe( false );
	} );
	
	it( "is changed after first getUncachedValue()", () => {
		const input = new BlockInputIndexedReference( MockRenderingContext, "Point1", 0, 1 );
		input.getUncachedValue();
		expect( input.hasChanged() ).toBe( true );
	} );
} );