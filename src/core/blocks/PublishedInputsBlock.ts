import { PublishableBlock } from "./PublishableBlock";
import { RenderingContext } from "../RenderingContext";

export class PublishedInputsBlock extends PublishableBlock {
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): PublishableBlock {
		const currentScope = renderingContext.getScope();
		renderingContext.setScope( renderingContext.getParentScope() );
		const block = PublishableBlock.fromData( blockType, blockData, renderingContext ) as PublishedInputsBlock;
		renderingContext.setScope( currentScope );
		return block;
	}
}