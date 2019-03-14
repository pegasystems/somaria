import { Stream, Subscription } from "most";
import { Signal } from "./Signal";

export class Sink<T> extends Signal<T> {
	protected subscription: Subscription<T>;
	
	constructor( initialValue?: T ) {
		super( initialValue );
	}
	
	public setSource( source: Stream<T> ): void {
		this.disconnect();
		this.subscription = source.subscribe( this );
	}
	
	public disconnect(): void {
		if( this.subscription !== undefined ) {
			this.subscription.unsubscribe();
		}
	}
	
	public next( value ) {
		this.set( value );
	}
	
	public error( value ) {}
	
	public complete( value ) {
		this.set( value );
	}
}