import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { Color } from "../structs/Color";
import * as most from "most";

export class ColorHexBlock extends ConsumableBlock {
	protected color: Color;
	protected colorStream: most.Stream<Color>;
	
	constructor(
			hex: most.Stream<number>,
			alpha: most.Stream<number> ) {
		super();
		this.color = Color.fromRGB( 0, 0, 0, 0 );
		
		this.colorStream = most.merge<Color>(
			hex.map( hex => this.color.setHex( hex ) as Color ),
			alpha.map( alpha => this.color.setAlpha( alpha ) )
		);
	}
	
	public getOutputStream( index: number ): most.Stream<Color> {
		return this.colorStream;
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		return [ config.meshColor, 1 ];
	}
}