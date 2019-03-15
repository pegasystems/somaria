import { Subscriber, Observable, Stream, from as streamFrom } from "most";
import { SignalSubscription } from "./SignalSubscription";

export class Signal<T> implements Observable<T> {
	protected subscribers: Set<Subscriber<T>>;
	protected stream: Stream<T>;
	
	constructor( initialValue: T ) {
		this.subscribers = new Set();
		this.stream = streamFrom( this ).skipRepeats().startWith( initialValue );
	}
	
	public [Symbol.observable](): Observable<T> {
		return this;
	}
	
	public subscribe( subscriber: Subscriber<T> ): SignalSubscription<T> {
		this.subscribers.add( subscriber );
		return new SignalSubscription( this.subscribers, subscriber );
	}
	
	public set( value: T ): void {
		this.subscribers.forEach( ( subscriber: Subscriber<T> ) => {
			subscriber.next( value );
		} );
	}
	
	public getStream(): Stream<T> {
		return this.stream;
	}
}