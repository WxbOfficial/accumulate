
export function createMathPlane(
	name,
	a, b, c, d,
	ltX, ltY, rtX, rtY,
	lbX, lbY, rbX, rbY,
	scene
){
	const mathPlane = new BABYLON.Mesh(name, scene);

	// aX + bY + cZ + d = 0;
	mathPlane.a = a;
	mathPlane.b = b;
	mathPlane.c = c;
	mathPlane.d = d;

	mathPlane.ltX = ltX;
	mathPlane.ltY = ltY;
	mathPlane.rtX = rtX;
	mathPlane.rtY = rtY;
	mathPlane.lbX = lbX;
	mathPlane.lbY = lbY;
	mathPlane.rbX = rbX;
	mathPlane.rbY = rbY;

	const {
		positions, normals, uvs
	} = getMathPlaneVerticesData( mathPlane );

	// Indices
	const indices = [
		0, 1, 2,
		0, 2, 3,
	];

	// mathPlane.setVertices(vertices, 1, true);

	mathPlane.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, true);
	mathPlane.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, true);
	mathPlane.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, true);
	mathPlane.setIndices(indices);

	return mathPlane;
}

export function updateMathPlane( mathPlane ){

	const
		{
			positions, normals, uvs
		} = getMathPlaneVerticesData( mathPlane );

	mathPlane.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
	mathPlane.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
	mathPlane.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
}

function getMathPlaneVerticesData(mathPlane){
	const
		positions = [], normals = [],
		{
			a, b, c, d,
			ltX, ltY, rtX, rtY,
			lbX, lbY, rbX, rbY,
		} = mathPlane,

		normal = new BABYLON.Vector3(a, b, c);

	normal.normalize();

	// Vertices
	positions.push( lbX, lbY, (-d - a * lbX - b * lbY) / c );
	normals.push( normal.x, normal.y, normal.z );
	positions.push( rbX, rbY, (-d - a * rbX - b * rbY) / c );
	normals.push( normal.x, normal.y, normal.z );
	positions.push( rtX, rtY, (-d - a * rtX - b * rtY) / c );
	normals.push( normal.x, normal.y, normal.z );
	positions.push( ltX, ltY, (-d - a * ltX - b * ltY) / c );
	normals.push( normal.x, normal.y, normal.z );


	return {
		positions, normals,
		uvs: [
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
		],
	};
}
