import { Block } from "../Block";
import { MacroDrawableBlock } from "./MacroDrawableBlock";
import { IteratorBlockScope } from "../IteratorBlockScope";
import { BlockScope } from "../BlockScope";
import { Drawable } from "../Drawable";
import * as THREE from "three";
import * as most from "most";

export class IteratorDrawableBlock extends MacroDrawableBlock {
	protected scope: IteratorBlockScope;
	protected iterationCountStream: most.Stream<number>;
	protected iterationCount: number;

	constructor(
			isEnabled: most.Stream<number>,
			iterationCount: most.Stream<number> ) {
		super( isEnabled );
		this.iterationCountStream = iterationCount.map( count => this.iterationCount = Math.max( 0, count ) );
	}

	protected createScope( blocks: BlockJSON[] = [], parent: BlockScope ): void {
		this.scope = IteratorBlockScope.fromData( blocks, parent );
		this.scope.setIterationCount( this.iterationCountStream );
		this.observe( this.scope.iterationCount );
	}

	public getObjects(): THREE.Object3D[] {
		let objects = [];
		const oldScope = this.renderingContext.getScope();
		for( let i = 0; i < this.iterationCount; i++ ) {
			this.scope.currentIndex = i;
			this.renderingContext.setScope( this.scope.getScopeForCurrentIteration() );
			for( const drawableId of this.drawables ) {
				const drawableBlock = this.renderingContext.interpretBlockById( drawableId ) as Block & Drawable;
				objects = objects.concat( drawableBlock.getObjects() );
			}
			this.processLeafs();
		}
		this.renderingContext.setScope( oldScope );

		return objects;
	}

	public static getDefaultInputValues(): any[] {
		return [ true, 1 ];
	}
}
