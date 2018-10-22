import { Leaf } from "../Leaf";
import { Block } from "../Block";
import { PublishableBlock } from "./PublishableBlock";
import { RenderingContext } from "../RenderingContext";
import { BlockScope } from "../BlockScope";

export class MacroBlock extends PublishableBlock implements Leaf {
	protected scope: BlockScope;
	protected leafs: BlockId[];

	public getPublishedOutputValue( reference: string ): any {
		this.renderingContext.setScope( this.scope );
		const value = this.publishedOutputs.get( reference ).getValue();
		this.renderingContext.setScope( this.scope.parent );
		return value;
	}
	
	public execute(): void {
		if( this.leafs ) {
			this.renderingContext.setScope( this.scope );
			this.processLeafs();
			this.renderingContext.setScope( this.scope.parent );
		}
	}

	protected processLeafs(): void {
		for ( const leafId of this.leafs ) {
			const block = this.renderingContext.interpretBlockById( leafId ) as Block & Leaf;
			block.execute();
		}
	}

	protected setLeafs( leafs: BlockId[] ): void {
		this.leafs = leafs;
	}

	protected createScope( blocks: BlockJSON[], parent: BlockScope ): void {
		this.scope = BlockScope.fromData( blocks, parent );
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): MacroBlock {
		const block = PublishableBlock.fromData( blockType, blockData, renderingContext ) as MacroBlock;
		
		block.setRenderingContext( renderingContext );
		
		block.createScope( blockData.blocks, renderingContext.getScope() );
		
		block.setLeafs( blockData.leafs );
		
		return block;
	}
}