import { Color } from "../structs/Color";
import * as THREE from "three";

export function setMaterialColor( material: THREE.Material, color: Color ): void {
	const basicMaterial = material as THREE.MeshBasicMaterial;
	basicMaterial.color.setRGB( color.r, color.g, color.b );
	material.opacity = color.a;
}

const reusableEuler = new THREE.Euler();

export function setRotation( object: THREE.Object3D, rotation: Angle ): void {
	reusableEuler.set( rotation.x, rotation.y, rotation.z );
	object.setRotationFromEuler( reusableEuler );
}

export function setPosition( object: THREE.Object3D, position: Cartesian ): void {
	object.position.set( position.x, position.y, position.z );
}

export function create2DMaterial( materialType: any ): any {
	const material = create3DMaterial( materialType );
	material.side = THREE.DoubleSide;
	return material;
}

export function create3DMaterial( materialType: any ): any {
	const material = new materialType();
	material.fog = false;
	material.transparent = true;
	return material;
}

export const DummyGeometry = {} as THREE.Geometry;

export const RectangleGeometry = ( (): THREE.BufferGeometry => {
	const geometry = new THREE.BufferGeometry();
	const vertices = [
		-0.5, +0.5, 0,
		-0.5, -0.5, 0,
		+0.5, +0.5, 0,
		-0.5, -0.5, 0,
		+0.5, -0.5, 0,
		+0.5, +0.5, 0
	];
	const uv = [ 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1 ];
	geometry.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( "uv", new THREE.Float32BufferAttribute( uv, 2 ) );
	return geometry;
} )();

export function indexTriangleStripGeometryToTriangles( geometry: THREE.BufferGeometry, numVertices: number ): void {
	// Convert triangle strip to triangles by indexing the geometry
	const indices = new Uint16Array( ( numVertices - 2 ) * 3 );
	let j = 0;
	for( let i = 2; i < numVertices; i++ ) {
		indices[ j++ ] = i - 2;
		indices[ j++ ] = i - 1;
		indices[ j++ ] = i;
	}

	geometry.index.setArray( indices );
	geometry.index.needsUpdate = true;
}

export function disposeObject( object: THREE.Object3D ): void {
	const mesh = object as THREE.Mesh;
	const basicMaterial = mesh.material as THREE.MeshBasicMaterial;
	if( basicMaterial && basicMaterial.map ) {
		basicMaterial.map.dispose();
	}
	basicMaterial.dispose();
	mesh.geometry.dispose();
}

export function alignBlock(
			position: Cartesian,
			rotation: Angle,
			scale: Cartesian,
			verticalAnchor: string,
			horizontalAnchor: string,
			zAnchor: string,
			width: number,
			height: number,
			depth: number,
			object3D: THREE.Mesh ): void {
	let anchorX = 0;
	let anchorY = 0;
	let anchorZ = 0;

	if ( verticalAnchor === "max" ) {
		anchorY = -height / 2;
	}
	else if ( verticalAnchor === "min" ) {
		anchorY = height / 2;
	}
	
	if ( horizontalAnchor === "min" ) {
		anchorX = width / 2;
	}
	else if ( horizontalAnchor === "max" ) {
		anchorX = -width / 2;
	}

	if ( zAnchor === "max" ) {
		anchorZ = depth / 2;
	}
	else if ( zAnchor === "min" ) {
		anchorZ = -depth / 2;
	}

	reusableEuler.set( rotation.x, rotation.y, rotation.z );
	
	const translationMatrix = new THREE.Matrix4().makeTranslation( position.x, position.y, position.z );
	const anchorTranslationMatrix = new THREE.Matrix4().makeTranslation( anchorX, anchorY, anchorZ );
	const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler( reusableEuler );
	const scaleMatrix = new THREE.Matrix4().makeScale( scale.x, scale.y, scale.z );
	object3D.matrix = new THREE.Matrix4();
	object3D.applyMatrix( translationMatrix.multiply( rotationMatrix ).multiply( scaleMatrix ).multiply( anchorTranslationMatrix ) );
}