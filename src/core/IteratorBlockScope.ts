import { BlockScope } from "./BlockScope";
import * as DrawableUtils from "./utils/DrawableUtils";

export class IteratorBlockScope extends BlockScope {
	protected iterationCount: number;
	public currentIndex: number;
	protected variables: Map<string, any>;
	protected iterationScopes: BlockScope[];

	constructor( blocksData: Map<BlockId, BlockJSON>, parent: BlockScope ) {
		super( blocksData, parent );
		this.variables = new Map<string, any>();
		this.iterationScopes = [];
	}

	public setIterationCount( iterationCount: number ): void {
		this.iterationCount = iterationCount;
		
		while( this.iterationScopes.length > iterationCount ) {
			const scope = this.iterationScopes.pop();
			for( const drawable of scope.getAllDrawables() ) {
				for( const object3D of drawable.getObjects() ) {
					DrawableUtils.disposeObject( object3D );
				}
			}
		}
		
		while( this.iterationScopes.length < iterationCount ) {
			const iterationScope = new BlockScope( this.blocksData, this );
			const publishedInputsBlock = this.getBlock( "PublishedInputs" );
			if( publishedInputsBlock !== undefined ) {
				iterationScope.setBlock( "PublishedInputs", publishedInputsBlock );
			}
			this.iterationScopes.push( iterationScope );
		}
	}

	public setVariableValue( name: string, value: any ): void {
		this.variables.set( name, value );
	}

	public getIterationCount(): number {
		return this.iterationCount;
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