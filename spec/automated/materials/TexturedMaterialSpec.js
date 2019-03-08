const { customMatchers, Color } = require( "../TestUtils" );
const THREE = require( "three" );
const { TexturedMaterial } = require( "../../build/core/materials/TexturedMaterial" );

describe( "TexturedMaterial", () => {
	beforeAll( () => {
		jasmine.addMatchers( customMatchers );
	} );
	
	it( "initializes", () => {
		const material = new TexturedMaterial();
		expect( material ).toBeAny( THREE.RawShaderMaterial );
		expect( material.vertexShader.length ).toBeGreaterThan( 0 );
		expect( material.fragmentShader.length ).toBeGreaterThan( 0 );
		expect( material.uniforms.color ).toBeDefined();
		expect( material.uniforms.opacity ).toBeDefined();
		expect( material.uniforms.texture ).toBeDefined();
		expect( material.defines.USE_TEXTURE ).toBe( 0 );
	} );

	it( "sets a color", () => {
		const material = new TexturedMaterial();
		const color = Color( 0xaabbcc, 1.0 );
		material.setColor( color );
		expect( material.uniforms.color.value ).toEqual( [ color.r, color.g, color.b, color.a ] );
	} );

	it( "sets a different color", () => {
		const material = new TexturedMaterial();
		const color = Color( 0x123456, 0.5 );
		material.setColor( color );
		expect( material.uniforms.color.value ).toEqual( [ color.r, color.g, color.b, color.a ] );
	} );

	it( "sets a texture", () => {
		const material = new TexturedMaterial();
		const texture = new THREE.Texture();
		material.setTexture( texture );
		expect( material.uniforms.texture.value ).toBe( texture );
		expect( material.defines.USE_TEXTURE ).toBe( 1 );
	} );
	
	it( "unsets a texture", () => {
		const material = new TexturedMaterial();
		const texture = new THREE.Texture();
		material.setTexture( texture );
		spyOn( texture, "dispose" );
		material.setTexture( null );
		expect( texture.dispose ).toHaveBeenCalled();
		expect( material.uniforms.texture.value ).toBe( null );
		expect( material.defines.USE_TEXTURE ).toBe( 0 );
	} );
} );