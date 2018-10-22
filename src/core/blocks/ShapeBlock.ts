import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import * as THREE from "three";

export class ShapeBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: THREE.MeshBasicMaterial;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly list: Input<any[]>,
			protected readonly position: Input<Cartesian>,
			protected readonly color: Input<Color>,
			protected readonly rotation: Input<Angle> ) {
		super( isEnabled );
		this.mesh = undefined;
	}

	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create2DMaterial( THREE.MeshBasicMaterial );
			this.mesh = new THREE.Mesh( DrawableUtils.DummyGeometry, this.material );
		}

		if( this.hasPointsChanged() ) {
			const points = this.list.getValue();

			if( points.length >= 3 ) {
				const shape = new THREE.Shape( points );
				const shapeGeometry = new THREE.ShapeBufferGeometry( shape );
				this.mesh.geometry = shapeGeometry;
			}
		}
		
		if( this.rotation.hasChanged() ) {
			DrawableUtils.setRotation( this.mesh, this.rotation.getValue() );
		}

		if( this.position.hasChanged() ) {
			DrawableUtils.setPosition( this.mesh, this.position.getValue() );
		}

		if( this.color.hasChanged() ) {
			DrawableUtils.setMaterialColor( this.material, this.color.getValue() );
		}

		this.setupInteractions( this.mesh );

		return this.getObjects();
	}
	
	protected hasPointsChanged(): boolean {
		return this.list.hasChanged();
	}
	
	public getObjects(): THREE.Object3D[] {
		if( this.list.getValue().length >= 3 ) {
			return [ this.mesh ];
		}
		else {
			return [];
		}
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, [], new THREE.Vector3( 0, 0, 0 ), color, new THREE.Vector3( 0, 0, 0 ) ];
	}
}