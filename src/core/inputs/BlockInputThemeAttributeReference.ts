import { BlockInput } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";

export class BlockInputThemeAttributeReference<T> extends BlockInput<T> {
	protected valueHasChanged: boolean;

	constructor(
			protected renderingContext: RenderingContext,
			protected themeAttributeType: string,
			defaultValue: T ) {
		super( defaultValue );
		this.valueHasChanged = true;
	}

	public hasChanged(): boolean {
		return this.valueHasChanged;
	}
	
	public isCached(): boolean {
		return !this.valueHasChanged;
	}
	
	public getUncachedValue(): T {
		return this.sanitize( this.renderingContext.getThemeAttributeValue( this.themeAttributeType ) );
	}

	public getValue(): T {
		this.valueHasChanged = false;
		return this.getUncachedValue();
	}
}