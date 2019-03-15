import { IteratorScopedBlock } from "./IteratorScopedBlock";
import { BlockInput as Input } from "../BlockInput";
import { IteratorBlockScope } from "../IteratorBlockScope";

export class RunningTotalBlock extends IteratorScopedBlock {
	constructor(
			blockId: string,
			iteratorScope: IteratorBlockScope,
			protected readonly value: Input<number> ) {
		super( blockId, iteratorScope );
	}

	public getOutputValue( index: number ): number {
		let total = 0;
		if( this.iteratorScope.currentIndex !== 0 ) {
			total = this.iteratorScope.getVariableValue( this.blockId );
		}
		total += this.value.getValue();
		this.iteratorScope.setVariableValue( this.blockId, total );
		return total;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0 ];
	}
}