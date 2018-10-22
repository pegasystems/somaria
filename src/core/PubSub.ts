export interface PubSub {
	subscribe( topic: string, callback: ( data: any ) => void ): any;
	publish( topic: string, data: any ): void;
	unsubscribe( token: any ): void;
}