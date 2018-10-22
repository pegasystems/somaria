import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";

export class WaitBlock extends ConsumableBlock {
	private renderingContext: RenderingContext;
	private doneWaiting: number;

	constructor( protected readonly duration: Input<number> ) {
		super();
		this.doneWaiting = 0;
	}

	public getOutputValue( index: number ): number {
		if( this.duration.hasChanged() && this.duration.getValue() > 0 ) {
			window.setTimeout( () => {
				this.doneWaiting = 1;
				this.renderingContext.animationManager.requestFrame();
			}, this.duration.getValue() * 1000 );
		}
		return this.doneWaiting;
	}

	public setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0 ];
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): WaitBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as WaitBlock;
		block.setRenderingContext( renderingContext );
		return block;
	}
}
