import * as THREE from 'three'
import { Text } from 'troika-three-text'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default class Shishi extends THREE.Group {
  constructor(root) {
    super()

    this.root = root

    this.addMarkes()

    this.glftLoader = new GLTFLoader()
    this.glftLoader.load('kompass.glb', (gltf) => {
      this.kompass = gltf.scene
      this.kompass.traverse((child) => {
        if (child.type === 'LineSegments') {
          child.material.transparent = true
          child.material.opacity = 0.3
        }
        if (child.type === 'Mesh') {
          child.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#5e5e5e')
          })
        }
      })
      this.kompass.scale.set(150, 150, 150)
      this.kompass.position.y = 2
      this.add(this.kompass)
    })

    this.root.scene.add(this)
  }

  addMarkes() {
    this.sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('./marker0.png'),
        depthTest: false,
        depthWrite: false
      })
    )
    this.sprite.scale.set(0.2, 0.2, 0.2)
    this.sprite.position.set(0, 0.1, 0)
    this.add(this.sprite)
  }
}
