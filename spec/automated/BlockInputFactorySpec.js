require( "./TestUtils" );
const { BlockInputFactory } = require( "../build/core/BlockInputFactory.js" );
const { BlockInputValue } = require( "../build/core/inputs/BlockInputValue.js" );
const { BlockInputIndexedReference } = require( "../build/core/inputs/BlockInputIndexedReference.js" );
const { BlockInputPublishedReference } = require( "../build/core/inputs/BlockInputPublishedReference.js" );
const { BlockInputThemeAttributeReference } = require( "../build/core/inputs/BlockInputThemeAttributeReference.js" );

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
	}
};

const defaultValue = { value: 1 };
const defaultThemeAttributeReferenceValue = "Color palette";

describe( "BlockInputFactory", () => {
	it( "builds a BlockInputValue object", () => {
		let input = BlockInputFactory.fromData( Mock.Value, defaultValue );
		expect( input ).toEqual( jasmine.any( BlockInputValue ) );
		expect( input.defaultValue ).toBe( defaultValue );
		expect( input.value ).toBe( Mock.Value.value );
	} );
	
	it( "builds a BlockInputValue object with no defined value", () => {
		let input = BlockInputFactory.fromData( Mock.ValueNoValue, defaultValue );
		expect( input ).toEqual( jasmine.any( BlockInputValue ) );
		expect( input.defaultValue ).toBe( defaultValue );
		expect( input.value ).toBe( defaultValue );
	} );
	
	it( "builds a BlockInputIndexedReference object", () => {
		let input = BlockInputFactory.fromData( Mock.Indexed, defaultValue );
		expect( input ).toEqual( jasmine.any( BlockInputIndexedReference ) );
		expect( input.blockId ).toBe( Mock.Indexed.blockId );
		expect( input.index ).toBe( Mock.Indexed.index );
		expect( input.defaultValue ).toBe( defaultValue );
	} );
	
	it( "builds a BlockInputPublishedReference object", () => {
		let input = BlockInputFactory.fromData( Mock.Published, defaultValue );
		expect( input ).toEqual( jasmine.any( BlockInputPublishedReference ) );
		expect( input.blockId ).toBe( Mock.Published.blockId );
		expect( input.reference ).toBe( Mock.Published.reference );
		expect( input.defaultValue ).toBe( defaultValue );
	} );

	it( "builds a BlockInputThemeAttributeReference object", () => { 
		let input = BlockInputFactory.fromData( Mock.Theme, defaultThemeAttributeReferenceValue );
		expect( input ).toEqual( jasmine.any( BlockInputThemeAttributeReference ) );
		expect( input.themeAttributeType ).toBe( Mock.Theme.themeAttributeType );
		expect( input.defaultValue ).toBe( defaultThemeAttributeReferenceValue );
	} );
} );