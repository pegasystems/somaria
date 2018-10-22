import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";

export class ArithmeticBlock extends ConsumableBlock {
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
			case "+":
				value = left + right; 
				break;
			case "-":
				value = left - right;
				break;
			case "*":
				value = left * right;
				break;
			case "/":
				value = left / right;
				break;
			case "%":
				value = left % right;
				break;
			case "^":
				value = Math.pow( left, right );
				break;
			default:
				break;
		}
		return value;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "+" ];
	}
}