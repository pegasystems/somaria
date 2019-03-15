import { ConsumableBlock } from "./ConsumableBlock";
import { Stream, combine } from "most";

export class BinarySwitchBlock extends ConsumableBlock {
	protected outputStream: Stream<any>;
	
	constructor(
			binarySwitch: Stream<number>,
			elseValue: Stream<any>,
			thenValue: Stream<any> ) {
		super();
		this.outputStream = combine<number, any, any, any>( ( binarySwitch: number, elseValue: any, thenValue: any ) => {
			return binarySwitch !== 0 ? thenValue : elseValue;
		}, binarySwitch, elseValue, thenValue );
	}
	
	public getOutputStream( index: number ): Stream<any> {
		return this.outputStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 1 ];
	}
}