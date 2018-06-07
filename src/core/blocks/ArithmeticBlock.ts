import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

const operations = new Map( [
	[ "+", ( left, right ) => left + right ],
	[ "-", ( left, right ) => left - right ],
	[ "*", ( left, right ) => left * right ],
	[ "/", ( left, right ) => left / right ],
	[ "%", ( left, right ) => left % right ],
	[ "^", ( left, right ) => Math.pow( left, right ) ]
] );

export class ArithmeticBlock extends ConsumableBlock {
	protected outputStream: most.Stream<number>;
	
	constructor(
			left: most.Stream<number>,
			right: most.Stream<number>,
			operator: most.Stream<string> ) {
		super();
		this.outputStream = most.combine<number, number, string, number>( ( left: number, right: number, operator: string ): number => {
			return operations.get( operator )( left, right );
		}, left, right, operator );
	}
	
	public getOutputStream( index: number ): most.Stream<number> {
		return this.outputStream;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "+" ];
	}
}