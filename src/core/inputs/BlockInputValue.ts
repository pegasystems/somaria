import { BlockInput } from "../BlockInput";

export class BlockInputValue<T> extends BlockInput<T> {
	protected value: T;
	protected valueHasChanged: boolean;

	constructor( value: T, defaultValue: T ) {
		super( defaultValue );
		this.value = this.sanitize( value );
		this.valueHasChanged = true;
	}

	public hasChanged(): boolean {
		return this.valueHasChanged;
	}
	
	public isCached(): boolean {
		return !this.valueHasChanged;
	}

	public getUncachedValue(): T {
		return this.value;
	}

	public getValue(): T {
		this.valueHasChanged = false;
		return this.value;
	}
}