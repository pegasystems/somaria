import * as THREE from "three";

const HALF_PI = Math.PI / 2;

const triangle = new THREE.Triangle();

function areaOfTriangle( p0: Cartesian, p1: Cartesian, p2: Cartesian ): number {
	return triangle.set( p0, p1, p2 ).getArea();
}

/**
 * Non-uniform CatmullRom
 */
function CatmullRom( t: number, t0: number, t1: number, t2: number, t3: number, p0: number, p1: number, p2: number, p3: number ): number {
	const A1 = ( ( t1 - t ) * p0 + ( t - t0 ) * p1 ) / ( t1 - t0 );
	const A2 = ( ( t2 - t ) * p1 + ( t - t1 ) * p2 ) / ( t2 - t1 );
	const A3 = ( ( t3 - t ) * p2 + ( t - t2 ) * p3 ) / ( t3 - t2 );
	
	const B1 = ( ( t2 - t ) * A1 + ( t - t0 ) * A2 ) / ( t2 - t0 );
	const B2 = ( ( t3 - t ) * A2 + ( t - t1 ) * A3 ) / ( t3 - t1 );
	
	return     ( ( t2 - t ) * B1 + ( t - t1 ) * B2 ) / ( t2 - t1 );
}

function extrapolate( p0: Cartesian, p1: Cartesian ): Cartesian {
	return new THREE.Vector3(
		p1.x + p1.x - p0.x,
		p1.y + p1.y - p0.y,
		p1.z + p1.z - p0.z
	);
}

/**
 * Applies a sinusoidal transformation to the given value t, assuming t is in
 * the range [0,1]. Based on the given curve biases, the returned value will be
 * the value of t pushed slightly to the side of the higher bias. The sum of
 * the given biases should equal 1.
 */
function applyCurveBias( t: number, leftCurveBias: number, rightCurveBias: number ): number {
	const theta = t * HALF_PI;
	return leftCurveBias * ( 1 - Math.cos( theta ) ) + rightCurveBias * Math.sin( theta );
}

class SplineInterpolator {
	protected p0: Cartesian;
	protected p1: Cartesian;
	protected p2: Cartesian;
	protected p3: Cartesian;
	protected dp0p1: number;
	protected dp1p2: number;
	protected dp2p3: number;
	protected leftTriangleArea: number;
	protected rightTriangleArea: number;
	
	protected initialize( points: Cartesian[], pixelWorldRatio: number, closed: boolean ): void {
		if( closed ) {
			const lastPoint = points[ points.length - 1 ];
			points.push( points[ 0 ], points[ 1 ] );
			points.unshift( lastPoint );
		}
		else {
			points.push( extrapolate( points[ points.length - 2 ], points[ points.length - 1 ] ) );
			points.unshift( extrapolate( points[ 1 ], points[ 0 ] ) );
		}
		this.p0 = undefined;
		this.p1 = points[ 0 ];
		this.p2 = points[ 1 ];
		this.p3 = points[ 2 ];
		this.dp0p1 = 0;
		this.dp1p2 = this.p1.distanceTo( this.p2 );
		this.dp2p3 = this.p2.distanceTo( this.p3 );
		this.leftTriangleArea = areaOfTriangle( this.p1, this.p2, this.p3 ) * pixelWorldRatio * pixelWorldRatio;
		this.rightTriangleArea = 0;
	}
	
	/**
	 * Generates a list of Point objects that form a smooth curve based on the
	 * given list of Point objects. This is done by taking each sequence of 4
	 * consecutive points and using them as control points to draw a bezier curve
	 * between the inner two. The resolution (number of points) of each curve
	 * segment is determined by the area of the two consecutive triangles formed by
	 * the control points ( [p0,p1,p2] and [p1,p2,p3] ).
	 */
	public generateCurve( points: Cartesian[], pixelWorldRatio: number, closed: boolean ): Cartesian[] {
		if( points.length < 3 ) {
			return points;
		}
		
		this.initialize( points, pixelWorldRatio, closed );
		
		const curvePoints = [];
		for( let i = 3; i < points.length; i++ ) {
			this.p0 = this.p1;
			this.p1 = this.p2;
			this.p2 = this.p3;
			this.p3 = points[ i ];
			this.dp0p1 = this.dp1p2;
			this.dp1p2 = this.dp2p3;
			this.dp2p3 = this.p2.distanceTo( this.p3 );
			this.rightTriangleArea = areaOfTriangle( this.p1, this.p2, this.p3 ) * pixelWorldRatio * pixelWorldRatio;
			this.generateSegment( curvePoints );
			this.leftTriangleArea = this.rightTriangleArea;
		}
		
		curvePoints.push( this.p2 );
		
		return curvePoints;
	}

	/**
	 * Generates a curve segment between points p1 and p2 based on the adjacent
	 * points p0 and p3. The resolution (number of points) of each curve segment is
	 * determined by the area of the two consecutive triangles formed by the given
	 * points ( [p0,p1,p2] and [p1,p2,p3] ). The points on the curve segment are
	 * pushed onto the given array of points.
	 */
	protected generateSegment( curvePoints: Cartesian[] ): void {
		const totalArea = this.leftTriangleArea + this.rightTriangleArea;
		const leftCurveBias = totalArea === 0 ? 0.5 : this.leftTriangleArea / totalArea;
		const rightCurveBias = 1 - leftCurveBias;
		
		const t0 = 0;
		const t1 = Math.sqrt( this.dp0p1 ) + t0;
		const t2 = Math.sqrt( this.dp1p2 ) + t1;
		const t3 = Math.sqrt( this.dp2p3 ) + t2;
		
		const numPoints = this.resolutionOfSegment( totalArea ) - 1;
		for( let i = 0; i < numPoints; i++ ) {
			const t = applyCurveBias( i / numPoints, leftCurveBias, rightCurveBias ) * ( t2 - t1 ) + t1;
			curvePoints.push( new THREE.Vector3(
				CatmullRom( t, t0, t1, t2, t3, this.p0.x, this.p1.x, this.p2.x, this.p3.x ),
				CatmullRom( t, t0, t1, t2, t3, this.p0.y, this.p1.y, this.p2.y, this.p3.y ),
				CatmullRom( t, t0, t1, t2, t3, this.p0.z, this.p1.z, this.p2.z, this.p3.z )
			) );
		}
	}
	
	/**
	 * Returns the number of points needed to make a curve segment appear smooth
	 * based on the given sum of the areas of the left and right triangles formed
	 * by the segment's control points.
	 */
	protected resolutionOfSegment( areaOfTriangles: number ): number {
		return Math.max( 2, Math.round( Math.pow( areaOfTriangles, 0.25 ) ) );
	}
}

const interpolator = new SplineInterpolator();

export function interpolatePoints( points: Cartesian[], pixelWorldRatio: number, closed: boolean ): Cartesian[] {
	return interpolator.generateCurve( points, pixelWorldRatio, closed );
}