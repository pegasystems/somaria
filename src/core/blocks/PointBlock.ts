import { ConsumableBlock } from "./ConsumableBlock";
import * as THREE from "three";
import { Stream, combine } from "most";

export class PointBlock extends ConsumableBlock {
	protected pointStream: Stream<Cartesian>;
	
	constructor(
			x: Stream<number>,
			y: Stream<number>,
			z: Stream<number> ) {
		super();
		
		const point = new THREE.Vector3();
		
		this.pointStream = combine<number, number, number, Cartesian>( ( x: number, y: number, z: number ) =>
			point.set( x, y, z ),
			x, y, z );
	}
	
	public getOutputStream( index: number ): Stream<Cartesian> {
		return this.pointStream;
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 0 ];
	}
}