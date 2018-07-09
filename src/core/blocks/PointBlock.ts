import { ConsumableBlock } from "./ConsumableBlock";
import * as THREE from "three";
import * as most from "most";

export class PointBlock extends ConsumableBlock {
	protected pointStream: most.Stream<Cartesian>;
	
	constructor(
			x: most.Stream<number>,
			y: most.Stream<number>,
			z: most.Stream<number> ) {
		super();
		
		const point = new THREE.Vector3();
		
		this.pointStream = most.combine<number,number,number,Cartesian>( ( x, y, z ) => point.set( x, y, z ), x, y, z );
	}
	
	public getOutputStream( index: number ): most.Stream<Cartesian> {
		return this.pointStream;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 0 ];
	}
}