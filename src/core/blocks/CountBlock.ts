import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class CountBlock extends ConsumableBlock {
	constructor( protected readonly items: Input<any[]> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		return this.items.getValue().length;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ [] ];
	}
}