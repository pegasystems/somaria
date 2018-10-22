import { IteratorScopedBlock } from "./IteratorScopedBlock";
import { BlockInput as Input } from "../BlockInput";
import { IteratorBlockScope } from "../IteratorBlockScope";

export class VariableBlock extends IteratorScopedBlock {
	constructor(
			blockId: string,
			iteratorScope: IteratorBlockScope,
			protected readonly newValue: Input<any>,
			protected readonly sample: Input<number>,
			protected readonly reset: Input<number>,
			protected readonly resetValue: Input<any> ) {
		super( blockId, iteratorScope );
	}
	
	public getOutputValue( index: number ): any {
		const oldValue = this.iteratorScope.getVariableValue( this.blockId );
		let value = oldValue;
		if( this.sample.getValue() !== 0 ) {
			value = this.newValue.getValue();
			this.iteratorScope.setVariableValue( this.blockId, value );
		}
		else if( value === undefined || this.reset.getValue() !== 0 ) {
			value = this.resetValue.getValue();
			this.iteratorScope.setVariableValue( this.blockId, value );
		}
		return value;
	}

	public static getDefaultInputValues(): any[] {
		return [ "Value", 0, 1, "" ];
	}
}