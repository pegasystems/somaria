import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";

export class ColorHSLBlock extends ConsumableBlock {
	protected color: Color;
	
	constructor(
			protected readonly hue: Input<number>,
			protected readonly saturation: Input<number>,
			protected readonly lightness: Input<number>,
			protected readonly opacity: Input<number> ) {
		super();
	}

	public getOutputValue( index: number ): Color {
		if( this.hasColorChanged() ) {
			this.color = Color.fromHSL( this.hue.getValue() / 360, this.saturation.getValue() / 100, this.lightness.getValue() / 100, this.opacity.getValue() );
		}
		
		return this.color;
	}
	
	protected hasColorChanged(): boolean {
		return this.hue.hasChanged() || this.saturation.hasChanged() || this.lightness.hasChanged() || this.opacity.hasChanged();
	}
	
	public static getDefaultInputValues( config: Configuration ): any[] {
		const hsl = Color.fromHex( config.meshColor, 1 ).getHSL( { h: 0, s: 0, l: 0 } );
		return [ hsl.h * 360, hsl.s * 100, hsl.l * 100, 1 ];
	}
}