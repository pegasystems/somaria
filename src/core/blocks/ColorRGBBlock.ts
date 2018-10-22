import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";

export class ColorRGBBlock extends ConsumableBlock {
	protected color: Color;
	
	constructor(
			protected readonly red: Input<number>,
			protected readonly green: Input<number>,
			protected readonly blue: Input<number>,
			protected readonly opacity: Input<number> ) {
		super();
	}

	public getOutputValue( index: number ): Color {
		if( this.hasColorChanged() ) {
			this.color = Color.fromRGB( this.red.getValue() / 255, this.green.getValue() / 255, this.blue.getValue() / 255, this.opacity.getValue() );
		}
		
		return this.color;
	}
	
	protected hasColorChanged(): boolean {
		return this.red.hasChanged() || this.green.hasChanged() || this.blue.hasChanged() || this.opacity.hasChanged();
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ color.r * 255, color.g * 255, color.b * 255, 1 ];
	}
}