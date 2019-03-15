import { ConsumableBlock } from "./ConsumableBlock";
import { Stream } from "most";

export class NumberBlock extends ConsumableBlock {
	constructor( protected readonly value: Stream<number> ) {
		super();
	}
	
	public getOutputStream( index: number ): Stream<number> {
		return this.value;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0 ];
	}
}