import { ConsumableBlock } from "./ConsumableBlock";
import * as most from "most";

type Operation = ( left: number, right: number ) => number;

const operations = new Map<string, Operation>( [
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
		
		const operation = operator.map( operator => {
			let operation = operations.get( operator );
			if( operation === undefined ) {
				operation = operations.get( "+" );
			}
			return operation;
		} )
		
		this.outputStream = most.combine<number, number, Operation, number>( ( left: number, right: number, operation: Operation ): number => {
			return operation( left, right );
		}, left, right, operation );
	}
	
	public getOutputStream( index: number ): most.Stream<number> {
		return this.outputStream;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "+" ];
	}
}