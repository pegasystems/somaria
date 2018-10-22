import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class FlattenMatrixBlock extends ConsumableBlock {
	protected merged: any[];
	constructor( protected readonly matrix: Input<any[]> ) {
		super();
	}

	public getOutputValue( index: number ): any[] {		
		if( this.matrix.hasChanged() ) {
			const list = this.matrix.getValue();
			this.merged = this.flatten( list );
		}
		return this.merged;
	}

	public static getDefaultInputValues(): any[] {
		return [ [] ];
	}

	protected flatten( arr: any[] ): any[] {
		let result = [];

		for( let i = 0, length = arr.length; i < length; i++ ) {
			const value = arr[i];
			if( Array.isArray( value ) ) {
				result = result.concat( this.flatten( value ) );
			}
			else {
				result.push( value );
			}
		}
		return result;
	}
}