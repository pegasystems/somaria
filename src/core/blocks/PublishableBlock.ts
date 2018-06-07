import { Block } from "../Block";
import { BlockInputFactory } from "../BlockInputFactory";
import { RenderingContext } from "../RenderingContext";
import * as most from "most";

export abstract class PublishableBlock extends Block {
	protected publishedOutputs: Map<string, most.Stream<any>>;
	protected renderingContext: RenderingContext;

	public getPublishedOutputStream( reference: string ): most.Stream<any> {
		return this.publishedOutputs.get( reference );
	}
	
	protected setPublishedOutputs( publishedOutputs: Map<string, most.Stream<any>> ): void {
		this.publishedOutputs = publishedOutputs;
	}

	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): PublishableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as PublishableBlock;
		const publishedOutputs = new Map<string, most.Stream<any>>();
		
		for( const blockInput of blockData.publishedOutputs ) {
			const input = BlockInputFactory.fromData( blockInput, undefined, renderingContext );
			publishedOutputs.set( blockInput.id, input );
		}

		block.setPublishedOutputs( publishedOutputs );
		block.setRenderingContext( renderingContext );

		return block;
	}
}