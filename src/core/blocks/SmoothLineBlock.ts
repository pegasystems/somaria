import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import * as GeometryUtils from "../utils/GeometryUtils";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";

export class SmoothLineBlock extends ConsumableBlock {
	protected smoothPoints: Cartesian[];
	protected scalingManager: ScalingManager;
	protected renderedPixelWorldRatio: number;
	
	constructor(
			protected readonly points: Input<Cartesian[]>,
			protected readonly closed: Input<number> ) {
		super();
	}
	
	public getOutputValue( index: number ): Cartesian[] {
		const pixelWorldRatio = this.scalingManager.getPixelWorldRatio();

		if( this.hasPathChanged( pixelWorldRatio ) ) {
			this.smoothPoints = GeometryUtils.interpolatePoints( this.points.getValue(), pixelWorldRatio, this.closed.getValue() !== 0 );
			this.renderedPixelWorldRatio = pixelWorldRatio;
		}
		
		return this.smoothPoints;
	}
	
	protected hasPathChanged( pixelWorldRatio: number ): boolean {
		return this.points.hasChanged() || pixelWorldRatio !== this.renderedPixelWorldRatio;
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}

	public static getDefaultInputValues(): any[] {
		return [ [], 0 ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): SmoothLineBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as SmoothLineBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}