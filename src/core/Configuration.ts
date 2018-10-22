import * as THREE from "three";

const validScalingOptions = new Set();
validScalingOptions.add( "fit" );
validScalingOptions.add( "fill" );
validScalingOptions.add( "none" );

export class Configuration {
	public height: number;
	public width: number;
	public scalingMode: string;
	public fov: number; // Vertical field of view, in degrees
	public backgroundColor: number;
	public meshColor: number;
	public origin: Cartesian;
	public theme: string;
	public fontSize: number;
	public antialias: boolean;
	
	constructor( userConfig: Configuration ) {
		this.height = this.sanitizeNumber( userConfig.height, 500, 0 );
		this.width = this.sanitizeNumber( userConfig.width, 500, 0 );
		this.scalingMode = this.sanitizeString( userConfig.scalingMode, "fit", validScalingOptions );
		this.fov = this.sanitizeNumber( userConfig.fov, 50, 0 );
		this.backgroundColor = this.sanitizeNumber( userConfig.backgroundColor, 0x1D2427, 0, 0xFFFFFF );
		this.meshColor = this.sanitizeNumber( userConfig.meshColor, 0xFFFFFF, 0, 0xFFFFFF );
		if( userConfig.origin !== undefined ) {
			this.origin = new THREE.Vector3(
				this.sanitizeNumber( userConfig.origin.x, 0 ),
				this.sanitizeNumber( userConfig.origin.y, 0 ),
				this.sanitizeNumber( userConfig.origin.z, 0 )
			);
		}
		else {
			this.origin = new THREE.Vector3( 0, 0, 0 );
		}
		this.theme = this.sanitizeString( userConfig.theme, "default" );
		this.fontSize = this.sanitizeNumber( userConfig.fontSize, 16, 0 );
		this.antialias = this.sanitizeBoolean( userConfig.antialias, true );
	}
	
	private sanitizeNumber( value: number, defaultValue: number, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER ): number {
		value = Number( value );
		if( isNaN( value ) ) {
			return defaultValue;
		}
		else {
			return Math.max( min, Math.min( value, max ) );
		}
	}
	
	private sanitizeString( value: string, defaultValue: string, validValues?: Set<string> ): string {
		if( value === undefined || ( validValues !== undefined && !validValues.has( value ) ) ) {
			return defaultValue;
		}
		else {
			return value;
		}
	}
	
	private sanitizeBoolean( value: boolean, defaultValue: boolean ): boolean {
		if( value === undefined ) {
			return defaultValue;
		}
		else {
			return !!value;
		}
	}
}