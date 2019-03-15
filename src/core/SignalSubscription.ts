import { Subscription, Subscriber } from "most";

export class SignalSubscription<T> implements Subscription<T> {
	public closed: boolean;

	constructor( protected readonly subscribers: Set<Subscriber<T>>, protected readonly subscriber: Subscriber<T> ) {
		this.closed = false;
	}

	public unsubscribe(): void {
		this.subscribers.delete( this.subscriber );
		this.closed = true;
	}
}