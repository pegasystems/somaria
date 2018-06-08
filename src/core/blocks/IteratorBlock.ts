import { Leaf } from "../Leaf";
import { MacroBlock } from "./MacroBlock";
import { BlockScope } from "../BlockScope";
import { BlockInput as Input } from "../BlockInput";
import { IteratorBlockScope } from "../IteratorBlockScope";
import { RenderingContext } from "../RenderingContext";

export class IteratorBlock extends MacroBlock implements Leaf {
	protected scope: IteratorBlockScope;
	protected leafs: BlockId[];

	constructor(
		protected readonly iterationCount: Input<number> ) {
		super();
	}

	public getPublishedOutputValue( reference: string ): any {
		const output = this.publishedOutputs.get( reference );
		
		if( !output.isCached() ) {
			const oldScope = this.renderingContext.getScope();
			const iterationCount = this.iterationCount.getValue();
			this.scope.setIterationCount( iterationCount );
			for( let i = 0; i < iterationCount; i++ ) {
				this.scope.currentIndex = i;
				this.renderingContext.setScope( this.scope.getScopeForCurrentIteration() );
				this.publishedOutputs.forEach( ( output: Input<any>, reference: BlockId ) => {
					if( i === iterationCount - 1 ) {
						output.getValue();
					}
					else {
						output.getUncachedValue();
					}
				} );
			}
			this.renderingContext.setScope( oldScope );
		}
		
		if ( this.iterationCount.getValue() === 0 ) {
			return undefined;
		}
		else {
			return output.getValue();
		}
	}
	
	protected createScope( blocks: BlockJSON[], parent: BlockScope ): void {
		this.scope = IteratorBlockScope.fromData( blocks, parent );
	}

	public execute(): void {
		if( this.leafs ) {
			const oldScope = this.renderingContext.getScope();
			const iterationCount = this.iterationCount.getValue();
			this.scope.setIterationCount( iterationCount );
			for( let i = 0; i < iterationCount; i++ ) {
				this.scope.currentIndex = i;
				this.renderingContext.setScope( this.scope.getScopeForCurrentIteration() );
				this.processLeafs();
			}
			this.renderingContext.setScope( oldScope );
		}
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1 ];
	}
}