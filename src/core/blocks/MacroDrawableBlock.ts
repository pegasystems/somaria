import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { Block } from "../Block";
import { Leaf } from "../Leaf";
import { Drawable } from "../Drawable";
import { RenderingContext } from "../RenderingContext";
import { BlockScope } from "../BlockScope";
import * as THREE from "three";
import { Stream } from "most";

export class MacroDrawableBlock extends AbstractDrawableBlock {
	protected scope: BlockScope;
	protected drawables: BlockId[];
	protected leafs: BlockId[];
	
	constructor( isEnabled: Stream<number> ) {
		super( isEnabled );
	}
	
	public getObjects(): THREE.Object3D[] {
		this.renderingContext.setScope( this.scope );
		let objects = [];
		
		for( const drawableId of this.drawables ) {
			const drawableBlock = this.renderingContext.interpretBlockById( drawableId ) as Block & Drawable;
			objects = objects.concat( drawableBlock.getObjects() );
		}
		this.processLeafs();
		this.renderingContext.setScope( this.scope.parent );
		return objects;
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
	
	protected createScope( blocks: BlockJSON[] = [], parent: BlockScope ): void {
		this.scope = BlockScope.fromData( blocks, parent );
	}
	
	protected setDrawables( drawables: BlockId[] = [] ): void {
		this.drawables = drawables;
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): MacroDrawableBlock {
		const block = AbstractDrawableBlock.fromData( blockType, blockData, renderingContext ) as MacroDrawableBlock;
		
		block.createScope( blockData.blocks, renderingContext.getScope() );
		
		block.setDrawables( blockData.drawables );
		
		block.setLeafs( blockData.leafs );
		
		return block;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1 ];
	}
}