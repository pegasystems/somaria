import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";

export class SmoothValueBlock extends ConsumableBlock {
	private renderingContext: RenderingContext;
	private startTime: number;
	private startValue: number;
	private endValue: number;
	private interpolatedValue: number;

	constructor(
			protected readonly value: Input<number>,
			protected readonly duration: Input<number> ) {
		super();
		this.startTime = 0;
		this.startValue = 0;
		this.endValue = 0;
		this.interpolatedValue = 0;
	}

	public getOutputValue( index: number ): number {
		const currentTime = Date.now();
		
		if( this.value.hasChanged() ) {
			this.startTime = currentTime;
			this.startValue = this.interpolatedValue;
			this.endValue = this.value.getValue();
			this.renderingContext.animationManager.requestFrame();
		}
		
		this.interpolateValue( currentTime );
		
		return this.interpolatedValue;
	}

	public interpolateValue( currentTime: number ): void {
		const duration = this.duration.getValue() * 1000;
		const elapsedTime = currentTime - this.startTime;
		
		if( elapsedTime < duration ) {
			this.interpolatedValue = ( elapsedTime / duration ) * ( this.endValue - this.startValue ) + this.startValue;
			this.renderingContext.animationManager.requestFrame();
		}
		else {
			this.interpolatedValue = this.endValue;
		}
	}

	public setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0 ];
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): SmoothValueBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as SmoothValueBlock;
		block.setRenderingContext( renderingContext );
		return block;
	}
}