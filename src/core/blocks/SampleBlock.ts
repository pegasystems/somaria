import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class SampleBlock extends ConsumableBlock {
	constructor(
			protected readonly startValue: Input<number>,
			protected readonly endValue: Input<number>,
			protected readonly numSamples: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): number[] {
		const numSamples = this.numSamples.getValue();
		if( numSamples === 0 ) {
			return [];
		}
		
		const startValue = this.startValue.getValue();
		const endValue = this.endValue.getValue();
		const samples = [ startValue ];
		for( let i = 1; i < numSamples; i++ ) {
			samples[ i ] = startValue + ( endValue - startValue ) * i / ( numSamples - 1 );
		}
		
		return samples;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1, 10, 10 ];
	}
}