import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class RandomBlock extends ConsumableBlock {
	protected randomNumber: number;
	
	constructor(
			protected readonly minValue: Input<number>,
			protected readonly maxValue: Input<number>,
			protected readonly sample: Input<number> ) {
		super();
		this.randomNumber = NaN;
	}
	
	public getOutputValue( index: number ): number {
		if( isNaN( this.randomNumber ) || this.sample.getValue() !== 0 ) {
			this.randomNumber = Math.random();
		}
		
		return this.randomNumber * ( this.maxValue.getValue() - this.minValue.getValue() ) + this.minValue.getValue();
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 1, 0 ];
	}
}