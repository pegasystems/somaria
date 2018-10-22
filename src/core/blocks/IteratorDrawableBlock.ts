import { Block } from "../Block";
import { MacroDrawableBlock } from "./MacroDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { IteratorBlockScope } from "../IteratorBlockScope";
import { BlockScope } from "../BlockScope";
import { Drawable } from "../Drawable";
import { PublishedInputsBlock } from "./PublishedInputsBlock";
import * as THREE from "three";

export class IteratorDrawableBlock extends MacroDrawableBlock {
	protected scope: IteratorBlockScope;

	constructor(
			isEnabled: Input<boolean>,
			protected readonly iterationCount: Input<number> ) {
		super( isEnabled );
	}

	protected createScope( blocks: BlockJSON[], parent: BlockScope ): void {
		this.scope = IteratorBlockScope.fromData( blocks, parent );
		
		const publishedInputsBlockData = this.scope.getBlockData( "PublishedInputs" );
		if( publishedInputsBlockData !== undefined ) {
			this.scope.setBlock( "PublishedInputs", PublishedInputsBlock.fromData( PublishedInputsBlock, publishedInputsBlockData, this.renderingContext ) );
		}
	}

	public create3dObjects(): THREE.Object3D[] {
		let objects = [];
		const iterationCount = this.sanitizeCount( this.iterationCount.getValue() );
		const oldScope = this.renderingContext.getScope();
		this.scope.setIterationCount( iterationCount );
		for( let i = 0; i < iterationCount; i++ ) {
			this.scope.currentIndex = i;
			this.renderingContext.setScope( this.scope.getScopeForCurrentIteration() );
			for( const drawableId of this.drawables ) {
				const drawableBlock = this.renderingContext.interpretBlockById( drawableId ) as Block & Drawable;
				if( drawableBlock.isEnabled.getValue() ) {
					objects = objects.concat( drawableBlock.create3dObjects() );
				}
			}
			this.processLeafs();
		}
		this.renderingContext.setScope( oldScope );

		return objects;
	}

	private sanitizeCount( value: number ): number {
		if( value < 0 ) {
			return 0;
		}
		return value;
	}

	public static getDefaultInputValues(): any[] {
		return [ true, 1 ];
	}
}
