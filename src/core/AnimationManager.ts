const NO_ACTIVE_REQUEST = -1;

export class AnimationManager {
	private frameRequestId: number;
	private animationCallback: () => void;
	
	constructor( renderCallback: () => void ) {
		this.frameRequestId = NO_ACTIVE_REQUEST;
		this.animationCallback = (): void => {
			this.frameRequestId = NO_ACTIVE_REQUEST;
			renderCallback();
		};
	}
	
	public requestFrame(): void {
		if( this.frameRequestId === NO_ACTIVE_REQUEST ) {
			this.frameRequestId = window.requestAnimationFrame( this.animationCallback );
		}
	}
	
	public cancelFrame(): void {
		if( this.frameRequestId !== NO_ACTIVE_REQUEST ) {
			window.cancelAnimationFrame( this.frameRequestId );
			this.frameRequestId = NO_ACTIVE_REQUEST;
		}
	}
}