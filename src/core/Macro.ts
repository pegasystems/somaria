import { BlockScope } from "./BlockScope";

export interface Macro {
	createScope( blocks: BlockJSON[], parent: BlockScope ): void;
}