import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import * as THREE from "three";

export class CoordinatesBlock extends ConsumableBlock {
	protected angle: Angle;
	
	constructor(
			protected readonly origin: Input<Cartesian>,
			protected readonly azimuth: Input<number>,
			protected readonly polar: Input<number>,
			protected readonly radius: Input<number> ) {
		super();
	}

	public getOutputValue( index: number ): Angle {
		if( this.hasPointChanged() ) {
			const origin = this.origin.getValue();
			const azimuth = this.azimuth.getValue() % ( 2 * Math.PI );
			const polar = this.polar.getValue() % ( 2 * Math.PI );
			const radius = this.radius.getValue();
			
			this.angle = new THREE.Vector3(
				origin.x + radius * Math.sin( azimuth ) * Math.cos( polar ),
				origin.y + radius * Math.sin( azimuth ) * Math.sin( polar ),
				origin.z + radius * Math.cos( azimuth )
			);
		}
		
		return this.angle;
	}
	
	protected hasPointChanged(): boolean {
		return this.origin.hasChanged() || this.azimuth.hasChanged() || this.polar.hasChanged() || this.radius.hasChanged();
	}
	
	public static getDefaultInputValues(): any[] {
		return [ new THREE.Vector3( 0, 0, 0 ), Math.PI / 2, 0, 0 ];
	}
}