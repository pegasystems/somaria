import { Leaf } from "../Leaf";
import { Block } from "../Block";
import { BlockScope } from "../BlockScope";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";

export class EventBroadcastBlock extends Block implements Leaf {
	protected renderingContext: RenderingContext;
	protected scope: BlockScope;

	constructor(
			protected readonly trigger: Input<number>,
			protected readonly name: Input<string>,
			protected readonly data: Input<object> ) {
		super();
	}

	public execute(): void {
		if( this.trigger.getValue() !== 0 ) {
			this.renderingContext.getEventsManager().publish( this.name.getValue(), this.data.getValue() );
		}
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, "", "" ];
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): EventBroadcastBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as EventBroadcastBlock;
		block.scope = renderingContext.getScope();
		block.renderingContext = renderingContext;
		return block;
	}
}