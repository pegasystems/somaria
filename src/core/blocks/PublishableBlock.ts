import { Block } from "../Block";
import { RenderingContext } from "../RenderingContext";
import { Stream } from "most";

export abstract class PublishableBlock extends Block {
	protected publishedOutputs: Map<string, Stream<any>>;
	protected renderingContext: RenderingContext;

	constructor() {
		super();
		this.publishedOutputs = new Map<string, Stream<any>>();
	}
	
	public getPublishedOutputStream( reference: string ): Stream<any> {
		return this.publishedOutputs.get( reference );
	}

	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): PublishableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as PublishableBlock;
		
		block.setRenderingContext( renderingContext );

		return block;
	}
}