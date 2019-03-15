import { ConsumableBlock } from "./ConsumableBlock";
import { Stream, combine } from "most";

export class ConvertRangeBlock extends ConsumableBlock {
	protected outputStream: Stream<number>;
	
	constructor(
			value: Stream<number>,
			sourceStart: Stream<number>,
			sourceEnd: Stream<number>,
			targetStart: Stream<number>,
			targetEnd: Stream<number> ) {
		super();
		this.outputStream = combine<number, number, number, number, number, number>(
			( value: number, sourceStart: number, sourceEnd: number, targetStart: number, targetEnd: number ) =>
				( value - sourceStart ) / ( sourceEnd - sourceStart ) * ( targetEnd - targetStart ) + targetStart,
			value, sourceStart, sourceEnd, targetStart, targetEnd );
	}
	
	public getOutputStream( index: number ): Stream<number> {
		return this.outputStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 100, 0, 100 ];
	}
}