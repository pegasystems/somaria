import { ConsumableBlock } from "./ConsumableBlock";
import { Stream, combine } from "most";

type Operation = ( left: number, right: number ) => number;

const operations = new Map<string, Operation>( [
	[ "+", ( left: number, right: number ): number => left + right ],
	[ "-", ( left: number, right: number ): number => left - right ],
	[ "*", ( left: number, right: number ): number => left * right ],
	[ "/", ( left: number, right: number ): number => left / right ],
	[ "%", ( left: number, right: number ): number => left % right ],
	[ "^", ( left: number, right: number ): number => Math.pow( left, right ) ]
] );

export class ArithmeticBlock extends ConsumableBlock {
	protected outputStream: Stream<number>;
	
	constructor(
			left: Stream<number>,
			right: Stream<number>,
			operator: Stream<string> ) {
		super();
		
		const operation = operator.map( ( operator: string ) => {
			let operation = operations.get( operator );
			if( operation === undefined ) {
				operation = operations.get( "+" );
			}
			return operation;
		} );
		
		this.outputStream = combine<number, number, Operation, number>( ( left: number, right: number, operation: Operation ): number => {
			return operation( left, right );
		}, left, right, operation );
	}
	
	public getOutputStream( index: number ): Stream<number> {
		return this.outputStream;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, "+" ];
	}
}