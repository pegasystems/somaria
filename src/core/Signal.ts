import * as most from "most";

export class SignalSubscription<T> implements most.Subscription<T> {
	public closed: boolean;
	
	constructor( protected readonly subscribers: Set<most.Subscriber<T>>, protected readonly subscriber: most.Subscriber<T> ) {
		this.closed = false;
	}
	
	unsubscribe(): void {
		this.subscribers.delete( this.subscriber );
		this.closed = true;
	}
}

export class Signal<T> implements most.Observable<T> {
	protected subscribers: Set<most.Subscriber<T>>;
	protected stream: most.Stream<T>;
	
	constructor( initialValue: T ) {
		this.subscribers = new Set();
		this.stream = most.from( this ).skipRepeats().startWith( initialValue );
	}
	
	[Symbol.observable]() {
		return this;
	}
	
	subscribe( subscriber: most.Subscriber<T> ): SignalSubscription<T> {
		this.subscribers.add( subscriber );
		return new SignalSubscription( this.subscribers, subscriber );
	}
	
	set( value: T ): void {
		this.subscribers.forEach( subscriber => {
			subscriber.next( value );
		} );
	}
	
	getStream(): most.Stream<T> {
		return this.stream;
	}
}