import { PublishableBlock } from "./PublishableBlock";

export class PublishedInputsBlock extends PublishableBlock {
	/*public getPublishedOutputValue( reference: string ): any {
		const oldScope = this.renderingContext.getScope();
		this.renderingContext.setScope( this.renderingContext.getParentScope() );
		const value = this.publishedOutputs.get( reference ).getValue();
		this.renderingContext.setScope( oldScope );
		return value;
	}*/
}