import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import * as THREE from "three";

const PiOver180 = Math.PI / 180;

export class AngleBlock extends ConsumableBlock {
	protected angle: Angle;
	
	constructor(
			protected readonly x: Input<number>,
			protected readonly y: Input<number>,
			protected readonly z: Input<number>,
			protected readonly units: Input<string> ) {
		super();
	}
	
	public getOutputValue( index: number ): Angle {
		if( this.hasAngleChanged() ) {
			this.angle = new THREE.Vector3(
				this.x.getValue(),
				this.y.getValue(),
				this.z.getValue()
			);
			
			if( this.units.getValue() === "degree" ) {
				this.angle.multiplyScalar( PiOver180 );
			}
		}
		
		return this.angle;
	}
	
	protected hasAngleChanged(): boolean {
		return this.x.hasChanged() || this.y.hasChanged() || this.z.hasChanged() || this.units.hasChanged();
	}
	
	public static getDefaultInputValues(): any[] {
		return [ 0, 0, 0, "radian" ];
	}
}