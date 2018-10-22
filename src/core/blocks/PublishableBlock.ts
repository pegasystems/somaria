import { Block } from "../Block";
import { BlockInput } from "../BlockInput";
import { BlockInputFactory } from "../BlockInputFactory";
import { RenderingContext } from "../RenderingContext";

export abstract class PublishableBlock extends Block {
	protected publishedOutputs: Map<string, BlockInput<any>>;
	protected renderingContext: RenderingContext;

	public abstract getPublishedOutputValue( reference: string ): any;
	
	protected setPublishedOutputs( publishedOutputs: Map<string, BlockInput<any>> ): void {
		this.publishedOutputs = publishedOutputs;
	}

	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): PublishableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as PublishableBlock;
		const publishedOutputs = new Map<string, BlockInput<any>>();
		
		for( const blockInput of blockData.publishedOutputs ) {
			const input: BlockInput<any> = BlockInputFactory.fromData( blockInput, undefined, renderingContext );
			publishedOutputs.set( blockInput.id, input );
		}

		block.setPublishedOutputs( publishedOutputs );
		block.setRenderingContext( renderingContext );

		return block;
	}
}