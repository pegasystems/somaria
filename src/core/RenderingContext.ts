import Visualization from "../Visualization";
import { BlockFactory } from "./BlockFactory";
import { Block } from "./Block";
import { BlockScope } from "./BlockScope";
import { IteratorBlockScope } from "./IteratorBlockScope";
import { Signal } from "./Signal";
import { EventHandler } from "./EventHandler";
import { EventsManager } from "./EventsManager";
import { AnimationManager } from "./AnimationManager";
import { ScalingManager } from "./ScalingManager";
import { PubSub } from "./PubSub";
import { Configuration } from "./Configuration";
import { Theme } from "./Theme";
import * as THREE from "three";

export class RenderingContext {
	public loadManager: THREE.LoadingManager;
	public frameIndex: number;
	
	protected renderScene: () => void;
	protected scope: BlockScope;
	protected eventsManager: EventsManager;

	constructor( 
			private visualization: Visualization,
			public config: Configuration,
			protected externalInputs: Map<string, any>,
			public eventHandler: EventHandler,
			public animationManager: AnimationManager,
			public scalingManager: ScalingManager,
			pubsub: PubSub ) {
		this.scope = undefined;
		this.frameIndex = 0;
		this.eventsManager = new EventsManager( pubsub );
		this.loadManager = new THREE.LoadingManager();
		this.loadManager.onLoad = (): void => {
			this.renderAllDrawables();
		};
	}

	public getScope(): BlockScope {
		return this.scope;
	}

	public advanceFrame(): void {
		this.frameIndex = this.frameIndex + 1 >>> 0;
	}

	public getExternalInput( id: string ): Signal<any> {
		return this.externalInputs.get( id );
	}

	public getEventHandler(): EventHandler {
		return this.eventHandler;
	}
	
	public getParentScope(): BlockScope {
		let parentScope = this.scope.parent;
		if( parentScope instanceof IteratorBlockScope ) {
			parentScope = parentScope.parent;
		}
		return parentScope;
	}

	public setScope( newScope: BlockScope ): void {
		this.scope = newScope;
	}

	public getIteratorBlockScope(): IteratorBlockScope {
		let iteratorScope: BlockScope = this.scope;
		while( iteratorScope && !( iteratorScope instanceof IteratorBlockScope ) ) {
			iteratorScope = iteratorScope.parent;
		}
		return iteratorScope as IteratorBlockScope;
	}

	public interpretBlockById( blockId: string ): Block {
		let block = this.scope.getBlock( blockId );
		
		if( block === undefined ) {
			const blockData = this.scope.getBlockData( blockId );
			block = BlockFactory.fromData( blockData, this );
			this.scope.setBlock( blockId, block );
		}
		
		return block;
	}

	public getEventsManager(): EventsManager {
		return this.eventsManager;
	}
	
	public renderAllDrawables(): void {
		this.visualization.render();
	}
	
	public getRenderer(): THREE.WebGLRenderer {
		return this.visualization.renderer;
	}

	public getRegisteredTheme( themeReference: string ): Theme {
		return Theme.getRegisteredTheme( themeReference );
	}

	public getThemeAttributeValue( themeAttributeType: string ): any {
		const theme = Theme.getRegisteredTheme( this.config.theme );
		const themeAttribute = theme.getThemeAttributeValue( themeAttributeType );
		return themeAttribute;
	}
}