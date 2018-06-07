import * as most from "most";

class SignalSubscription implements most.Subscription<any> {
	public closed: boolean;
	
	constructor( protected readonly subscribers: Set<most.Subscriber<any>>, protected readonly subscriber: most.Subscriber<any> ) {
		this.closed = false;
	}
	
	unsubscribe(): void {
		this.subscribers.delete( this.subscriber );
		this.closed = true;
	}
}

export class Signal implements most.Observable<any> {
	protected subscribers: Set<most.Subscriber<any>>;
	protected stream: most.Stream<any>;
	
	constructor( initialValue: any ) {
		this.subscribers = new Set();
		this.stream = most.from( this ).skipRepeats().startWith( initialValue );
	}
	
	[Symbol.observable]() {
		return this;
	}
	
	subscribe( subscriber: most.Subscriber<any> ): SignalSubscription {
		this.subscribers.add( subscriber );
		return new SignalSubscription( this.subscribers, subscriber );
	}
	
	set( value: any ) {
		this.subscribers.forEach( subscriber => {
			subscriber.next( value );
		} );
	}
	
	getStream(): most.Stream<any> {
		return this.stream;
	}
}