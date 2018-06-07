import { RenderingContext } from "./RenderingContext";
import { PublishableBlock } from "./blocks/PublishableBlock";
import { ConsumableBlock } from "./blocks/ConsumableBlock";
import * as most from "most";

function sanitize( value: any, defaultValue: any ): any {
	if( value === undefined ) {
		return defaultValue;
	}
	else {
		return value;
	}
}

export class BlockInputFactory {
	protected static Value: string = "Value";
	protected static Indexed: string = "Indexed";
	protected static Published: string = "Published";
	protected static External: string = "External";
	
	public static fromData( input: BlockInputJSON, defaultValue: any, renderingContext: RenderingContext ): most.Stream<any> {
		if( input === undefined ) {
			input = {
				accessType: BlockInputFactory.Value,
				value: undefined
			};
		}
		
		if( input.accessType === BlockInputFactory.Value ) {
			return most.of( sanitize( input.value, defaultValue ) );
		}
		
		let stream;
		
		switch( input.accessType ) {
			case BlockInputFactory.Published:
				const pubishableBlock = renderingContext.interpretBlockById( input.blockId ) as PublishableBlock;
				stream = pubishableBlock.getPublishedOutputStream( input.reference );
				break;
			case BlockInputFactory.Indexed:
				const consumableBlock = renderingContext.interpretBlockById( input.blockId ) as ConsumableBlock;
				stream = consumableBlock.getOutputStream( input.index );
				break;
			case BlockInputFactory.External:
				stream = renderingContext.getExternalInput( input.id ).getStream();
				break;
			default:
				stream = most.empty();
		}
		
		return stream.map( value => sanitize( value, defaultValue ) );
	}
}