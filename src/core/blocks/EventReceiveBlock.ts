import { Block } from "../Block";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";
import { EventsManager } from "../EventsManager";

export class EventReceiveBlock extends ConsumableBlock {
	protected output: any;
	protected eventsManager: EventsManager;
	protected renderingContext: RenderingContext;

	constructor(
		protected readonly name: Input<string>,
		protected readonly initialValue: Input<any> ) {
		super();
		this.output = initialValue.getValue();
	}

	public getOutputValue(): any {
		return this.output;
	}

	protected subscribe(): void {
		const callback = ( data: any ): void => {
			this.output = data;
			this.renderingContext.animationManager.requestFrame();
		};
		this.eventsManager.subscribe( this.name.getValue(), callback );
	}

	protected setEventsManager( eventsManager: EventsManager ): void {
		this.eventsManager = eventsManager;
	}

	protected setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): EventReceiveBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as EventReceiveBlock;
		block.setEventsManager( renderingContext.getEventsManager() );
		block.setRenderingContext( renderingContext );
		block.subscribe();
		return block;
	}
	
	public static getDefaultInputValues(): any[] {
		return [ "", 0 ];
	}
}