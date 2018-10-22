import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import * as THREE from "three";

export class LineBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: THREE.MeshBasicMaterial;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly startPosition: Input<Cartesian>,
			protected readonly endPosition: Input<Cartesian>,
			protected readonly thickness: Input<number>,
			protected readonly color: Input<Color> ) {
		super( isEnabled );
		this.mesh = undefined;
	}
	
	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create2DMaterial( THREE.MeshBasicMaterial );
			this.mesh = new THREE.Mesh( DrawableUtils.RectangleGeometry, this.material );
		}
		
		if( this.havePositionsChanged() ) {
			const startPosition = this.startPosition.getValue();
			const endPosition = this.endPosition.getValue();
			
			const middle = ( new THREE.Vector3() ).add( startPosition ).add( endPosition ).divideScalar( 2 );
			const xyAngle = Math.atan2(
				endPosition.y - startPosition.y,
				endPosition.x - startPosition.x );
			
			this.mesh.scale.x = startPosition.distanceTo( endPosition );
			this.mesh.setRotationFromEuler( new THREE.Euler( 0, 0, xyAngle ) );
			this.mesh.position.set( middle.x, middle.y, middle.z );
		}
		
		if( this.thickness.hasChanged() ) {
			this.mesh.scale.y = this.thickness.getValue();
		}
		
		if( this.color.hasChanged() ) {
			DrawableUtils.setMaterialColor( this.material, this.color.getValue() );
		}
		
		this.setupInteractions( this.mesh );

		return [ this.mesh ];
	}
	
	protected havePositionsChanged(): boolean {
		return this.startPosition.hasChanged() || this.endPosition.hasChanged();
	}
	
	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 1, color ];
	}
}