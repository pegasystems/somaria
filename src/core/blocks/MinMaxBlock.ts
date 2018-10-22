import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class MinMaxBlock extends ConsumableBlock {
	private static MIN_INDEX: number = 0;
	private static MAX_INDEX: number = 0;
	
	protected min: number;
	protected max: number;
	
	constructor( protected readonly values: Input<number[]> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		if( this.values.hasChanged() ) {
			const values = this.values.getValue();
			if( values.length > 0 ) {
				this.min = values[ 0 ];
				this.max = values[ 0 ];
				
				for( let i = 1; i < values.length; i++ ) {
					const value = values[ i ];
					if( value < this.min ) {
						this.min = value;
					}
					else if( value > this.max ) {
						this.max = value;
					}
				}
			}
			else {
				this.min = 0;
				this.max = 0;
			}
		}
		
		if( index === MinMaxBlock.MIN_INDEX ) {
			return this.min;
		}
		else {
			return this.max;
		}
	}
	
	public static getDefaultInputValues(): any[] {
		return [ [] ];
	}
}