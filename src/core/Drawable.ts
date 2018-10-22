import { BlockInput as Input } from "./BlockInput";

import * as THREE from "three";

export interface Drawable {
	isEnabled: Input<boolean>;
	
	create3dObjects(): THREE.Object3D[];
	getObjects(): THREE.Object3D[];
}