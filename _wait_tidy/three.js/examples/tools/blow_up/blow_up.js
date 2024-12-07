import * as THREE from 'three';


const
	_vector3 = new THREE.Vector3(),
	_matrix4 = new THREE.Matrix4();

// 支持 mesh, skinnedMesh( skinnedMesh 稍微有点混乱 )
// 待完善其他 mesh 的偏移
// 待完善自定义路径操作
export default class BlowUp{

	constructor( model, scene ){

		const
			blowUpHelper = new THREE.Group(),

			modelBox3 = new THREE.Box3(
				new THREE.Vector3( Infinity, Infinity, Infinity),
				new THREE.Vector3( -Infinity, -Infinity, -Infinity)
			),
			modelCenter = new THREE.Vector3(),

			meshMap = new Map(),

			_min = new THREE.Vector3(),
			_max = new THREE.Vector3();

		model.traverse(( node )=>{

			if( node.geometry && !meshMap.has( node ) ){

				if( node.isInstancedMesh ){
					console.warn('应该不支持 InstancedMesh 吧, 试试吧, 需要注意');
				} else if( node.isBatchedMesh ){
					console.warn('BatchedMesh 不知道支不支持, 试试吧, 需要注意');
				}

				// const { matrix, matrixWorld } = node;

				const meshMessage = {

					position: node.position.clone(),
					quaternion: node.quaternion.clone(),
					scale: node.scale.clone(),

					positionWorld: new THREE.Vector3(),
					quaternionWorld: new THREE.Quaternion(),
					scaleWorld: new THREE.Vector3(),
					centerWorld: new THREE.Vector3(),

					// matrix: matrix.clone(),
					// matrixInvert: matrix.clone().invert(),

					// matrixWorld: matrixWorld.clone(),
					// matrixWorldInvert: matrixWorld.clone().invert(),

					// parentMatrix: matrixWorld.clone().multiply( matrix.clone().invert() ),
					parentMatrixInvert: new THREE.Matrix4(),

					helper: new THREE.Group().add(new THREE.Mesh(
						new THREE.SphereGeometry(0.04),
						new THREE.MeshBasicMaterial({
							depthTest: false,
						}),
					)),
				}

				meshMap.set( node, meshMessage );

				blowUpHelper.add( meshMessage.helper );
			}
		});

		const worldCenterSphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.04),
			new THREE.MeshBasicMaterial({
				color: 0xff0000,
				depthTest: false,
			}),
		);
		blowUpHelper.add( worldCenterSphere );
		scene.add( blowUpHelper );

		resetModelMessage();
		function resetModelMessage(){

			model.updateMatrixWorld( true, true );

			modelBox3.makeEmpty();

			meshMap.forEach(( meshMessage, mesh, map )=>{

				const {
					geometry, matrix, matrixWorld,
					position, quaternion, scale
				} = mesh;

				let boundingBox;

				if( !geometry.boundingBox ){

					geometry.computeBoundingBox();
				}

				if( mesh.isSkinnedMesh ){

					mesh.computeBoundingBox();

					if( !mesh.boundingBox ){

						mesh.computeBoundingBox();
					}

					boundingBox = mesh.boundingBox;
				}else {

					boundingBox = geometry.boundingBox;
				}

				meshMessage.position.copy( position );
				meshMessage.quaternion.copy( quaternion );
				meshMessage.scale.copy( scale );


				matrixWorld.decompose(
					meshMessage.positionWorld,
					meshMessage.quaternionWorld,
					meshMessage.scaleWorld,
				);

				// parentMatrixInvert
				// 1.
				// meshMessage.parentMatrixInvert.identity();

				// if( mesh.parent ){

				// 	meshMessage.parentMatrixInvert
				// 		.copy( mesh.parent.matrixWorld )
				// 		.invert();
				// }
				// 2.
				meshMessage.parentMatrixInvert
					.copy( matrix )
					.invert()
					.premultiply( matrixWorld )
					.invert()

				_min.copy( boundingBox.min ).applyMatrix4( matrixWorld );
				_max.copy( boundingBox.max ).applyMatrix4( matrixWorld );

				modelBox3.expandByPoint( _min );
				modelBox3.expandByPoint( _max );

				boundingBox.getCenter( meshMessage.centerWorld );
				meshMessage.centerWorld.applyMatrix4( matrixWorld );

				meshMessage.helper.position.copy( meshMessage.centerWorld );
			});
			modelBox3.getCenter( modelCenter );

			worldCenterSphere.position.copy( modelCenter );
		}

		return {
			blowUpHelper,
			resetModelMessage,
			blowUpMeshes( skew ){

				meshMap.forEach(( meshMessage, mesh, map )=>{

					_vector3
						.copy( meshMessage.centerWorld )
						.sub( modelCenter )
						.normalize()
						.multiplyScalar( skew );

					meshMessage.helper.position
						.copy( meshMessage.centerWorld )
						.add( _vector3 );

					mesh.position
						.copy( meshMessage.positionWorld )
						.add( _vector3 )
						.applyMatrix4( meshMessage.parentMatrixInvert );

					if( mesh.isSkinnedMesh ){

						if( mesh.bindMode === THREE.AttachedBindMode ){
							// 暂时先这样吧
							// 1. 要改 shader 进行配合, bindMatrix 移到 bindMatrixInverse 前面
							mesh.bindMatrix.compose(
								mesh.position,
								mesh.quaternion,
								mesh.scale,
							);

						}else if( mesh.bindMode === THREE.DetachedBindMode ){
							// console.warn('一般来说, 没什么问题, 暂时没什么操作, 出问题了再看看');
						}else {

							console.error('未知的 bindMode:', mesh.bindMode);
						}
					}
				});
			}
		}
	}
}