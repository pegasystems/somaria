import { Block } from "../Block";
import { ConsumableBlock } from "./ConsumableBlock";
import { RenderingContext } from "../RenderingContext";
import { Signal } from "../Signal";
import * as THREE from "three";
import * as most from "most";

export class InteractionBlock extends ConsumableBlock {
	private static MOUSE_DOWN: number = 0;
	private static MOUSE_OVER: number = 1;

	private renderingContext: RenderingContext;
	private outputSignals: Signal<number>[];
	
	constructor() {
		super();
		this.outputSignals = [ new Signal( 0 ), new Signal( 0 ) ];
	}

	public setDrawable( object3d: THREE.Object3D ): void {
		const eventHandler = this.renderingContext.getEventHandler();
		eventHandler.addEventListener( object3d, ( eventType: string, activeFlag: number ): boolean => {
			return this.setOutputValue( eventType, activeFlag );
		} );
	}

	public setOutputValue( eventType: string, activeFlag: number ): boolean {
		let needsRender: boolean = false;
		if( eventType === "mousedown" ) {
			this.outputSignals[ InteractionBlock.MOUSE_DOWN ].set( activeFlag );
			needsRender = true;
		}
		else if( eventType === "mouseover" ) {
			this.outputSignals[ InteractionBlock.MOUSE_OVER ].set( activeFlag );
			needsRender = true;
		}
		return needsRender;
	}

	public getOutputStream( index: number ): most.Stream<any> {
		return this.outputSignals[ index ].getStream();
	}

	public setRenderingContext( renderingContext: RenderingContext ): void {
		this.renderingContext = renderingContext;
	}

	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): InteractionBlock {
		const block = Block.fromData( blockType, blockData, renderingContext ) as InteractionBlock;
		block.setRenderingContext( renderingContext );
		return block;
	}
}