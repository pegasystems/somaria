global.THREE = require( "three" );

const { BlockInputValue } = require( "../build/core/inputs/BlockInputValue" );
const { Color } = require( "../build/core/structs/Color" );

module.exports.makeBlock = ( blockType, inputValues, inputs = [], renderingContext ) => {
	const defaultInputValues = blockType.getDefaultInputValues( { color: module.exports.Color( 0, 1 ), origin: module.exports.Point( 0, 0, 0 ) }, renderingContext );
	for( let i = 0; i < defaultInputValues.length; i++ ) {
		inputs.push( new BlockInputValue( inputValues[ i ], defaultInputValues[ i ] ) );
	}
	return new blockType( ...inputs );
};

module.exports.makeCanvas = ( width, height ) => {
	return {
		appendChild: jasmine.createSpy( "element.appendChild" ),
		offsetWidth: width,
		offsetHeight: height,
		addEventListener: jasmine.createSpy( "element.addEventListener" )
	};
};

module.exports.degToRad = ( degrees ) => degrees * ( Math.PI / 180 );

module.exports.Point = ( x, y, z ) => new THREE.Vector3( x, y, z );

module.exports.Angle = ( x, y, z ) => new THREE.Vector3( x, y, z );

module.exports.Color = ( rgb, opacity ) => Color.fromHex( rgb, opacity );

module.exports.AngleDegrees = ( x, y, z ) => new THREE.Vector3(
	module.exports.degToRad( x ),
	module.exports.degToRad( y ),
	module.exports.degToRad( z )
);

// number of decimal places
module.exports.precision = 13;
const epsilon = 1 / Math.pow( 10, module.exports.precision );

function makeJasmineMatcher( compareFunction ) {
	return () => ( { compare: compareFunction } );
}

module.exports.customMatchers = {
	toBeAny: makeJasmineMatcher( function( actual, expected ) {
		let result = { pass: jasmine.any( expected ).asymmetricMatch( actual ) };
		
		if( !result.pass ) {
			result.message = `Expected any ${expected.name} but found ${jasmine.pp( actual )}.`;
		}
		
		return result;
	} ),
	toEqualStruct: makeJasmineMatcher( function( actual, expected ) {
		if( expected.equals === undefined ) {
			throw new Error( `Expected struct ${jasmine.pp( expected )} to have an equals() method, but found none.` );
		}
		
		let result = { pass: expected.equals( actual ) };
		
		if( !result.pass ) {
			result.message = `Expected ${jasmine.pp( actual )} to equal ${jasmine.pp( expected )}`;
		}
		
		return result;
	} ),
	toApproximate: makeJasmineMatcher( function( actual, expected ) {
		let result = { pass: true };
		
		let actualValues = actual;
		let expectedValues = expected;
		
		if( typeof actual === "number" ) {
			actualValues = [ actual ];
		}
		
		if( typeof expected === "number" ) {
			expectedValues = [ expected ];
		}
		
		if( actualValues.length !== expectedValues.length ) {
			result.pass = false;
		}
		else {
			for( let i = 0; i < expectedValues.length; i++ ) {
				let a = actualValues[ i ];
				let b = expectedValues[ i ];
				
				if( Math.abs( a - b ) > epsilon || isNaN( a ) && isNaN( b ) ) {
						result.pass = false;
						break;
				}
			}
		}
		
		if( !result.pass ) {
			result.message = `Expected ${ jasmine.pp( actual ) } to be approximately ${ jasmine.pp( expected ) }`;
		}
		return result;
	} )
};