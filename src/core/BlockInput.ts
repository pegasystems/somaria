export abstract class BlockInput<T> {
	public static Value: string = "Value";
	public static Indexed: string = "Indexed";
	public static Published: string = "Published";
	public static External: string = "External";
	public static Theme: string = "Theme";

	protected defaultValue: T;

	constructor( defaultValue: T ) {
		this.defaultValue = defaultValue;
	}
	
	public abstract hasChanged(): boolean;
	
	public abstract isCached(): boolean;
	
	public abstract getValue(): T;

	public abstract getUncachedValue(): T;

	protected sanitize( value: T ): T {
		if( value === undefined ) {
			return this.defaultValue;
		}
		else {
			return value;
		}
	}
}