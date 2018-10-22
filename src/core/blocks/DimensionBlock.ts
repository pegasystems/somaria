import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class DimensionBlock extends ConsumableBlock {
	constructor( protected readonly dimension: Input<Dimension> ) {
		super();
	}

	public getOutputValue( index: number ): any {
		const dimension = this.dimension.getValue();
		return [ dimension.title, dimension.labels, dimension.bounds, dimension.series, dimension.childSet ][ index ];
	}

	public static getDefaultInputValues(): any {
		return [ {} ];
	}
}