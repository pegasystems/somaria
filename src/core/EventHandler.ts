import Visualization from "../Visualization";
import { AnimationManager } from "./AnimationManager";
import * as THREE from "three";

type eventCallback = ( eventType: string, activeFlag: number ) => boolean;

const floatComparison = new Float32Array( 2 );

export class EventHandler {
	private camera: THREE.Camera;
	private registered3dObjects: THREE.Object3D[];
	private callbackMap: Map<number, eventCallback>;
	private raycaster: THREE.Raycaster;
	private currentMouseDownObject: THREE.Object3D;
	private currentMouseOverObject: THREE.Object3D;
	private canvasElement: HTMLCanvasElement;

	constructor( private visualization: Visualization, private animationManager: AnimationManager ) {
		this.canvasElement = visualization.renderer.domElement;
		this.camera = visualization.camera;
		this.registered3dObjects = [];
		this.raycaster = new THREE.Raycaster();
		this.callbackMap = new Map<number, eventCallback>();
		this.canvasElement.addEventListener( "mousedown", this, false );
		this.canvasElement.addEventListener( "mouseup", this, false );
		this.canvasElement.addEventListener( "mousemove", this, false );
	}

	public handleEvent( event: MouseEvent ): void {
		if( this.registered3dObjects.length === 0 ) {
			return;
		}
		
		event.preventDefault();
		event.stopPropagation();
		
		if( this.shouldRenderForEvent( event ) ) {
			this.animationManager.cancelFrame();
			this.visualization.render();
		}
	}
	
	protected shouldRenderForEvent( event: MouseEvent ): boolean {
		let shouldRender = false;
		
		if( event.type === "mouseup" ) {
			if( this.currentMouseDownObject !== undefined ) {
				this.invokeCallback( "mousedown", this.currentMouseDownObject, 0 );
				shouldRender = true;
				this.currentMouseDownObject = undefined;
			}
		}
		else if( event.type === "mousedown" ) {
			const object = this.getObjectAtCoordinates( this.getMouseCoordinates( event ) );
			
			if( object !== undefined ) {
				this.invokeCallback( "mousedown", object, 1 );
				shouldRender = true;
				this.currentMouseDownObject = object;
			}
		}
		else if( event.type === "mousemove" ) {
			const object = this.getObjectAtCoordinates( this.getMouseCoordinates( event ) );
			
			if( this.currentMouseOverObject !== object ) {
				if( this.currentMouseOverObject !== undefined ) {
					this.invokeCallback( "mouseover", this.currentMouseOverObject, 0 );
					shouldRender = true;
					this.currentMouseOverObject = undefined;
				}
				if( object !== undefined ) {
					this.invokeCallback( "mouseover", object, 1 );
					shouldRender = true;
					this.currentMouseOverObject = object;
				}
			}
		}
		
		return shouldRender;
	}
	
	protected getObjectAtCoordinates( coordinates: THREE.Vector2 ): THREE.Object3D {
		this.raycaster.setFromCamera( coordinates, this.camera );
		const intersections = this.raycaster.intersectObjects( this.registered3dObjects );
		
		if( intersections.length === 0 ) {
			return undefined;
		}
		
		let closestIntersection = intersections.shift();
		floatComparison[ 1 ] = closestIntersection.distance;
		
		for( const intersection of intersections ) {
			floatComparison[ 0 ] = intersection.distance;
			if( floatComparison[ 0 ] > floatComparison[ 1 ] ) {
				break;
			}
			if( intersection.object.id > closestIntersection.object.id ) {
				closestIntersection = intersection;
				floatComparison[ 1 ] = closestIntersection.distance;
			}
		}
		
		return closestIntersection.object;
	}

	public clearRegistered3dObjects(): void {
		this.registered3dObjects = [];
		this.callbackMap.clear();
	}

	public addEventListener( object3d: THREE.Object3D, callback: eventCallback ): void {
		this.callbackMap.set( object3d.id, callback );
		this.registered3dObjects.push( object3d );
	}

	private invokeCallback( eventType: string, object3d: THREE.Object3D, activeFlag: number ): boolean {
		const callback: eventCallback = this.callbackMap.get( object3d.id );
		return callback( eventType, activeFlag );
	}

	private getMouseCoordinates( event: MouseEvent ): THREE.Vector2 {
		const x = event.offsetX;
		const y = event.offsetY;
		return new THREE.Vector2( ( x / this.canvasElement.clientWidth ) * 2 - 1, 1 - ( y / this.canvasElement.clientHeight ) * 2 );
	}
}