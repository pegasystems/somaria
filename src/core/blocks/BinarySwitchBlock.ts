import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

export class BinarySwitchBlock extends ConsumableBlock {
	protected outputStream: most.Stream<any>;
	
	constructor(
			binarySwitch: most.Stream<number>,
			elseValue: most.Stream<any>,
			thenValue: most.Stream<any> ) {
		super();
		this.outputStream = most.combine<number,any,any,any>( ( binarySwitch, elseValue, thenValue ) => {
			return binarySwitch !== 0 ? thenValue : elseValue;
		}, binarySwitch, elseValue, thenValue );
	}
	
	public getOutputStream( index: number ): most.Stream<any> {
		return this.outputStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 1 ];
	}
}