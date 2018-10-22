import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class LookupIndexedBlock extends ConsumableBlock {
	constructor(
			protected readonly list: Input<any[]>,
			protected readonly index: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): any {
		const list = this.list.getValue();
		let value;
		
		if( list !== null && list !== undefined ) {
			value = list[ this.index.getValue() ];
		}
		
		return value;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ [], 0 ];
	}
}