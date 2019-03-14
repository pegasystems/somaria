import { RenderingContext } from "./RenderingContext";
import { PublishableBlock } from "./blocks/PublishableBlock";
import { ConsumableBlock } from "./blocks/ConsumableBlock";
import * as most from "most";
import { Signal } from "./Signal";

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
				const signal = new Signal( defaultValue );
				renderingContext.setExternalInput( input.id, signal );
				stream = signal.getStream();
				return stream;
				break;
			default:
				stream = most.of( defaultValue );
		}
		
		return stream.map( ( value: any ) => sanitize( value, defaultValue ) );
	}
}