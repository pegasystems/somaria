import { Configuration } from "./Configuration";
import * as THREE from "three";

export class ScalingManager {
	private pixelWorldRatio: number;
	private visualizationAspectRatio: number;
	
	constructor( private camera: THREE.PerspectiveCamera, private config: Configuration ) {
		this.visualizationAspectRatio = config.width / config.height;
		this.pixelWorldRatio = 1;
	}
	
	public resize( canvasWidth: number, canvasHeight: number ): void {
		const canvasAspectRatio = canvasWidth / canvasHeight;
		
		if( this.config.scalingMode === "none" ) {
			this.camera.fov = this.scaleFov( canvasHeight / this.config.height );
			this.camera.position.z = ScalingManager.computeCameraDistance( canvasHeight, this.camera.fov );
		}
		else {
			let shouldMatchWidth;
			if( this.config.scalingMode === "fill" ) {
				shouldMatchWidth = this.visualizationAspectRatio < canvasAspectRatio;
			}
			else {
				shouldMatchWidth = this.visualizationAspectRatio > canvasAspectRatio;
			}
			
			if( shouldMatchWidth ) {
				// Since the camera now captures more space from a further distance, adjust the fov to make the
				// perspective match what it would be if the visualization filled the height of the canvas
				this.camera.fov = this.scaleFov( this.visualizationAspectRatio / canvasAspectRatio );
				this.pixelWorldRatio = canvasWidth / this.config.width;
			}
			else {
				this.camera.fov = this.config.fov;
				this.pixelWorldRatio = canvasHeight / this.config.height;
			}
		}
		
		this.camera.aspect = canvasAspectRatio;
		this.camera.updateProjectionMatrix();
	}
	
	private scaleFov( multiplier: number ): number {
		return Math.atan( Math.tan( this.config.fov * Math.PI / 360 ) * multiplier ) * 360 / Math.PI;
	}
	
	/**
	 * If the camera is a perspective camera, then at some distance in front of the camera, the size of one "world unit"
	 * will equal one screen pixel. This returns that distance.
	 */
	public static computeCameraDistance( height: number, fov: number ): number {
		// distance = (half the screen height in pixels) / tan( half of the vertical FOV in radians )
		return height / 2 / Math.tan( fov / 360 * Math.PI );
	}
	
	public getPixelWorldRatio(): number {
		return this.pixelWorldRatio;
	}
}