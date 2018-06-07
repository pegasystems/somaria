import * as THREE from "three";

export interface Drawable {
	getObjects(): THREE.Object3D[];
}