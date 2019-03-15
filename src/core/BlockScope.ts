import { Block } from "./Block";
import { Drawable } from "./Drawable";
import { Stream } from "most";

export class BlockScope {
	protected blocks: Map<BlockId, Block>;
	protected publishedOutputs: Map<string, Stream<any>>;
	
	constructor(
			protected blocksData: Map<BlockId, BlockJSON>,
			public parent: BlockScope ) {
		this.blocks = new Map<BlockId, Block>();
		this.publishedOutputs = new Map<string, Stream<any>>();
	}
	
	public setBlock( blockId: BlockId, block: Block ): void {
		this.blocks.set( blockId, block );
	}
	
	public getBlock( blockId: BlockId ): Block {
		return this.blocks.get( blockId );
	}
	
	public setPublishedOutput( id: string, output: Stream<any> ): void {
		this.publishedOutputs.set( id, output );
	}
	
	public getPublishedOutput( id: string ): Stream<any> {
		return this.publishedOutputs.get( id );
	}

	public getAllDrawables(): ( Block & Drawable )[] {
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