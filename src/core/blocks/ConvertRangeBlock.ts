import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class ConvertRangeBlock extends ConsumableBlock {
	constructor(
			protected readonly value: Input<number>,
			protected readonly sourceStart: Input<number>,
			protected readonly sourceEnd: Input<number>,
			protected readonly targetStart: Input<number>,
			protected readonly targetEnd: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		const sourceStart = this.sourceStart.getValue();
		const sourceEnd = this.sourceEnd.getValue();
		const targetStart = this.targetStart.getValue();
		const targetEnd = this.targetEnd.getValue();
		return ( this.value.getValue() - sourceStart ) / ( sourceEnd - sourceStart ) * ( targetEnd - targetStart ) + targetStart;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 100, 0, 100 ];
	}
}