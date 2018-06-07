import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { TexturedMaterial } from "../materials/TexturedMaterial";
import * as THREE from "three";
import * as most from "most";

export class RectangleBlock extends AbstractDrawableBlock {
	
	constructor(
			isEnabled: most.Stream<number>,
			position: most.Stream<Cartesian>,
			width: most.Stream<number>,
			height: most.Stream<number>,
			color: most.Stream<Color>,
			rotation: most.Stream<Angle>,
			verticalAnchor: most.Stream<string>,
			horizontalAnchor: most.Stream<string>,
			texture: most.Stream<THREE.Texture> ) {
		super( isEnabled );
		const material = DrawableUtils.create2DMaterial( TexturedMaterial );
		const mesh = new THREE.Mesh( DrawableUtils.RectangleGeometry, material );
		this.objects.push( mesh );
		
		this.observe( color.map( color => material.setColor( color ) ) );
		this.observe( texture.map( texture => material.setTexture( texture ) ) );
		
		const scaleObject = new THREE.Vector3();
		const scale = most.combine<number, number, THREE.Vector3>(
			( width: number, height: number ): THREE.Vector3 => scaleObject.set( width, height, 1 ),
			width, height );
		
		this.observe( most.combine<Cartesian,THREE.Vector3,Angle,string,string,void>(
			( position: Cartesian, scale: THREE.Vector3, rotation: Angle, verticalAnchor: string, horizontalAnchor: string ): void =>
				DrawableUtils.alignBlock( position, rotation, scale, verticalAnchor, horizontalAnchor, "center", 1, 1, 0, mesh ),
			position, scale, rotation, verticalAnchor, horizontalAnchor ) );
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ 1, new THREE.Vector3( 0, 0, 0 ), 100, 100, color, new THREE.Vector3( 0, 0, 0 ), "center", "center", null ];
	}
}