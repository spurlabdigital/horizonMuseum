import * as THREE from 'three'
import fresnelVertex from './fresnelVertex.glsl?raw'
import fresnelFragment from './fresnelFragment.glsl?raw'
import headFragment from './headFragment.glsl?raw'
import headVertex from './headVertex.glsl?raw'

export default class FresnelMaterial extends THREE.MeshStandardMaterial {
  constructor() {
    super()

    this.side = THREE.DoubleSide
    this.transparent = true
    this.blending = 1
    this.depthWrite = false
    this.depthTest = false

    this.uniforms = {
      borderSharpness: { type: 'f', value: 2.0 },
      minFresnelValue: { type: 'f', value: 0.0 },
      alpha: { type: 'f', value: 1 },
      fresnelPower: { type: 'f', value: 1.5 },
      glowColor: { type: 'c', value: new THREE.Color('#ffffff') },
      clip: { type: 'f', value: 0.9 },
      fogPower: { type: 'f', value: 1.0 }
    }

    this.onBeforeCompile = (shader) => {
      for (const key in this.uniforms) {
        shader.uniforms[key] = this.uniforms[key]
      }

      shader.fragmentShader = headFragment + shader.fragmentShader
      shader.vertexShader = headVertex + shader.vertexShader

      const vertexClean = fresnelVertex.replace(
        'void main(){',
        '#include <fog_vertex>'
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <fog_vertex>',
        vertexClean
      )
      const fragmentClean = fresnelFragment.replace(
        'void main(){',
        '#include <dithering_fragment>'
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        fragmentClean
      )
    }
  }
}
