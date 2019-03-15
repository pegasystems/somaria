import { ConsumableBlock } from "./ConsumableBlock";
import { Stream, combine } from "most";

export class SampleBlock extends ConsumableBlock {
	protected sampleStream: Stream<number[]>;
	
	constructor(
			startValue: Stream<number>,
			endValue: Stream<number>,
			numSamples: Stream<number> ) {
		super();
		this.sampleStream = combine<number, number, number, number[]>( ( startValue: number, endValue: number, numSamples: number ) => {
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
	
	public getOutputStream( index: number ): Stream<number[]> {
		return this.sampleStream;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1, 10, 10 ];
	}
}