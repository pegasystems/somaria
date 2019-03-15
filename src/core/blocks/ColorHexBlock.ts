import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { Color } from "../structs/Color";
import { Stream, merge } from "most";

export class ColorHexBlock extends ConsumableBlock {
	protected color: Color;
	protected colorStream: Stream<Color>;
	
	constructor(
			hex: Stream<number>,
			alpha: Stream<number> ) {
		super();
		this.color = Color.fromRGB( 0, 0, 0, 0 );
		
		this.colorStream = merge<Color>(
			hex.map( ( hex: number ) => this.color.setHex( hex ) as Color ),
			alpha.map( ( alpha: number ) => this.color.setAlpha( alpha ) )
		);
	}
	
	public getOutputStream( index: number ): Stream<Color> {
		return this.colorStream;
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		return [ config.meshColor, 1 ];
	}
}