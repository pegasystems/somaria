import { Color } from "../structs/Color";
import * as THREE from "three";

export class TexturedMaterial extends THREE.RawShaderMaterial {
	constructor() {
		super();
		this.vertexShader = `
			precision mediump float;
			
			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;
			
			attribute vec3 position;
			
			#if USE_TEXTURE
				attribute vec2 uv;
				
				varying vec2 vUv;
			#endif
			
			void main() {
				#if USE_TEXTURE
					vUv = uv;
				#endif
				
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
			`;
		this.fragmentShader = `
			precision mediump float;
			
			uniform vec4 color;
			uniform float opacity;
			
			#if USE_TEXTURE
				uniform sampler2D texture;
				
				varying vec2 vUv;
			#endif
			
			void main() {
				#if USE_TEXTURE
					vec4 texel = texture2D( texture, vUv );
					gl_FragColor.a = texel.a + color.a * (1. - texel.a);
					gl_FragColor.rgb = (texel.rgb * texel.a + color.rgb * color.a * (1. - texel.a)) / gl_FragColor.a;
				#else
					gl_FragColor = color;
				#endif
			}
			`;
		this.uniforms = {
			color: { value: null },
			opacity: { value: 0 },
			texture: { value: null }
		};
		this.defines = {
			USE_TEXTURE: 0
		};
	}
	
	public setColor( color: Color ): void {
		this.uniforms.color.value = color.toArray();
	}
	
	public setTexture( texture: THREE.Texture ): void {
		if( this.uniforms.texture.value !== null ) {
			this.uniforms.texture.value.dispose();
		}
		this.uniforms.texture.value = texture;
		this.defines.USE_TEXTURE = texture === null ? 0 : 1;
	}
}