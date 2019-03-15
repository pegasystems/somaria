import { IteratorScopedBlock } from "./IteratorScopedBlock";
import { RenderingContext } from "../RenderingContext";
import { Stream, of as streamOf } from "most";

export class IteratorVariablesBlock extends IteratorScopedBlock {
	protected outputStreams: Stream<number>[];

	public getOutputStream( index: number ): Stream<number> {
		return this.outputStreams[ index ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): IteratorVariablesBlock {
		const block = IteratorScopedBlock.fromData( blockType, blockData, renderingContext ) as IteratorVariablesBlock;
		block.outputStreams = [
			block.iteratorScope.iterationCount,
			streamOf( block.iteratorScope.currentIndex )
		];
		return block;
	}
}