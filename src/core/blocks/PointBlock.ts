import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import * as THREE from "three";

export class PointBlock extends ConsumableBlock {
	protected point: Cartesian;
	
	constructor(
			protected readonly x: Input<number>,
			protected readonly y: Input<number>,
			protected readonly z: Input<number> ) {
		super();
	}

	public getOutputValue( index: number ): Cartesian {
		if( this.hasPointChanged() ) {
			this.point = new THREE.Vector3(
				this.x.getValue(),
				this.y.getValue(),
				this.z.getValue()
			);
		}
		
		return this.point;
	}
	
	protected hasPointChanged(): boolean {
		return this.x.hasChanged() || this.y.hasChanged() || this.z.hasChanged();
	}

	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 0 ];
	}
}