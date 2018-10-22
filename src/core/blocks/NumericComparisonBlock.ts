import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class NumericComparisonBlock extends ConsumableBlock {
	constructor(
			protected readonly left: Input<number>,
			protected readonly right: Input<number>,
			protected readonly operator: Input<string> ) {
		super();
	}

	public getOutputValue( index: number ): number {
		let value = 0;
		const left = this.left.getValue();
		const right = this.right.getValue();

		switch( this.operator.getValue() ) {
			case "==":
				value = left === right ? 1 : 0;
				break;
			case "!=":
				value = left !== right ? 1 : 0;
				break;
			case ">":
				value = left > right ? 1 : 0;
				break;
			case "<":
				value = left < right ? 1 : 0;
				break;
			case ">=":
				value = left >= right ? 1 : 0;
				break;
			case "<=":
				value = left <= right ? 1 : 0;
				break;
			default:
		}

		return value;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "==" ];
	}
}
