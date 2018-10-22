import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class BoundsBlock extends ConsumableBlock {
	constructor( protected readonly bounds: Input<Bounds> ) {
		super();
	}

	public getOutputValue( index: number ): number {
		const bounds = this.bounds.getValue();
		return [ bounds.min, bounds.max ][ index ];
	}

	public static getDefaultInputValues(): any {
		return [ {} ];
	}
}