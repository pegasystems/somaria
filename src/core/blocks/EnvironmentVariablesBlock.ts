import { Block } from "../Block";
import { RenderingContext } from "../RenderingContext";

export class EnvironmentVariablesBlock extends Block {
	private renderingContext: RenderingContext;
	constructor() {
		super();
	}
	
	public getOutputValue( index: number ): any {
		if( index === 2 ) {
			return this.renderingContext.config.backgroundColor;
		}
		
		const pixelWorldRatio = this.renderingContext.scalingManager.getPixelWorldRatio();
		const canvasSize = this.renderingContext.getRenderer().getSize();
		
		switch( index ) {
			case 0:
				return canvasSize.width / pixelWorldRatio;
			case 1:
				return canvasSize.height / pixelWorldRatio;
			default:
				return undefined;
		}
	}
	
	public setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): EnvironmentVariablesBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as EnvironmentVariablesBlock;
		block.setRenderingContext( renderingContext );
		return block;
	}
}