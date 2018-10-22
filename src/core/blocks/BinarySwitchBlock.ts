import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class BinarySwitchBlock extends ConsumableBlock {
	constructor(
			protected readonly binarySwitch: Input<number>,
			protected readonly elseValue: Input<any>,
			protected readonly thenValue: Input<any> ) {
		super();
	}
	
	public getOutputValue( index: number ): any {
		if( this.binarySwitch.getValue() !== 0 ) {
			return this.thenValue.getValue();
		}
		else {
			return this.elseValue.getValue();
		}
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 1 ];
	}
}