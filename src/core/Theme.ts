import { Color } from "./structs/Color";
import { defaultThemeJSON } from "./themes/somaria-default-theme";

const themeAttributeParser = new Map<string, ( value: any ) => any>();
themeAttributeParser.set( "ColorPalette", ( palette: number[] ) => palette.map( ( color: number ) => Color.fromHex( color, 1 ) ) );
themeAttributeParser.set( "FontFamily", ( fontFamily: string ) => fontFamily );

export class Theme {
	public static registeredThemes: Map<string, any> = new Map();
	protected themeAttributes: Map<string, any>;

	constructor( themeAttributes: Map<string, any> ) {
		this.themeAttributes = themeAttributes;
	}

	public static fromJSON( themeJSON: any = {} ): Theme {
		const themeAttributes: Map<string, any> = new Map();
		
		Object.keys( themeJSON ).forEach( ( attributeName: string ) => {
			const parser = themeAttributeParser.get( attributeName );
			if( parser !== undefined ) {
				const attributeValue = themeJSON[ attributeName ];
				themeAttributes.set( attributeName, parser( attributeValue ) );
			}
		} );
		return new Theme( themeAttributes );
	}

	public getThemeAttributeValue( attributeName: string ): any {
		return this.themeAttributes.get( attributeName );
	}

	public static registerTheme( themeReference: string, themeJSON: any ): void {
		Theme.registeredThemes.set( themeReference, Theme.fromJSON( themeJSON ) );
	}

	public static getRegisteredTheme( themeReference: string = "default" ): any {
		return Theme.registeredThemes.get( themeReference );
	}
}

if( Theme.registeredThemes !== undefined ) {
	Theme.registeredThemes.set( "default", Theme.fromJSON( defaultThemeJSON ) );
}