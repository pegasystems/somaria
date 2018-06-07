import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

export class SampleBlock extends ConsumableBlock {
	protected sampleStream: most.Stream<number[]>;
	
	constructor(
			startValue: most.Stream<number>,
			endValue: most.Stream<number>,
			numSamples: most.Stream<number> ) {
		super();
		this.sampleStream = most.combine<number, number, number, number[]>( ( startValue, endValue, numSamples ) => {
			if( numSamples === 0 ) {
				return [];
			}
			
			const samples = [ startValue ];
			for( let i = 1; i < numSamples; i++ ) {
				samples[ i ] = startValue + ( endValue - startValue ) * i / ( numSamples - 1 );
			}
			
			return samples;
		}, startValue, endValue, numSamples );
	}
	
	public getOutputStream( index: number ): most.Stream<number[]> {
		return this.sampleStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1, 10, 10 ];
	}
}