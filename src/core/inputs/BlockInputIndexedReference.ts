import { BlockInput } from "../BlockInput";
import { RenderingContext } from "../RenderingContext";
import { ConsumableBlock } from "../blocks/ConsumableBlock";

export class BlockInputIndexedReference<T> extends BlockInput<T> {
	protected cachedFrame: number;
	protected cachedValue: T;
	protected valueHasChanged: boolean;

	constructor(
			protected renderingContext: RenderingContext, 
			protected blockId: string,
			protected index: number,
			defaultValue: T ) {
		super( defaultValue );
		this.blockId = blockId;
		this.index = index || 0;
		this.renderingContext = renderingContext;
		this.cachedValue = undefined;
	}

	public hasChanged(): boolean {
		this.getValue();
		return this.valueHasChanged;
	}
	
	public isCached(): boolean {
		return this.cachedValue !== undefined && this.renderingContext.frameIndex === this.cachedFrame;
	}

	public getUncachedValue(): T {
		const block = this.renderingContext.interpretBlockById( this.blockId ) as ConsumableBlock;
		return this.sanitize( block.getOutputValue( this.index ) );
	}

	public getValue(): T {
		if( this.isCached() ) {
			this.valueHasChanged = false;
			return this.cachedValue;
		}
		else {
			this.cachedFrame = this.renderingContext.frameIndex;
			const newValue = this.getUncachedValue();
			this.valueHasChanged = newValue !== this.cachedValue;
			this.cachedValue = newValue;
			return newValue;
		}
	}
}