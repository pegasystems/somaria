import { ConsumableBlock } from "./ConsumableBlock";
import { Block } from "../Block";
import { RenderingContext } from "../RenderingContext";
import { IteratorBlockScope } from "../IteratorBlockScope";

export abstract class IteratorScopedBlock extends ConsumableBlock {
	protected renderingContext: RenderingContext;
	protected blockId: string;
	protected iteratorScope: IteratorBlockScope;

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): IteratorScopedBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as IteratorScopedBlock;
		block.renderingContext = renderingContext;
		block.blockId = blockData.id;
		block.iteratorScope = renderingContext.getIteratorBlockScope();
		return block;
	}
}
