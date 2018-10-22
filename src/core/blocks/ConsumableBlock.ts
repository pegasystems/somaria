import { Block } from "../Block";

export abstract class ConsumableBlock extends Block {
	public abstract getOutputValue( index: number ): any;
}