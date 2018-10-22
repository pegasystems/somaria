import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class LogicalOperatorBlock extends ConsumableBlock {
	constructor(
			protected readonly left: Input<number>,
			protected readonly right: Input<number>,
			protected readonly operator: Input<string> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		let value = 0;
		const left = this.left.getValue() !== 0;
		const right = this.right.getValue() !== 0;
		
		switch( this.operator.getValue() ) {
			case "AND":
				value = left && right ? 1 : 0;
				break;
			case "OR":
				value = left || right ? 1 : 0;
				break;
			case "XOR":
				value = left !== right ? 1 : 0;
				break;
			case "NAND":
				value = !( left && right ) ? 1 : 0;
				break;
			case "NOR":
				value = !( left || right ) ? 1 : 0;
				break;
			case "NXOR":
				value = left === right ? 1 : 0;
				break;
			default:
		}
		
		return value;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "AND" ];
	}
}
