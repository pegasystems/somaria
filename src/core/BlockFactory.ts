import { Block } from "./Block";
import { BlockTypes } from "./BlockTypes";
import { RenderingContext } from "./RenderingContext";

export class BlockFactory {
	public static fromData( blockData: BlockJSON, renderingContext: RenderingContext ): Block {
		const blockType = BlockTypes.get( blockData.type );

		return blockType.fromData( blockType, blockData, renderingContext );
	}
}