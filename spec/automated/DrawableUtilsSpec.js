require( "./TestUtils" );
const THREE = require( "three" );
const DrawableUtils = require( "../build/core/utils/DrawableUtils" );

describe( "DrawableUtils", () => {
	it( "fully disposes an object", () => {
		let object = {
			geometry: jasmine.createSpyObj( "THREE.Geometry", [ "dispose" ] ),
			material: {
				dispose: jasmine.createSpy( "THREE.Material.dispose" ),
				map: jasmine.createSpyObj( "THREE.Texture", [ "dispose" ] )
			}
		};
		
		DrawableUtils.disposeObject( object );
		
		expect( object.geometry.dispose ).toHaveBeenCalled();
		expect( object.material.dispose ).toHaveBeenCalled();
		expect( object.material.map.dispose ).toHaveBeenCalled();
	} );
	
	it( "sets the side property to double-side for 2d materials", () => {
		let material = DrawableUtils.create2DMaterial( THREE.MeshBasicMaterial, { rgb: 0, opacity: 0 } );
		expect( material.side ).toBe( THREE.DoubleSide );
	} );
	
	it( "sets the side property to front-side for 3d materials", () => {
		let material = DrawableUtils.create3DMaterial( THREE.MeshBasicMaterial, { rgb: 0, opacity: 0 } );
		expect( material.side ).toBe( THREE.FrontSide );
	} );
} );