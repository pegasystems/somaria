import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

export class NumberBlock extends ConsumableBlock {
	constructor( protected readonly value: most.Stream<number> ) {
		super();
	}
	
	public getOutputStream( index: number ): most.Stream<number> {
		return this.value;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0 ];
	}
}