import { MacroBlock } from "./MacroBlock";
import { BlockScope } from "../BlockScope";
import { BlockInputFactory } from "../BlockInputFactory";
import { IteratorBlockScope } from "../IteratorBlockScope";
import { Sink } from "../Sink";
import { Stream } from "most";

export class IteratorBlock extends MacroBlock {
	protected scope: IteratorBlockScope;
	protected publishedOutputSinks: Map<string, Sink<any>>;

	constructor( protected iterationCount: Stream<number> ) {
		super();
		this.publishedOutputSinks = new Map<string, Sink<any>>();
	}
	
	protected createScope( blocks: BlockJSON[] = [], parent: BlockScope ): void {
		this.scope = IteratorBlockScope.fromData( blocks, parent );
		this.scope.setIterationCount( this.iterationCount );
	}
	
	protected initialize( blockData: BlockJSON ): void {
		for( const publishedOutputData of blockData.publishedOutputs ) {
			const sink = new Sink();
			this.publishedOutputSinks.set( publishedOutputData.id, sink );
			this.publishedOutputs.set( publishedOutputData.id, sink.getStream() );
		}
		
		this.scope.iterationCount.observe( ( iterationCount: number ) => {
			const oldScope = this.renderingContext.getScope();
			
			for( let i = 0; i < iterationCount; i++ ) {
				this.scope.currentIndex = i;
				const currentScope = this.scope.getScopeForCurrentIteration();
				
				this.renderingContext.setScope( currentScope );
				
				for( const publishedOutputData of blockData.publishedOutputs ) {
					let publishedOutput = this.scope.getPublishedOutput( publishedOutputData.id );
					
					if( publishedOutput === undefined ) {
						publishedOutput = BlockInputFactory.fromData( publishedOutputData, undefined, this.renderingContext );
						currentScope.setPublishedOutput( publishedOutputData.id, publishedOutput );
					}
					
					if( i === iterationCount - 1 ) {
						const sink = this.publishedOutputSinks.get( publishedOutputData.id );
						sink.setSource( publishedOutput );
					}
				}
				
				for( const leafId of blockData.leafs ) {
					this.renderingContext.interpretBlockById( leafId );
				}
			}
			
			this.renderingContext.setScope( oldScope );
		} );
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 1 ];
	}
}