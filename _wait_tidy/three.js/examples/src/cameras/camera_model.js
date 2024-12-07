import {
  Vector3, Matrix4,
  Mesh, MeshBasicMaterial,
  Float32BufferAttribute, BufferGeometry,
} from 'three';

const _projectionMatrixInverse = new Matrix4();
const _matrixWorld = new Matrix4();
const _vector = new Vector3();


const _ndcPos = [
  1, 1,-1,
 -1, 1,-1,
 -1,-1,-1,
  1,-1,-1,

  1, 1, 1,
 -1, 1, 1,
 -1,-1, 1,
  1,-1, 1,
]
const _indexes = [
  // 前
  0, 1, 2,
  2, 3, 0,
  // 后
  4, 7, 6,
  6, 5, 4,
  // 左
  1, 5, 6,
  6, 2, 1,
  // 右
  4, 0, 3,
  3, 7, 4,
  // 上
  4, 5, 1,
  1, 0, 4,
  // 下
  3, 2, 6,
  6, 7, 3,
]
const _materials = [
  new MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3,
  }),
  new MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.3,
  }),

  new MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3,
  }),

  new MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3,
  }),

  new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
  }),

  new MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.3,
  }),
]

export default class CameraModel extends Mesh{
  constructor(camera, materials = _materials){
    const geometry = new BufferGeometry();

    geometry.setAttribute('position', new Float32BufferAttribute( new Array(24), 3 ) )
    geometry.setIndex(_indexes);

    if( Array.isArray(materials) ){
      if( materials.length === 6 ){
        geometry.addGroup(0, 6, 0);
        geometry.addGroup(6, 6, 1);
        geometry.addGroup(12, 6, 2);
        geometry.addGroup(18, 6, 3);
        geometry.addGroup(24, 6, 4);
        geometry.addGroup(30, 6, 5);
      }
    }else{

    }

    super( geometry, materials );


    this.geometry = geometry;
    this.materials = materials;

    this.update(camera);
  }

  update(camera){

    _projectionMatrixInverse.copy(camera.projectionMatrixInverse);

    camera.updateWorldMatrix(false, false);
    _matrixWorld.copy(camera.matrixWorld);

    let position = this.geometry.getAttribute( 'position' );

    for( let i = 0; i < _ndcPos.length; i+=3 ){

      _vector.set(_ndcPos[i], _ndcPos[i+1], _ndcPos[i+2])
        .applyMatrix4( _projectionMatrixInverse );

      position.array[i] = _vector.x;
      position.array[i+1] = _vector.y;
      position.array[i+2] = _vector.z;
    }

    position.needsUpdate = true;

    this.geometry.computeBoundingSphere();
    this.geometry.computeBoundingBox();

    this.position.copy( camera.position );
    this.rotation.copy( camera.rotation );
    this.scale.copy( camera.scale );
  }

}
