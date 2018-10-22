import { Block } from "../Block";
import { ConsumableBlock } from "./ConsumableBlock";
import { RenderingContext } from "../RenderingContext";
import * as THREE from "three";

export class InteractionBlock extends ConsumableBlock {
	private static MOUSE_DOWN: number = 0;
	private static MOUSE_OVER: number = 1;

	private renderingContext: RenderingContext;
	private outputValues: number[] = [ 0, 0 ];

	public setDrawable( object3d: THREE.Object3D ): void {
		const eventHandler = this.renderingContext.getEventHandler();
		eventHandler.addEventListener( object3d, ( eventType: string, activeFlag: number ): boolean => {
			return this.setOutputValue( eventType, activeFlag );
		} );
	}

	public setOutputValue( eventType: string, activeFlag: number ): boolean {
		let needsRender: boolean = false;
		if( eventType === "mousedown" && this.outputValues[ InteractionBlock.MOUSE_DOWN ] !== activeFlag ) {
			this.outputValues[ InteractionBlock.MOUSE_DOWN ] = activeFlag;
			needsRender = true;
		}
		else if( eventType === "mouseover" && this.outputValues[ InteractionBlock.MOUSE_OVER ] !== activeFlag ) {
			this.outputValues[ InteractionBlock.MOUSE_OVER ] = activeFlag;
			needsRender = true;
		}
		return needsRender;
	}

	public getOutputValue( index: number ): number {
		return this.outputValues[ index ];
	}

	public setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): InteractionBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as InteractionBlock;
		block.setRenderingContext( renderingContext );
		return block;
	}
}