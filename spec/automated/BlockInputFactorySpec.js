const most = require( "most" );
const { itAsync, verifyStream } = require( "./TestUtils" );
const { BlockInputFactory } = require( "../build/core/BlockInputFactory.js" );
const { Signal } = require( "../build/core/Signal.js" );

const Mock = {
	Value: {
		accessType: "Value",
		value: 10
	},
	ValueNoValue: {
		accessType: "Value"
	},
	Indexed: {
		accessType: "Indexed",
		blockId: "TestBlockID",
		index: 3
	},
	Published: {
		accessType: "Published",
		blockId: "PublishedBlockID",
		reference: "OutputID"
	},
	Theme: {
		accessType: "Theme",
		themeAttributeType: "FontFamily"
	},
	External: {
		accessType: "External",
		id: "ExternalInputID"
	},
	Invalid: {
		accssType: undefined
	}
};

const defaultValue = { value: 1 };
const defaultThemeAttributeReferenceValue = "Color palette";

async function verifyIndexed( value, expectation ) {
	const block = {
		getOutputStream: jasmine.createSpy( "getOutputStream" ).and.returnValue( most.of( value ) )
	};
	const renderingContext = {
		interpretBlockById: jasmine.createSpy( "interpretBlockById" ).and.returnValue( block )
	};
	const input = BlockInputFactory.fromData( Mock.Indexed, defaultValue, renderingContext );
	expect( renderingContext.interpretBlockById ).toHaveBeenCalledWith( Mock.Indexed.blockId );
	expect( block.getOutputStream ).toHaveBeenCalledWith( Mock.Indexed.index );
	await verifyStream( input, expectation );
}

async function verifyPublished( value, expectation ) {
	const block = {
		getPublishedOutputStream: jasmine.createSpy( "getPublishedOutputStream" ).and.returnValue( most.of( value ) )
	};
	const renderingContext = {
		interpretBlockById: jasmine.createSpy( "interpretBlockById" ).and.returnValue( block )
	};
	const input = BlockInputFactory.fromData( Mock.Published, defaultValue, renderingContext );
	expect( renderingContext.interpretBlockById ).toHaveBeenCalledWith( Mock.Published.blockId );
	expect( block.getPublishedOutputStream ).toHaveBeenCalledWith( Mock.Published.reference );
	await verifyStream( input, expectation );
}

async function verifyExternal( value, expectation ) {
	let externalSignal;
	const renderingContext = {
		setExternalInput: jasmine.createSpy( "setExternalInput" ).and.callFake( ( id, signal ) => {
			externalSignal = signal;
		} )
	};
	const input = BlockInputFactory.fromData( Mock.External, defaultValue, renderingContext );
	expect( renderingContext.setExternalInput ).toHaveBeenCalledWith( Mock.External.id, jasmine.any( Signal ) );
	externalSignal.set( value );
	setTimeout( async () => {
		await verifyStream( input, defaultValue, expectation );
	}, 0 );
}

describe( "BlockInputFactory", () => {
	itAsync( "builds a default value stream when no input is found", async () => {
		const input = BlockInputFactory.fromData( undefined, defaultValue );
		await verifyStream( input, defaultValue );
	} );
	
	itAsync( "builds a default value stream when accessType is invalid", async () => {
		const input = BlockInputFactory.fromData( Mock.Invalid, defaultValue );
		await verifyStream( input, defaultValue );
	} );
	
	itAsync( "builds a stream from a value input", async () => {
		const input = BlockInputFactory.fromData( Mock.Value, defaultValue );
		await verifyStream( input, Mock.Value.value );
	} );
	
	itAsync( "builds a stream from a value input with no value", async () => {
		const input = BlockInputFactory.fromData( Mock.ValueNoValue, defaultValue );
		await verifyStream( input, defaultValue );
	} );
	
	itAsync( "builds a stream from an indexed input", async () => {
		await verifyIndexed( 11, 11 );
	} );
	
	itAsync( "builds a stream from an indexed input returning undefined", async () => {
		await verifyIndexed( undefined, defaultValue );
	} );
	
	itAsync( "builds a stream from a published input", async () => {
		await verifyPublished( 12, 12 );
	} );
	
	itAsync( "builds a stream from a published input returning undefined", async () => {
		await verifyPublished( undefined, defaultValue );
	} );
	
	itAsync( "builds a stream from an external input", async () => {
		await verifyExternal( 13, 13 );
	} );
	
	itAsync( "builds a stream from an external input with no value", async () => {
		await verifyExternal( undefined, defaultValue );
	} );

	/*it( "builds a BlockInputThemeAttributeReference object", () => { 
		let input = BlockInputFactory.fromData( Mock.Theme, defaultThemeAttributeReferenceValue );
		expect( input ).toEqual( jasmine.any( BlockInputThemeAttributeReference ) );
		expect( input.themeAttributeType ).toBe( Mock.Theme.themeAttributeType );
		expect( input.defaultValue ).toBe( defaultThemeAttributeReferenceValue );
	} );*/
} );