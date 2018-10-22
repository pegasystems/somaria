import { Block } from "./Block";
import { Drawable } from "./Drawable";

export class BlockScope {
	protected blocksData: Map<BlockId, BlockJSON>;
	protected blocks: Map<BlockId, Block>;
	public parent: BlockScope;
	
	constructor( blocksData: Map<BlockId, BlockJSON>, parent: BlockScope ) {
		this.blocksData = blocksData;
		this.blocks = new Map<BlockId, Block>();
		this.parent = parent;
	}
	
	public setBlock( blockId: BlockId, block: Block ): void {
		this.blocks.set( blockId, block );
	}
	
	public getBlock( blockId: BlockId ): Block {
		return this.blocks.get( blockId );
	}

	public getAllDrawables(): Array< Block & Drawable > {
		const drawables = [];
		this.blocks.forEach( ( block: Block, blockId: BlockId ) => {
			if( block.isDrawable ) {
				drawables.push( block );
			}
		} );
		return drawables;
	}

	public getBlockData( blockId: BlockId ): BlockJSON {
		return this.blocksData.get( blockId );
	}

	protected static createBlockData( blocks: BlockJSON[] ): Map<BlockId, BlockJSON> {
		const blocksData = new Map<BlockId, BlockJSON>();
	
		for( const blockData of blocks ) {
			blocksData.set( blockData.id, blockData );
		}
	
		return blocksData;
	}
	
	public static fromData( blocks: BlockJSON[], parent: BlockScope ): BlockScope {
		return new BlockScope( BlockScope.createBlockData( blocks ), parent );
	}
}