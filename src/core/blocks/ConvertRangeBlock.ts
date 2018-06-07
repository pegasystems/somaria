import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

export class ConvertRangeBlock extends ConsumableBlock {
	protected outputStream: most.Stream<number>;
	
	constructor(
			value: most.Stream<number>,
			sourceStart: most.Stream<number>,
			sourceEnd: most.Stream<number>,
			targetStart: most.Stream<number>,
			targetEnd: most.Stream<number> ) {
		super();
		this.outputStream = most.combine<number, number, number, number, number, number>(
			( value: number, sourceStart: number, sourceEnd: number, targetStart: number, targetEnd: number ) => 
				( value - sourceStart ) / ( sourceEnd - sourceStart ) * ( targetEnd - targetStart ) + targetStart,
			value, sourceStart, sourceEnd, targetStart, targetEnd );
	}
	
	public getOutputStream( index: number ): most.Stream<number> {
		return this.outputStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 100, 0, 100 ];
	}
}