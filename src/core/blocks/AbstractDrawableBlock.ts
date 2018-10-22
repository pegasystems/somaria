import { Block } from "../Block";
import { BlockInput as Input } from "../BlockInput";
import { Drawable } from "../Drawable";
import { RenderingContext } from "../RenderingContext";
import { InteractionBlock } from "./InteractionBlock";
import * as THREE from "three";

export abstract class AbstractDrawableBlock extends Block implements Drawable {
	private interactionBlock: InteractionBlock;

	constructor( public readonly isEnabled: Input<boolean> ) {
		super();
		this.isDrawable = true;
		this.isEnabled = isEnabled;
	}

	public abstract create3dObjects(): THREE.Object3D[];
	public abstract getObjects(): THREE.Object3D[];

	protected setupInteractions( object3D: THREE.Object3D ): void {
		if( this.interactionBlock ) {
			this.interactionBlock.setDrawable( object3D );
		}
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): AbstractDrawableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as AbstractDrawableBlock;
		if( blockData.interactionId ) {
			block.interactionBlock = renderingContext.interpretBlockById( blockData.interactionId ) as InteractionBlock;
		}
		return block;
	}
}