import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { TexturedMaterial } from "../materials/TexturedMaterial";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";
import * as THREE from "three";

const SphericalGeometryCache: Map<number, THREE.SphereBufferGeometry> = new Map();

export class EllipsoidBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: TexturedMaterial;
	protected scalingManager: ScalingManager;
	protected renderedPixelWorldRatio: number;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly position: Input<Cartesian>,
			protected readonly xRadius: Input<number>,
			protected readonly yRadius: Input<number>,
			protected readonly zRadius: Input<number>,
			protected readonly color: Input<Color>,
			protected readonly rotation: Input<Angle>,
			protected readonly texture: Input<THREE.Texture> ) {
		super( isEnabled );
		this.mesh = undefined;
	}

	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create3DMaterial( TexturedMaterial );
			this.mesh = new THREE.Mesh( DrawableUtils.DummyGeometry, this.material );
		}
		
		const pixelWorldRatio = this.scalingManager.getPixelWorldRatio();

		if( this.hasSizeChanged( pixelWorldRatio ) ) {
			const xRadius = this.xRadius.getValue() === 0 ? Number.EPSILON : this.xRadius.getValue();
			const yRadius = this.yRadius.getValue() === 0 ? Number.EPSILON : this.yRadius.getValue();
			const zRadius = this.zRadius.getValue() === 0 ? Number.EPSILON : this.zRadius.getValue();
			let resolution = Math.PI * Math.sqrt( Math.max( xRadius, yRadius, zRadius ) * pixelWorldRatio );
			resolution = Math.abs( Math.round( resolution ) );
			let geometry = SphericalGeometryCache.get( resolution );

			if( geometry === undefined ) {
				geometry = new THREE.SphereBufferGeometry( 1, resolution, resolution );
				SphericalGeometryCache.set( resolution, geometry );
			}

			this.mesh.geometry = geometry;

			this.mesh.scale.set( xRadius, yRadius, zRadius );
			this.renderedPixelWorldRatio = pixelWorldRatio;
		}

		if( this.color.hasChanged() ) {
			this.material.setColor( this.color.getValue() );
		}
		
		if( this.texture.hasChanged() ) {
			this.material.setTexture( this.texture.getValue() );
		}

		if( this.rotation.hasChanged() ) {
			DrawableUtils.setRotation( this.mesh, this.rotation.getValue() );
		}

		if( this.position.hasChanged() ) {
			DrawableUtils.setPosition( this.mesh, this.position.getValue() );
		}

		this.setupInteractions( this.mesh );

		return [ this.mesh ];
	}

	protected hasSizeChanged( pixelWorldRatio: number ): boolean {
		return this.xRadius.hasChanged() || this.yRadius.hasChanged() || this.zRadius.hasChanged() || pixelWorldRatio !== this.renderedPixelWorldRatio;
	}

	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), 50, 50, 50, color, new THREE.Vector3( 0, 0, 0 ), null ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): EllipsoidBlock {
		const block = AbstractDrawableBlock.fromData( blockType, blockData, renderingContext ) as EllipsoidBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}