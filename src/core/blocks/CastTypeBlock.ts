import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class CastTypeBlock extends ConsumableBlock {
	constructor(
			protected readonly value: Input<any>,
			protected readonly type: Input<string> ) {
		super();
	}
	
	public getOutputValue( index: number ): any {
		if( this.type.getValue() === "string" ) {
			return String( this.value.getValue() );
		}
		else if( this.type.getValue() === "number" ) {
			return Number( this.value.getValue() );
		}
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, "number" ];
	}
}