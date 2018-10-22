import { PubSub } from "./PubSub";

export class EventsManager {
	protected subscriptionTokens: any[];
	private pubsub: PubSub;

	constructor( pubsub: PubSub ) {
		this.pubsub = pubsub;
		this.subscriptionTokens = [];
	}

	public publish( topic: string, data: any ): void {
		this.pubsub.publish( topic, data );
	}

	private addToken( token: any ): void {
		this.subscriptionTokens.push( token );
	}

	public unsubscribeAll(): void {
		for( const token of this.subscriptionTokens ) {
			this.pubsub.unsubscribe( token );
		}
		this.subscriptionTokens = [];
	}

	public subscribe( topic: string, callback: ( data: any ) => void ): void {
		const token = this.pubsub.subscribe( topic, callback );
		this.addToken( token );
	}

	public getCurrentSubscriptionTokens(): any[] {
		return this.subscriptionTokens;
	}
}