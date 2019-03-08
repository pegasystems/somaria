import { Block } from "../Block";
import { Drawable } from "../Drawable";
import { RenderingContext } from "../RenderingContext";
import { InteractionBlock } from "./InteractionBlock";
import * as THREE from "three";
import * as most from "most";

export abstract class AbstractDrawableBlock extends Block implements Drawable {
	private interactionBlock: InteractionBlock;
	protected renderingContext: RenderingContext;
	protected isEnabled: boolean;
	protected objects: THREE.Object3D[];

	constructor( isEnabled: most.Stream<number> ) {
		super();
		this.isDrawable = true;
		this.isEnabled = false;
		this.observe( isEnabled.map( isEnabled => this.isEnabled = ( isEnabled !== 0 ) ) );
		this.objects = [];
	}

	public getObjects(): THREE.Object3D[] {
		if( this.isEnabled ) {
			return this.objects;
		}
		else {
			return [];
		}
	}

	protected setupInteractions( interactionBlock: InteractionBlock ): void {
		for( const object of this.objects ) {
			interactionBlock.setDrawable( object );
		}
	}
	
	protected observe( stream: most.Stream<any> ) {
		stream.observe( value => this.renderingContext.animationManager.requestFrame() );
	}
	
	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): AbstractDrawableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as AbstractDrawableBlock;
		if( blockData.interactionId ) {
			block.setupInteractions( renderingContext.interpretBlockById( blockData.interactionId ) as InteractionBlock );
		}
		block.setRenderingContext( renderingContext );
		return block;
	}
}