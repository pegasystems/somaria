import { IteratorScopedBlock } from "./IteratorScopedBlock";
import { BlockInput as Input } from "../BlockInput";
import { IteratorBlockScope } from "../IteratorBlockScope";

export class VariableListBlock extends IteratorScopedBlock {
	constructor(
			blockId: string,
			iteratorScope: IteratorBlockScope,
			protected readonly value: Input<any>,
			protected readonly sample: Input<number>,
			protected readonly isPersisted: Input<number>
			) {
		super( blockId, iteratorScope );
	}
	
	public getOutputValue( index: number ): any[] {
		let list = this.iteratorScope.getVariableValue( this.blockId );

		if( list === undefined || ( !this.isPersisted.getValue() && this.iteratorScope.currentIndex === 0 ) ) {
			list = [];
			this.iteratorScope.setVariableValue( this.blockId, list );
		}

		if( this.sample.getValue() !== 0 ) {
			list.push( this.value.getValue() );
		}
		
		return list;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ "Value", 1, 1 ];
	}
}