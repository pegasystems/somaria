import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class SeriesBlock extends ConsumableBlock {
	constructor( protected readonly series: Input<Series> ) {
		super();
	}

	public getOutputValue( index: number ): any {
		const series = this.series.getValue();
		return [ series.title, series.values, series.childSet ][ index ];
	}

	public static getDefaultInputValues(): any {
		return [ {} ];
	}
}