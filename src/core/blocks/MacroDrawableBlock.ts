import { Block } from "../Block";
import { Leaf } from "../Leaf";
import { Drawable } from "../Drawable";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";
import { BlockScope } from "../BlockScope";
import * as THREE from "three";

export class MacroDrawableBlock extends Block implements Drawable {
	protected scope: BlockScope;
	protected drawables: BlockId[];
	protected leafs: BlockId[];
	protected renderingContext: RenderingContext;
	protected objects: THREE.Object3D[];
	
	constructor( public readonly isEnabled: Input<boolean> ) {
		super();
		this.isDrawable = true;
	}
	
	public create3dObjects(): THREE.Object3D[] {
		this.renderingContext.setScope( this.scope );
		this.objects = [];
		
		for( const drawableId of this.drawables ) {
			const drawableBlock = this.renderingContext.interpretBlockById( drawableId ) as Block & Drawable;
			if( drawableBlock.isEnabled.getValue() ) {
				this.objects = this.objects.concat( drawableBlock.create3dObjects() );
			}
		}
		this.processLeafs();
		this.renderingContext.setScope( this.scope.parent );
		return this.objects;
	}

	public getObjects(): THREE.Object3D[] {
		return this.objects;
	}

	protected processLeafs(): void {
		if( this.leafs ) {
			for ( const leafId of this.leafs ) {
				const block = this.renderingContext.interpretBlockById( leafId ) as Block & Leaf;
				block.execute();
			}
		}
	}

	protected setLeafs( leafs: BlockId[] ): void {
		this.leafs = leafs;
	}
	
	protected createScope( blocks: BlockJSON[], parent: BlockScope ): void {
		this.scope = BlockScope.fromData( blocks, parent );
	}
	
	protected setDrawables( drawables: BlockId[] ): void {
		this.drawables = drawables;
	}

	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): MacroDrawableBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as MacroDrawableBlock;
		
		block.setRenderingContext( renderingContext );
		
		block.createScope( blockData.blocks || [], renderingContext.getScope() );
		
		block.setDrawables( blockData.drawables || [] );
		
		block.setLeafs( blockData.leafs );
		
		return block;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ true ];
	}
}