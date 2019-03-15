import { Configuration } from "./Configuration";
import { BlockInputFactory } from "./BlockInputFactory";
import { RenderingContext } from "./RenderingContext";
import { Stream } from "most";

export abstract class Block {
	public isDrawable: boolean = false;
	
	public static getDefaultInputValues( config: Configuration, renderingContext: RenderingContext ): any[] {
		return []; // abstract
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): Block {
		const block: Block = new blockType( ...Block.createBlockInputs( blockType, blockData, renderingContext ) );
		return block;
	}
	
	protected static createBlockInputs( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): Stream<any>[] {
		const defaultValues = blockType.getDefaultInputValues( renderingContext.config, renderingContext );
		
		const blockInputs = new Array( blockType.length );
		
		if( blockData.inputs === undefined ) {
			blockData.inputs = [];
		}
		
		for( let i = 0; i < blockType.length; i++ ) {
			const blockInput = BlockInputFactory.fromData( blockData.inputs[ i ], defaultValues[ i ], renderingContext );
			blockInputs[ i ] = blockInput;
		}
		
		return blockInputs;
	}
}