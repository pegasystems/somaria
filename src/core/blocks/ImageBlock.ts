import { Block } from "../Block";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";
import * as THREE from "three";

export class ImageBlock extends ConsumableBlock {
	private static TEXTURE_INDEX: number = 0;
	private static WIDTH_INDEX: number = 1;
	private static HEIGHT_INDEX: number = 2;
	
	protected loadManager: THREE.LoadingManager;
	protected texture: THREE.Texture;
	
	constructor( protected readonly url: Input<string> ) {
		super();
		this.texture = undefined;
	}
	
	public getOutputValue( index: number ): any {
		if( this.url.hasChanged() ) {
			if( this.texture !== undefined ) {
				this.texture.dispose();
			}
			const loader = new THREE.TextureLoader( this.loadManager );
			loader.crossOrigin = "anonymous";
			this.texture = loader.load( this.url.getValue() );
		}
		
		if( index === ImageBlock.TEXTURE_INDEX ) {
			return this.texture;
		}
		else if( index === ImageBlock.WIDTH_INDEX ) {
			return this.texture.image.width;
		}
		else if( index === ImageBlock.HEIGHT_INDEX ) {
			return this.texture.image.height;
		}
	}
	
	protected setLoadManager( loadManager: THREE.LoadingManager ): void {
		this.loadManager = loadManager;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): ImageBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as ImageBlock;
		block.setLoadManager( renderingContext.loadManager );
		return block;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ "" ];
	}
}