import { RGBELoader } from 'three/addons/loaders/RGBELoader'
import FresnelMaterial from './vvv/shader/fresnel/fresnelMaterial'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'
import Debug from './vvv/rootPatch/Debug'
import DebugPanel from './vvv/modules/debugPanel'
export default class Background {
  constructor(root) {
    this.root = root
    this.scene = root.scene
    this.loader = new RGBELoader()
    this.loader.load('/textures/hdri/studio008.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping

      this.scene.background = texture
      this.scene.environment = texture
    })
    this.scene.backgroundBlurriness = 1
    this.scene.backgroundIntensity = 0.7

    this.fresnelMaterial = new FresnelMaterial()
    this.fresnelMaterial.uniforms.borderSharpness.value = 0.4
    this.fresnelMaterial.uniforms.minFresnelValue.value = 0.0
    this.fresnelMaterial.uniforms.alpha.value = 0.25
    this.fresnelMaterial.uniforms.fresnelPower.value = 10
    this.fresnelMaterial.uniforms.clip.value = 1
    this.fresnelMaterial.uniforms.fogPower.value = 26

    // this.debug = new DebugPanel(' glossy')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.borderSharpness, 'value', 0, 1)
    //   .name('borderSharpness')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.minFresnelValue, 'value', 0, 1)
    //   .name('minFresnelValue')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.alpha, 'value', 0, 1)
    //   .name('alpha')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.fresnelPower, 'value', 0, 100)
    //   .name('fresnelPower')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.clip, 'value', 0, 1)
    //   .name('clip')
    // this.debug
    //   .add(this.fresnelMaterial.uniforms.fogPower, 'value', 0, 100)
    //   .name('fogPower')

    this.envLight = new THREE.AmbientLight(0xffffff, 0.1)
    this.scene.add(this.envLight)

    this.glftLoader = new GLTFLoader()
    this.glftLoader.load('potsdam_mirror.glb', (gltf) => {
      this.city = gltf.scene
      this.city.traverse((child) => {
        if (child.isMesh) {
          // this.debug = new DebugPanel(child.material.name)
          // this.debug.add(child.material, 'roughness', 0, 1)
          // this.debug.add(child.material, 'metalness', 0, 1)
          // this.debug.add(child.material, 'flatShading').onChange(() => {
          //   child.material.needsUpdate = true
          // })
          // this.debug.addColor(child.material, 'color')

          child.material.environmentMapIntensity = 0.5
          child.material.envMap = this.scene.environment
          child.renderOrder = 20

          if (child.material.name === 'Stone') {
            child.material.roughness = 1
            child.material.metalness = 0
            child.material.color = new THREE.Color('#030303')
          }

          if (child.material.name === 'Water') {
            child.material.roughness = 0
            child.material.metalness = 0.963
            child.material.color = new THREE.Color('#182d5d')
          }

          if (child.material.name === 'Street') {
            child.material.roughness = 0.89
            child.material.metalness = 0
            child.material.color = new THREE.Color('#0c0c0c')
          }

          if (child.material.name === 'StoneLight') {
            child.material.roughness = 0.355
            child.material.metalness = 0.471
            child.material.color = new THREE.Color('#1e1e1e')
          }
        }
      })
      this.scene.add(this.city)
      this.glossy = this.city.clone()

      this.glossy.traverse((child) => {
        if (child.isMesh) {
          if (
            child.name === 'maposm_areas_footway' ||
            child.name === 'maposm_buildings'
          ) {
            child.material = this.fresnelMaterial
          } else {
            child.visible = false
          }

          // this.debug = new DebugPanel(child.name + ' glossy')
          // this.debug
          //   .add(child.material.uniforms.borderSharpness, 'value', 0, 1)
          //   .name('borderSharpness')
          // this.debug
          //   .add(child.material.uniforms.minFresnelValue, 'value', 0, 1)
          //   .name('minFresnelValue')
          // this.debug
          //   .add(child.material.uniforms.alpha, 'value', 0, 1)
          //   .name('alpha')
          // this.debug
          //   .add(child.material.uniforms.fresnelPower, 'value', 0, 100)
          //   .name('fresnelPower')
          // this.debug
          //   .add(child.material.uniforms.clip, 'value', 0, 1)
          //   .name('clip')
          // this.debug
          //   .add(child.material.uniforms.fogPower, 'value', 0, 100)
          //   .name('fogPower')
          //
          // console.log(child.name)
          child.renderOrder = 20
        }
      })
      this.scene.add(this.glossy)
    })
  }
}
