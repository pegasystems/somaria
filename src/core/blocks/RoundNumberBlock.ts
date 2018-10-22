import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class RoundNumberBlock extends ConsumableBlock {
	constructor(
			protected readonly value: Input<number>,
			protected readonly precision: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		const factor = Math.pow( 10, this.precision.getValue() );
		return Math.round( this.value.getValue() * factor ) / factor;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0 ];
	}
}