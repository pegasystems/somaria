module.exports.verifyObjects = ( drawable, expectedObjectCount ) => {
	let objects = drawable.create3dObjects();
	expect( objects.length ).toBe( expectedObjectCount );
	expect( drawable.getObjects() ).toEqual( objects );
	return objects;
};

module.exports.getQuaternion = ( x, y, z ) => {
	let quaternion = new THREE.Quaternion();
	return quaternion.setFromEuler( new THREE.Euler( x, y, z ), true );
};

module.exports.getTranslatedMatrix = ( position, scale, rotation, anchorX, anchorY, anchorZ ) => {
	const translationMatrix = new THREE.Matrix4().makeTranslation( position.x, position.y, position.z );
	const anchorTranslationMatrix = new THREE.Matrix4().makeTranslation( anchorX, anchorY, anchorZ );
	const euler = new THREE.Euler( rotation.x, rotation.y, rotation.z );
	const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler( euler );
	const scaleMatrix = new THREE.Matrix4().makeScale( scale.x, scale.y, scale.z );

	return translationMatrix.multiply( rotationMatrix ).multiply( scaleMatrix ).multiply( anchorTranslationMatrix );
};

module.exports.verifyColor = ( object, color ) => {
	expect( object.material.color.getHex() ).toBe( color.getHex() );
	expect( object.material.transparent ).toBe( true );
	expect( object.material.opacity ).toBe( color.a );
};