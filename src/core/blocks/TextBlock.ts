import { Configuration } from "../Configuration";
import { ConsumableBlock } from "./ConsumableBlock";
import { BlockInput as Input } from "../BlockInput";
import { Color } from "../structs/Color";
import { RenderingContext } from "../RenderingContext";
import { ScalingManager } from "../ScalingManager";
import * as THREE from "three";

export class TextBlock extends ConsumableBlock {
	private static TEXTURE_INDEX: number = 0;
	private static WIDTH_INDEX: number = 1;
	private static HEIGHT_INDEX: number = 2;
	private static ELLIPSIS: string = "...";
	private static HYPHEN: string = "-";
	protected scalingManager: ScalingManager;
	protected canvas: HTMLCanvasElement;
	protected texture: THREE.CanvasTexture;
	protected textWidth: number;
	protected textHeight: number;
	protected renderedPixelWorldRatio: number;

	constructor(
			protected readonly text: Input<string>,
			protected readonly fontFamily: Input<string>,
			protected readonly fontSize: Input<number>,
			protected readonly color: Input<Color>,
			protected readonly maxWidth: Input<number>,
			protected readonly wordWrap: Input<boolean> ) {
		super();
		this.canvas = document.createElement( "canvas" );
		this.texture = undefined;
	}

	public getOutputValue( index: number ): any {
		const pixelWorldRatio = window.devicePixelRatio * this.scalingManager.getPixelWorldRatio();
		
		if( this.hasTextureChanged( pixelWorldRatio ) ) {
			const fontSize = this.fontSize.getValue() * pixelWorldRatio;
			const font = fontSize + "px " + this.fontFamily.getValue();
			const maxWidth = this.maxWidth.getValue() * pixelWorldRatio;
			this.texture = new THREE.CanvasTexture( this.canvas );
			this.texture.minFilter = THREE.NearestFilter;
			this.texture.magFilter = THREE.NearestFilter;
			let context = this.canvas.getContext( "2d" );
			context.font = font;
			let text = String( this.text.getValue() );
			this.textWidth = Math.ceil( context.measureText( text ).width );
			this.textHeight = Math.ceil( fontSize * 1.25 );
			let multiline;
			if( maxWidth > 0 && maxWidth < this.textWidth ) {
				this.textWidth = maxWidth;
				if( this.wordWrap && this.wordWrap.getValue() ) {
					multiline = [];
					const words = text.split( " " );
					if( words.length > 1 ) {
						let line = words[ 0 ];
						for( let i = 1; i < words.length; i++ ) {
							const currentLine = line + " " + words[ i ];
							const currentLineWidth = Math.ceil( context.measureText( currentLine ).width );
							if( currentLineWidth > maxWidth ) {
								const lineWidth = Math.ceil( context.measureText( line ).width );
								if( lineWidth <= maxWidth ) {
									multiline.push( line );
									line = words[ i ];
								} 
								else {
									const partialtext = TextBlock.truncateText( line, maxWidth, context, true );
									multiline.push( partialtext );
									line = line.substring( partialtext.length - 1 );
									i--;
								}
							} 
							else {
								line = currentLine;
							}
							if( i === words.length - 1 ) {
								TextBlock.splitTextMultiline( multiline, line, maxWidth, context );
							}
						}
					} 
					else {
						TextBlock.splitTextMultiline( multiline, text, maxWidth, context );
					}
				} 
				else {
					text = TextBlock.truncateText( text, maxWidth, context );
				}
			} 
			this.canvas.width = this.textWidth;
			if( multiline ) {
				this.canvas.height = multiline.length * this.textHeight;
			}
			else {
				this.canvas.height = this.textHeight;
			}
			context = this.canvas.getContext( "2d" );
			context.font = font;
			context.textBaseline = "middle";
			context.fillStyle = "#" + this.color.getValue().getHexString();
			if( multiline && multiline.length > 0 ) {
				for( let i = 0; i < multiline.length; i++ ) {
					const lineHeight = i * this.textHeight + this.textHeight / 2;
					context.fillText( multiline[ i ], 0, lineHeight );
				}
				this.textHeight = this.canvas.height;
			} 
			else {
				context.fillText( text, 0, this.textHeight / 2 );
			}
			this.textWidth /= pixelWorldRatio;
			this.textHeight /= pixelWorldRatio;
			this.renderedPixelWorldRatio = pixelWorldRatio;
		}
		
		if( index === TextBlock.TEXTURE_INDEX ) {
			return this.texture;
		}
		else if( index === TextBlock.WIDTH_INDEX ) {
			return this.textWidth;
		}
		else if( index === TextBlock.HEIGHT_INDEX ) {
			return this.textHeight;
		}
	}

	protected hasTextureChanged( pixelWorldRatio: number ): boolean {
		return this.text.hasChanged()
			|| this.fontFamily.hasChanged()
			|| this.fontSize.hasChanged()
			|| this.color.hasChanged()
			|| this.maxWidth.hasChanged()
			|| pixelWorldRatio !== this.renderedPixelWorldRatio;
	}
	private static splitTextMultiline( multiline: [ string ], text: string, maxWidth: number, context: CanvasRenderingContext2D ): void {
		let lineWidth = Math.ceil( context.measureText( text ).width );
		if( lineWidth <= maxWidth ) {
			multiline.push( text );
		}
		else {
			do {
				const partialtext = TextBlock.truncateText( text, maxWidth, context, true );
				multiline.push( partialtext );
				text = text.substring( partialtext.length - 1 );
				lineWidth = Math.ceil( context.measureText( text ).width );
			} while( lineWidth > maxWidth );
			multiline.push( text );
		}
	}

	private static truncateText( text: string, maxWidth: number, context: CanvasRenderingContext2D, wrap: boolean = false ): string {
		let width = context.measureText( text ).width;
		let dotTextWidth;
		if( wrap ) {
			dotTextWidth = context.measureText( TextBlock.HYPHEN ).width;
		}
		else {
			dotTextWidth = context.measureText( TextBlock.ELLIPSIS ).width;
		}
		const desiredWidth = maxWidth - dotTextWidth;
		let truncatedText = text;
		let lastIndex = truncatedText.length;

		while( width > desiredWidth && truncatedText.length > 0 ) {
			truncatedText = truncatedText.substring( 0, --lastIndex );
			width = context.measureText( truncatedText ).width;
		}
		if( wrap ) {
			return truncatedText + TextBlock.HYPHEN;
		}
		return truncatedText + TextBlock.ELLIPSIS;
	}
	
	protected setScalingManager( scalingManager: ScalingManager ): void {
		this.scalingManager = scalingManager;
	}
	
	public static getDefaultInputValues( config: Configuration, renderingContext: RenderingContext ): any[] {
		const color = Color.fromHex( config.meshColor, 1 );
		const fontFamily = renderingContext.getThemeAttributeValue( "FontFamily" );
		return [ "", fontFamily, config.fontSize, color, 0, false ];
	}
	
	public static fromData( blockType: any, blockData: BlockJSON, renderingContext: RenderingContext ): TextBlock {
		const block = ConsumableBlock.fromData( blockType, blockData, renderingContext ) as TextBlock;
		
		block.setScalingManager( renderingContext.scalingManager );
		
		return block;
	}
}