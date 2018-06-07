import { Struct } from "../Struct";
import * as THREE from "three";

export class Color extends THREE.Color implements Struct {
	public a: number;
	
	private constructor( red: number, green: number, blue: number, alpha: number ) {
		super( red, green, blue );
		this.a = alpha;
	}
	
	public setAlpha( alpha: number ): Color {
		this.a = alpha;
		return this;
	}
	
	public toArray(): number[] {
		return [ this.r, this.g, this.b, this.a ];
	}
	
	public equals( that: Color ): boolean {
		return that === this || ( that.r === this.r && that.g === this.g && that.b === this.b && that.a === this.a );
	}
	
	public static fromHex( rgb: number, alpha: number ): Color {
		const color = new Color( 0, 0, 0, alpha );
		color.setHex( rgb );
		return color;
	}
	
	public static fromRGB( red: number, green: number, blue: number, alpha: number ): Color {
		return new Color( red, green, blue, alpha );
	}
	
	public static fromHSL( hue: number, saturation: number, lightness: number, alpha: number ): Color {
		const color = new Color( 0, 0, 0, alpha );
		color.setHSL( hue, saturation, lightness );
		return color;
	}
}