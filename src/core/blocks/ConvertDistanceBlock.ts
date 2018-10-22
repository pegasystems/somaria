import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";

export class ConvertDistanceBlock extends ConsumableBlock {
	protected scalingManager: ScalingManager;
	
	constructor(
			protected readonly distance: Input<number>,
			protected readonly convertTo: Input<string> ) {
		super();
	}
	
	public getOutputValue( index: number ): number {
		const pixelWorldRatio = this.scalingManager.getPixelWorldRatio();
		let distance = this.distance.getValue();
		switch( this.convertTo.getValue() ) {
			case "pixels":
				distance = distance * pixelWorldRatio;
				break;
			case "units":
				distance = distance / pixelWorldRatio;
				break;
			default:
				break;
		}
		return distance;
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, "pixels" ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): ConvertDistanceBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as ConvertDistanceBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}