import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { TexturedMaterial } from "../materials/TexturedMaterial";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";
import * as THREE from "three";

const CircularGeometryCache: Map<number, THREE.BufferGeometry> = new Map();

function generateCircleGeometry( resolution: number ): THREE.BufferGeometry {
	// Generate a strip of triangles to make a regular polygon with ${resolution} sides
	const vertices = new Float32Array( resolution * 3 );
	const uv = new Float32Array( resolution * 2 );
	
	for( let i = 0; i < resolution; i++ ) {
		let t = ( i + 1 >>> 1 ) / resolution;
		
		if( i & 1 ) {
			t = 1 - t;
		}
		
		const angle = 2 * Math.PI * t;
		
		const x = Math.cos( angle );
		const y = Math.sin( angle );
		
		vertices[ i * 3 ] = x;
		vertices[ i * 3 + 1 ] = y;
		uv[ i * 2 ] = ( x + 1 ) / 2;
		uv[ i * 2 + 1 ] = ( y + 1 ) / 2;
	}
	
	const geometry = new THREE.BufferGeometry();
	geometry.addAttribute( "position", new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( "uv", new THREE.BufferAttribute( uv, 2 ) );
	geometry.setIndex( new THREE.Uint16BufferAttribute( [], 1 ) );
	
	DrawableUtils.indexTriangleStripGeometryToTriangles( geometry, resolution );
	
	return geometry;
}

export class EllipseBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: TexturedMaterial;
	protected scalingManager: ScalingManager;
	protected renderedPixelWorldRatio: number;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly position: Input<Cartesian>,
			protected readonly xRadius: Input<number>,
			protected readonly yRadius: Input<number>,
			protected readonly color: Input<Color>,
			protected readonly rotation: Input<Angle>,
			protected readonly texture: Input<THREE.Texture> ) {
		super( isEnabled );
		this.mesh = undefined;
	}
	
	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create2DMaterial( TexturedMaterial );
			this.mesh = new THREE.Mesh( DrawableUtils.DummyGeometry, this.material );
		}
		
		const pixelWorldRatio = this.scalingManager.getPixelWorldRatio();
		
		if( this.hasSizeChanged( pixelWorldRatio ) ) {
			const xRadius = this.xRadius.getValue() === 0 ? Number.EPSILON : this.xRadius.getValue();
			const yRadius = this.yRadius.getValue() === 0 ? Number.EPSILON : this.yRadius.getValue();
			let resolution = 2 * Math.PI * Math.sqrt( Math.max( xRadius, yRadius ) * pixelWorldRatio );
			resolution = Math.max( 3, Math.abs( Math.round( resolution ) ) );
			
			let geometry = CircularGeometryCache.get( resolution );

			if( geometry === undefined ) {
				geometry = generateCircleGeometry( resolution );
				CircularGeometryCache.set( resolution, geometry );
			}
			
			this.mesh.geometry = geometry;
			
			this.mesh.scale.set( xRadius, yRadius, 1 );
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
		return this.xRadius.hasChanged() || this.yRadius.hasChanged() || pixelWorldRatio !== this.renderedPixelWorldRatio;
	}
	
	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}
	
	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), 50, 50, color, new THREE.Vector3( 0, 0, 0 ), null ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): EllipseBlock {
		const block = AbstractDrawableBlock.fromData( blockType, blockData, renderingContext ) as EllipseBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}