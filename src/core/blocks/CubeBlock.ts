import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { TexturedMaterial } from "../materials/TexturedMaterial";
import * as THREE from "three";

const cubeGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

export class CubeBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: TexturedMaterial;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly position: Input<Cartesian>,
			protected readonly width: Input<number>,
			protected readonly height: Input<number>,
			protected readonly depth: Input<number>,
			protected readonly color: Input<Color>,
			protected readonly rotation: Input<Angle>,
			protected readonly xAnchor: Input<string>,
			protected readonly yAnchor: Input<string>,
			protected readonly zAnchor: Input<string>,
			protected readonly texture: Input<THREE.Texture> ) {
		super( isEnabled );
		this.mesh = undefined;
	}

	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create3DMaterial( TexturedMaterial );
			this.mesh = new THREE.Mesh( cubeGeometry, this.material );
		}

		if( this.color.hasChanged() ) {
			this.material.setColor( this.color.getValue() );
		}
		
		if( this.texture.hasChanged() ) {
			this.material.setTexture( this.texture.getValue() );
		}

		if( this.hasAlignmentChanged() ) {
			const position = this.position.getValue();
			const rotation = this.rotation.getValue();
			const xAnchor = this.xAnchor.getValue();
			const yAnchor = this.yAnchor.getValue();
			const zAnchor = this.zAnchor.getValue();
			const scale = new THREE.Vector3( this.width.getValue(), this.height.getValue(), this.depth.getValue() );
			DrawableUtils.alignBlock( position, rotation, scale, yAnchor, xAnchor, zAnchor, 1, 1, 1, this.mesh );
		}

		this.setupInteractions( this.mesh );
		return [ this.mesh ];
	}
	
	protected hasAlignmentChanged(): boolean {
		return this.width.hasChanged() || this.height.hasChanged() || this.depth.hasChanged() || this.position.hasChanged() || this.rotation.hasChanged()
			|| this.xAnchor.hasChanged() || this.yAnchor.hasChanged() || this.zAnchor.hasChanged();
	}

	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), 100, 100, 100, color, new THREE.Vector3( 0, 0, 0 ), "center", "center", "center", null ];
	}
}