import { IteratorScopedBlock } from "./IteratorScopedBlock";
import { RenderingContext } from "../RenderingContext";
import * as most from "most";

export class IteratorVariablesBlock extends IteratorScopedBlock {
	protected outputStreams: most.Stream<number>[];

	public getOutputStream( index: number ): most.Stream<number> {
		return this.outputStreams[ index ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): IteratorVariablesBlock {
		const block = IteratorScopedBlock.fromData( blockType, blockData, renderingContext ) as IteratorVariablesBlock;
		block.outputStreams = [
			block.iteratorScope.iterationCount,
			most.of( block.iteratorScope.currentIndex )
		];
		return block;
	}
}