import { Configuration } from "../Configuration";
import { AbstractDrawableBlock } from "./AbstractDrawableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import * as DrawableUtils from "../utils/DrawableUtils";
import * as THREE from "three";

export class PathBlock extends AbstractDrawableBlock {
	protected path: THREE.Line;
	protected material: THREE.LineBasicMaterial;
	
	constructor(
			isEnabled: Input<boolean>,
			protected readonly list: Input<any[]>,
			protected readonly color: Input<Color>,
			protected readonly isClosed: Input<boolean> ) {
		super( isEnabled );
		this.path = undefined;
	}

	public create3dObjects(): THREE.Object3D[] {
		if( this.path === undefined ) {
			this.material = DrawableUtils.create2DMaterial( THREE.LineBasicMaterial );
			const geometry = new THREE.BufferGeometry();
			geometry.addAttribute( "position", new THREE.Float32BufferAttribute( [], 3 ) );
			this.path = new THREE.Line( geometry, this.material );
		}
		
		const geometry = this.path.geometry as THREE.BufferGeometry;

		if( this.hasPathChanged() && this.list.getValue().length >= 2 ) {
			const points = this.list.getValue();
			let numPoints = points.length;

			if( this.isClosed.getValue() ) {
				numPoints++;
			}
			
			const vertices = new Float32Array( numPoints * 3 );
			let numVertices = 0;
			for( const point of points ) {
				vertices[ numVertices++ ] = point.x;
				vertices[ numVertices++ ] = point.y;
				vertices[ numVertices++ ] = point.z;
			}

			if( this.isClosed.getValue() ) {
				vertices[ numVertices++ ] = points[ 0 ].x;
				vertices[ numVertices++ ] = points[ 0 ].y;
				vertices[ numVertices++ ] = points[ 0 ].z;
			}

			const positionAttribute = geometry.getAttribute( "position" ) as THREE.BufferAttribute;
			positionAttribute.setArray( vertices );
			positionAttribute.needsUpdate = true;
		}

		if( this.color.hasChanged() ) {
			DrawableUtils.setMaterialColor( this.material, this.color.getValue() );
		}

		this.setupInteractions( this.path );

		return this.getObjects();
	}
	
	protected hasPathChanged(): boolean {
		return this.list.hasChanged() || this.isClosed.hasChanged();
	}
	
	public getObjects(): THREE.Object3D[] {
		if( this.list.getValue().length >= 2 ) {
			return [ this.path ];
		}
		else {
			return [];
		}
	}

	public static getDefaultInputValues( config: Configuration ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		return [ true, [], color, false ];
	}
}