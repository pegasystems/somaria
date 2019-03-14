import { Block } from "../Block";
import { PublishableBlock } from "./PublishableBlock";
import { RenderingContext } from "../RenderingContext";
import { BlockScope } from "../BlockScope";
import { BlockInputFactory } from "../BlockInputFactory";

export class MacroBlock extends PublishableBlock {
	protected scope: BlockScope;

	protected initialize( blockData: BlockJSON ): void {
		this.renderingContext.setScope( this.scope );
		
		for( const blockInput of blockData.publishedOutputs ) {
			const inputStream = BlockInputFactory.fromData( blockInput, undefined, this.renderingContext );
			this.publishedOutputs.set( blockInput.id, inputStream );
		}
		
		for( const leafId of blockData.leafs ) {
			this.renderingContext.interpretBlockById( leafId );
		}
		
		this.renderingContext.setScope( this.scope.parent );
	}

	protected createScope( blocks: BlockJSON[], parent: BlockScope ): void {
		this.scope = BlockScope.fromData( blocks, parent );
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): MacroBlock {
		const block = PublishableBlock.fromData( blockType, blockData, renderingContext ) as MacroBlock;
		
		block.createScope( blockData.blocks, renderingContext.getScope() );
		
		block.initialize( blockData );
		
		return block;
	}
}