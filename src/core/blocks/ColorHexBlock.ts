import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";

export class ColorHexBlock extends ConsumableBlock {
	protected color: Color;
	
	constructor(
			protected readonly rgb: Input<number>,
			protected readonly opacity: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): Color {
		if( this.hasColorChanged() ) {
			this.color = Color.fromHex( this.rgb.getValue(), this.opacity.getValue() );
		}
		
		return this.color;
	}
	
	protected hasColorChanged(): boolean {
		return this.rgb.hasChanged() || this.opacity.hasChanged();
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		return [ config.meshColor, 1 ];
	}
}