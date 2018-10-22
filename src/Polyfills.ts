if( Number.MAX_SAFE_INTEGER === undefined ) {
	Object.defineProperties( Number, {
		MAX_SAFE_INTEGER: {
			enumerable: false,
			configurable: false,
			writable: false,
			value: Math.pow( 2, 53 ) - 1
		},
		MIN_SAFE_INTEGER: {
			enumerable: false,
			configurable: false,
			writable: false,
			value: -Math.pow( 2, 53 ) - 1
		}
	} );
}