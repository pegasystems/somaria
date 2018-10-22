import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

const LOG_10 = Math.log( 10 );

export class ScaleNumberBlock extends ConsumableBlock {
	constructor(
			protected readonly value: Input<number>,
			protected readonly maxDigits: Input<number> ) {
		super();
	}

	public getOutputValue( index: number ): string {
		const value = this.value.getValue();
		const maxDigits = this.maxDigits.getValue();

		let [ summary, suffix ] = this.summaryAndSuffixForNumber( value );

		const digitsLeftOfDecimalPoint = Math.max( 1, ScaleNumberBlock.numDigitsBeforeDecimalPoint( summary ) );
		const decimalPlaces = Math.max( 0, maxDigits - digitsLeftOfDecimalPoint );
		
		if( maxDigits > 0 ) {
			summary = ScaleNumberBlock.roundToDecimalPlace( summary, decimalPlaces );
			if( suffix !== "" ) {
				return summary.toFixed( decimalPlaces ) + suffix;
			}
		}
		
		return summary + suffix;
	}
	
	public static roundToDecimalPlace( value: number, decimalPlace: number ): number {
		const multiplier = Math.pow( 10, decimalPlace );
		return Math.round( value * multiplier ) / multiplier;
	}
	
	public static numDigitsBeforeDecimalPoint( value: number ): number {
		if( value === 0 ) {
			return 1;
		}
		
		return Math.floor( Math.log( Math.abs( value ) ) / LOG_10 + 1 );
	}

	public summaryAndSuffixForNumber( value: number ): [number, string] {
		const suffixes = [ "", "K", "M", "B", "T" ];
		let index = 0;
		let summary = value;
		while ( Math.abs( summary ) >= 1000 && index < ( suffixes.length - 1 ) ) {
			index++;
			summary = summary / 1000;
		}
		return [ summary, suffixes[index] ];
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0 ];
	}
}