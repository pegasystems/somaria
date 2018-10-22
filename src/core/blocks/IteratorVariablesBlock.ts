import { IteratorScopedBlock } from "./IteratorScopedBlock";

export class IteratorVariablesBlock extends IteratorScopedBlock {
	protected static ITERATION_COUNT: number = 0;
	protected static CURRENT_INDEX: number = 1;

	public getOutputValue( index: number ): number {
		let outputValue;
		if( this.iteratorScope ) {
			if( index === IteratorVariablesBlock.ITERATION_COUNT ) {
				outputValue = this.iteratorScope.getIterationCount();
			}
			else if( index === IteratorVariablesBlock.CURRENT_INDEX ) {
				outputValue = this.iteratorScope.currentIndex;
			}
		}

		return outputValue;
	}
}