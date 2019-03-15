import { Block } from "../Block";
import { Stream } from "most";

export abstract class ConsumableBlock extends Block {
	public abstract getOutputStream( index: number ): Stream<any>;
}