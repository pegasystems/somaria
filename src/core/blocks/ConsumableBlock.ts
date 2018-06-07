import { Block } from "../Block";
import * as most from "most";

export abstract class ConsumableBlock extends Block {
	public abstract getOutputStream( index: number ): most.Stream<any>;
}