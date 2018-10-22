import { BlockInput } from "./BlockInput";
import { BlockInputValue } from "./inputs/BlockInputValue";
import { BlockInputIndexedReference } from "./inputs/BlockInputIndexedReference";
import { BlockInputPublishedReference } from "./inputs/BlockInputPublishedReference";
import { BlockInputThemeAttributeReference } from "./inputs/BlockInputThemeAttributeReference";
import { BlockInputExternalReference } from "./inputs/BlockInputExternalReference";
import { RenderingContext } from "./RenderingContext";

export class BlockInputFactory {
	public static fromData( input: BlockInputJSON, defaultValue: any, renderingContext: RenderingContext ): BlockInput<any> {
		if( input === undefined ) {
			input = {
				accessType: BlockInput.Value
			};
		}
		
		switch( input.accessType ) {
			case BlockInput.Published:
				return new BlockInputPublishedReference( renderingContext, input.blockId, input.reference, defaultValue );
			case BlockInput.Indexed:
				return new BlockInputIndexedReference( renderingContext, input.blockId, input.index, defaultValue );
			case BlockInput.Theme:
				return new BlockInputThemeAttributeReference( renderingContext, input.themeAttributeType, defaultValue );
			case BlockInput.External:
				return new BlockInputExternalReference( renderingContext, input.id, input.themeAttributeType, input.fallbackAccessType, input.value, defaultValue );
			default:
			case BlockInput.Value:
				return new BlockInputValue( input.value, defaultValue );
		}
	}
}