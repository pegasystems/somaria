import { BlockInput } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";

export class BlockInputExternalReference<T> extends BlockInput<T> {
	protected valueHasChanged: boolean;

	constructor(
			protected renderingContext: RenderingContext,
			protected externalInputID: string,
			protected themeAttributeType: string,
			protected fallbackAccessType: string,
			protected fallbackValue: T,
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
		let value = this.renderingContext.getExternalInputValue( this.externalInputID );

		if( value === undefined ) {
			if ( this.fallbackAccessType === "Theme" ) {
				value = this.renderingContext.getThemeAttributeValue( this.themeAttributeType );
			}
			else if( this.fallbackAccessType === "Value" ) {
				value = this.fallbackValue;
			}
		}
		return this.sanitize( value );
	}

	public getValue(): T {
		this.valueHasChanged = false;
		return this.getUncachedValue();
	}
}