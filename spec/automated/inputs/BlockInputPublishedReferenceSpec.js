const { BlockInputPublishedReference } = require( "../../build/core/inputs/BlockInputPublishedReference.js" );

describe( "BlockInputPublishedReference", () => {
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
			getPublishedOutputValue: jasmine.createSpy( "getPublishedOutputValue" ).and.callFake( function( index ) {
				return blockOutputValue;
			} )
		};
	} );

	it( "returns default value when actual value is undefined", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		expect( input.getValue() ).toBe( 1 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point1" );
		expect( MockBlock.getPublishedOutputValue ).toHaveBeenCalledWith( "my output" );
	} );

	it( "returns actual value when actual value is not undefined", () => {
		blockOutputValue = 2;
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point2", "my output", 1 );
		expect( input.getValue() ).toBe( 2 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point2" );
		expect( MockBlock.getPublishedOutputValue ).toHaveBeenCalledWith( "my output" );
	} );

	it( "returns actual value from different reference when actual value is not undefined", () => {
		blockOutputValue = 4;
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point3", "value 2", 1 );
		expect( input.getValue() ).toBe( 4 );
		expect( MockRenderingContext.interpretBlockById ).toHaveBeenCalledWith( "Point3" );
		expect( MockBlock.getPublishedOutputValue ).toHaveBeenCalledWith( "value 2" );
	} );

	it( "initializes as uncached", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		expect( input.isCached() ).toBe( false );
	} );

	it( "is cached after getValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );

	it( "is uncached after getUncachedValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );

	it( "is uncached after frameIndex is incremented", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		expect( input.isCached() ).toBe( false );
	} );

	it( "is cached after frameIndex is incremented and getValue() is called", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		input.getValue();
		expect( input.isCached() ).toBe( true );
	} );

	it( "is uncached after frameIndex is incremented and getUncachedValue() is called", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		input.getUncachedValue();
		expect( input.isCached() ).toBe( false );
	} );

	it( "initializes as changed", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		expect( input.hasChanged() ).toBe( true );
	} );

	it( "is unchanged after first getValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		expect( input.hasChanged() ).toBe( false );
	} );

	it( "is unchanged after second getValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		blockOutputValue = 3;
		expect( input.getValue() ).toBe( 3 );
		expect( input.hasChanged() ).toBe( false );
	} );

	it( "is unchanged after second getValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getValue();
		MockRenderingContext.frameIndex++;
		expect( input.getValue() ).toBe( 1 );
		expect( input.hasChanged() ).toBe( false );
	} );

	it( "is changed after first getUncachedValue()", () => {
		const input = new BlockInputPublishedReference( MockRenderingContext, "Point1", "my output", 1 );
		input.getUncachedValue();
		expect( input.hasChanged() ).toBe( true );
	} );
} );