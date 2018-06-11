import "./Polyfills";
import { Configuration } from "./core/Configuration";
import { MacroDrawableBlock } from "./core/blocks/MacroDrawableBlock";
import { RenderingContext } from "./core/RenderingContext";
import { Signal } from "./core/Signal";
import { AnimationManager } from "./core/AnimationManager";
import { EventHandler } from "./core/EventHandler";
import { ScalingManager } from "./core/ScalingManager";
import { PubSub } from "./core/PubSub";
import { BlockTypes } from "./core/BlockTypes";
import { Theme } from "./core/Theme";
import * as THREE from "three";

export default class Visualization {
	public static PUBSUB: PubSub;
	public static BlockTypes: Map<string, any>;

	private config: Configuration;
	private visualizationJSON: BlockJSON;
	private block: MacroDrawableBlock;
	private animationManager: AnimationManager;
	private eventHandler: EventHandler;
	private scalingManager: ScalingManager;
	private renderingContext: RenderingContext;
	private externalInputs: Map<string, Signal<any>>;

	public scene: THREE.Scene;
	public camera: THREE.PerspectiveCamera;
	public renderer: THREE.WebGLRenderer;

	constructor( config: Configuration, visualizationJSON: BlockJSON, canvas: HTMLCanvasElement ) {
		this.config = new Configuration( config || {} as Configuration );
		this.visualizationJSON = visualizationJSON || {} as BlockJSON;
		this.externalInputs = new Map<string, Signal<any>>();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( this.config.backgroundColor );
		this.scene.position.set( this.config.origin.x, this.config.origin.y, this.config.origin.z );

		this.camera = new THREE.PerspectiveCamera(
			this.config.fov, // vertical fov
			1, // aspect ratio
			1, // near
			Number.MAX_SAFE_INTEGER ); // far

		this.camera.position.z = ScalingManager.computeCameraDistance( this.config.height, this.config.fov );
		this.scalingManager = new ScalingManager( this.camera, this.config );

		this.renderer = new THREE.WebGLRenderer( {
			antialias: this.config.antialias,
			canvas
		} );
		this.renderer.toneMapping = THREE.NoToneMapping;
		this.renderer.maxMorphTargets = 0;
		this.renderer.maxMorphNormals = 0;
		this.renderer.autoClear = false;
		this.resize();
		this.animationManager = new AnimationManager( (): void => {
			this.render();
		} );
		this.eventHandler = new EventHandler( this, this.animationManager );
		this.renderingContext = new RenderingContext( this, this.config, this.externalInputs, this.eventHandler, this.animationManager, this.scalingManager, Visualization.PUBSUB );
		this.block = MacroDrawableBlock.fromData( MacroDrawableBlock, this.visualizationJSON, this.renderingContext );
	}

	public resize(): void {
		const canvasWidth = this.renderer.domElement.offsetWidth;
		const canvasHeight = this.renderer.domElement.offsetHeight;
		this.renderer.setPixelRatio( window.devicePixelRatio || 1 );
		this.renderer.setSize( canvasWidth, canvasHeight, false );
		this.scalingManager.resize( canvasWidth, canvasHeight );
	}

	public render(): void {
		this.scene.children = [];

		this.renderer.clear( true, true, true );
		this.renderer.dispose();

		this.renderingContext.advanceFrame();

		for( const object of this.block.getObjects() ) {
			this.scene.add( object );
		}

		this.renderer.render( this.scene, this.camera );
	}

	public setInputValue( inputId: string, value: any ): void {
		this.externalInputs.get( inputId ).set( value );
	}

	public dispose(): void {
		this.renderingContext.getEventsManager().unsubscribeAll();
	}

	public static setPubSub( PubSub: PubSub ): void {
		Visualization.PUBSUB = PubSub;
	}

	public static registerTheme( name: string, theme: any ): void {
		Theme.registerTheme( name, theme );
	}
}

Visualization.BlockTypes = BlockTypes;