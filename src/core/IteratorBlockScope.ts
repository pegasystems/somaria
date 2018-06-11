import { BlockScope } from "./BlockScope";
import * as DrawableUtils from "./utils/DrawableUtils";
import * as most from "most";

export class IteratorBlockScope extends BlockScope {
	public iterationCount: most.Stream<number>;
	public currentIndex: number;
	protected variables: Map<string, any>;
	protected iterationScopes: BlockScope[];

	constructor( blocksData: Map<BlockId, BlockJSON>, parent: BlockScope ) {
		super( blocksData, parent );
		this.variables = new Map<string, any>();
		this.iterationScopes = [];
		this.currentIndex = 0;
	}
	
	public setIterationCount( iterationCount: most.Stream<number> ) {
		this.iterationCount = iterationCount.tap( count => this.setBlockScopeCount( count ) );
		this.iterationCount.drain();
	}

	protected setBlockScopeCount( count: number ): void {
		while( this.iterationScopes.length > count ) {
			const scope = this.iterationScopes.pop();
			for( const drawable of scope.getAllDrawables() ) {
				for( const object3D of drawable.getObjects() ) {
					DrawableUtils.disposeObject( object3D );
				}
			}
		}
		
		while( this.iterationScopes.length < count ) {
			this.currentIndex = this.iterationScopes.length;
			this.iterationScopes.push( new BlockScope( this.blocksData, this ) );
		}
		
		this.currentIndex = 0;
	}

	public setVariableValue( name: string, value: any ): void {
		this.variables.set( name, value );
	}

	public getVariableValue( name: string ): any {
		return this.variables.get( name );
	}

	public getScopeForCurrentIteration(): BlockScope {
		return this.iterationScopes[ this.currentIndex ];
	}
	
	public static fromData( blocks: BlockJSON[], parent: BlockScope ): IteratorBlockScope {
		return new IteratorBlockScope( BlockScope.createBlockData( blocks ), parent );
	}
}