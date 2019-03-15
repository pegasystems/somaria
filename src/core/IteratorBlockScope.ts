import { BlockScope } from "./BlockScope";
import * as DrawableUtils from "./utils/DrawableUtils";
import { Stream } from "most";

export class IteratorBlockScope extends BlockScope {
	public iterationCount: Stream<number>;
	public currentIndex: number;
	protected variables: Map<string, any>;
	protected iterationScopes: BlockScope[];

	constructor( blocksData: Map<BlockId, BlockJSON>, parent: BlockScope ) {
		super( blocksData, parent );
		this.variables = new Map<string, any>();
		this.iterationScopes = [];
		this.currentIndex = 0;
	}
	
	public setIterationCount( iterationCount: Stream<number> ): void {
		this.iterationCount = iterationCount.tap( ( count: number ) => this.setBlockScopeCount( count ) );
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
			const newScope = new BlockScope( this.blocksData, this );
			this.iterationScopes.push( newScope );
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