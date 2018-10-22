import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";
import * as THREE from "three";

const outerCurve = new THREE.EllipseCurve( 0, 0, 0, 0, 0, 0, false, 0 );
const innerCurve = new THREE.EllipseCurve( 0, 0, 0, 0, 0, 0, false, 0 );

export class ArcBlock extends AbstractDrawableBlock {
	protected mesh: THREE.Mesh;
	protected material: THREE.MeshBasicMaterial;
	protected scalingManager: ScalingManager;
	protected renderedPixelWorldRatio: number;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly position: Input<Cartesian>,
			protected readonly xOuterRadius: Input<number>,
			protected readonly yOuterRadius: Input<number>,
			protected readonly xInnerRadius: Input<number>,
			protected readonly yInnerRadius: Input<number>,
			protected readonly sweepAngle: Input<number>,
			protected readonly startAngle: Input<number>,
			protected readonly color: Input<Color> ) {
		super( isEnabled );
		this.mesh = undefined;
	}

	public create3dObjects(): THREE.Object3D[] {
		if( this.mesh === undefined ) {
			this.material = DrawableUtils.create2DMaterial( THREE.MeshBasicMaterial );
			const geometry = new THREE.BufferGeometry();
			geometry.addAttribute( "position", new THREE.Float32BufferAttribute( [], 3 ) );
			geometry.setIndex( new THREE.Uint16BufferAttribute( [], 1 ) );
			this.mesh = new THREE.Mesh( geometry, this.material );
		}
		
		const geometry = this.mesh.geometry as THREE.BufferGeometry;
		const pixelWorldRatio = this.scalingManager.getPixelWorldRatio();

		if( this.hasShapeChanged( pixelWorldRatio ) ) {
			const xOuterRadius = this.xOuterRadius.getValue();
			const yOuterRadius = this.yOuterRadius.getValue();
			const sweepAngle = this.sweepAngle.getValue();
			const startAngle = this.startAngle.getValue();
			const endAngle = startAngle + sweepAngle;
			
			outerCurve.xRadius = xOuterRadius;
			outerCurve.yRadius = yOuterRadius;
			outerCurve.aStartAngle = startAngle;
			outerCurve.aEndAngle = endAngle;
			innerCurve.xRadius = this.xInnerRadius.getValue();
			innerCurve.yRadius = this.yInnerRadius.getValue();
			innerCurve.aStartAngle = startAngle;
			innerCurve.aEndAngle = endAngle;
			outerCurve.aClockwise = innerCurve.aClockwise = startAngle > endAngle;
			
			let numPoints = sweepAngle * Math.sqrt( 2 * Math.max( xOuterRadius, yOuterRadius ) * pixelWorldRatio );
			numPoints = Math.max( 2, Math.abs( Math.round( numPoints ) ) );
			const vertices = new Float32Array( numPoints * 2 * 3 );
			
			let t = 0;
			let numVertices = 0;
			let point;
			for( let i = 0; i < numPoints; i++ ) {
				t = i / ( numPoints - 1 );
				point = innerCurve.getPoint( t );
				vertices[ numVertices++ ] = point.x;
				vertices[ numVertices++ ] = point.y;
				vertices[ numVertices++ ] = 0;
				
				point = outerCurve.getPoint( t );
				vertices[ numVertices++ ] = point.x;
				vertices[ numVertices++ ] = point.y;
				vertices[ numVertices++ ] = 0;
			}
			
			const positionAttribute = geometry.getAttribute( "position" ) as THREE.BufferAttribute;
			positionAttribute.setArray( vertices );
			positionAttribute.needsUpdate = true;
			
			DrawableUtils.indexTriangleStripGeometryToTriangles( geometry, numPoints * 2 );
			geometry.computeBoundingSphere();
		}

		if( this.color.hasChanged() ) {
			DrawableUtils.setMaterialColor( this.material, this.color.getValue() );
		}

		if( this.position.hasChanged() ) {
			DrawableUtils.setPosition( this.mesh, this.position.getValue() );
		}

		this.setupInteractions( this.mesh );

		return [ this.mesh ];
	}
	
	protected hasShapeChanged( pixelWorldRatio: number ): boolean {
		return this.xOuterRadius.hasChanged() || this.yOuterRadius.hasChanged() || this.xInnerRadius.hasChanged() || this.yInnerRadius.hasChanged()
			|| this.startAngle.hasChanged() || this.sweepAngle.hasChanged() || pixelWorldRatio !== this.renderedPixelWorldRatio;
	}
	
	public getObjects(): THREE.Object3D[] {
		return [ this.mesh ];
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, new THREE.Vector3( 0, 0, 0 ), 50, 50, 0, 0, Math.PI / 2, 0, color ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): ArcBlock {
		const block = AbstractDrawableBlock.fromData( blockType, blockData, renderingContext ) as ArcBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}