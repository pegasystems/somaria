import { ConsumableBlock } from "./ConsumableBlock";
import { Block } from "../Block";
import { RenderingContext } from "../RenderingContext";
import { IteratorBlockScope } from "../IteratorBlockScope";

export abstract class IteratorScopedBlock extends ConsumableBlock {
	protected renderingContext: RenderingContext;

	constructor( protected readonly blockId: string, protected readonly iteratorScope: IteratorBlockScope ) {
		super();
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): IteratorScopedBlock {
		const blockInputs = Block.createBlockInputs( blockType, blockData, renderingContext );
		const block: IteratorScopedBlock = new blockType( blockData.id, renderingContext.getIteratorBlockScope(), ...blockInputs );
		block.renderingContext = renderingContext;
		return block;
	}
}
