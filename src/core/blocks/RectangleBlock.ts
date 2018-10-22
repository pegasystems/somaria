import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { TexturedMaterial } from "../materials/TexturedMaterial";
import * as THREE from "three";

export class RectangleBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: TexturedMaterial;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly position: Input<Cartesian>,
			protected readonly width: Input<number>,
			protected readonly height: Input<number>,
			protected readonly color: Input<Color>,
			protected readonly rotation: Input<Angle>,
			protected readonly verticalAnchor: Input<string>,
			protected readonly horizontalAnchor: Input<string>,
			protected readonly texture: Input<THREE.Texture> ) {
		super( isEnabled );
		this.mesh = undefined;
	}
	
	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create2DMaterial( TexturedMaterial );
			this.mesh = new THREE.Mesh( DrawableUtils.RectangleGeometry, this.material );
		}
		
		if( this.color.hasChanged() ) {
			this.material.setColor( this.color.getValue() );
		}
		
		if( this.texture.hasChanged() ) {
			this.material.setTexture( this.texture.getValue() );
		}
		
		if( this.hasAlignmentChanged() ) {
			const rotation = this.rotation.getValue();
			const position = this.position.getValue();
			const verticalAnchor = this.verticalAnchor.getValue();
			const horizontalAnchor = this.horizontalAnchor.getValue();
			const scale = new THREE.Vector3( this.width.getValue(), this.height.getValue(), 1 );
			DrawableUtils.alignBlock( position, rotation, scale, verticalAnchor, horizontalAnchor, "center", 1, 1, 0, this.mesh );
		}
		
		this.setupInteractions( this.mesh );
		return [ this.mesh ];
	}
	
	protected hasAlignmentChanged(): boolean {
		return this.width.hasChanged() || this.height.hasChanged() || this.position.hasChanged() || this.rotation.hasChanged() || this.verticalAnchor.hasChanged() ||
			this.horizontalAnchor.hasChanged();
	}

	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}	

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), 100, 100, color, new THREE.Vector3( 0, 0, 0 ), "center", "center", null ];
	}
}