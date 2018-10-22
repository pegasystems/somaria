import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class LookupKeyedBlock extends ConsumableBlock {
	constructor(
			protected readonly structure: Input<any>,
			protected readonly key: Input<string> ) {
		super();
	}

	public getOutputValue( index: number ): any {
		const structure = this.structure.getValue();
		let value;

		if( structure !== null && structure !== undefined ) {
			value = structure[ this.key.getValue() ];
		}

		return value;
	}

	public static getDefaultInputValues(): any[] {
		return [ {}, "" ];
	}
}