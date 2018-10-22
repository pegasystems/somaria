import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class NumberBlock extends ConsumableBlock {
	constructor( protected readonly value: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		return this.value.getValue();
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0 ];
	}
}