import { useRoute, useRouter } from 'vue-router'
import { useCmsStore } from '../js/cmsStore'
import { SimpleDamper } from './simpleDamper'
import anime from 'animejs'
import { useGlobalState } from '../js/store'
import { watch } from 'vue'

export default class CameraController {
  constructor(root) {
    this.route = useRoute()
    this.cmsStore = useCmsStore()
    this.router = useRouter()
    this.globalStore = useGlobalState()

    this.root = root
    this.renderer = root.renderer
    this.camera = root.camera
    this.controls = root.controls
    this.mainloop = root.mainloop
    this.disable = false

    this.places = root.places

    this.shiftCameraDamper = new SimpleDamper(0, 0.01, () => {
      this.shiftXCameraposition(this.shiftCameraDamper.value)
    })

    this.mainloop.on('update', () => {
      this.updateCamera()
    })

    this.setupControls()
    this.updateCamera()

    window.addEventListener('gotoID', (e) => {
      this.gotoPlace(e.detail.id)
    })

    const route = useRoute()

    watch(
      () => route.fullPath,
      () => {
        if (route.name === 'place') {
          // eslint-disable-next-line prettier/prettier
                    this.globalStore.listenForScroll = false
          setTimeout(() => {
            this.globalStore.listenForScroll = true
          }, 1000)

          this.gotoPlace(route.params.id)
        }
        if (route.name === 'person') {
          this.globalStore.listenForScroll = false
          setTimeout(() => {
            this.globalStore.listenForScroll = true
          }, 1000)

          const startStation = this.cmsStore.getPersonBySubID(route.params.id)
            .stations[0]

          this.gotoPlace(startStation.location.split('/').pop())
        }
      }
    )
  }

  gotoPlace(id) {
    if (this.disable) return

    const place = this.cmsStore.mappedPlaces.find((place) => {
      return place.id === id
    })
    this.root.controls.enabled = false
    this.root.placeDots.hideAll()
    this.root.placeDots.showDot('standorte/' + id)
    this.globalStore.setActivePlace(id)

    this.rotateCamera(place.rotation)
  }

  updateCamera() {
    if (this.route.name === 'horizon' || this.route.name === 'Home') {
      this.shiftCameraDamper.value = 0
    } else {
      this.shiftCameraDamper.value = 1
    }
  }

  setupControls() {
    this.controls.target.set(0, 0.01, 0)
    this.controls.minDistance = 3.13
    this.controls.maxDistance = 7.13
    this.controls.enablePan = false
    this.controls.dampingFactor = 0.05
    this.controls.rotateSpeed = 0.2

    this.controls.minPolarAngle = 1.2
    this.controls.maxPolarAngle = 1.4
    setTimeout(() => {
      this.controls.maxPolarAngle = 1.5
    }, 1)
  }

  shiftXCameraposition(position) {
    this.camera.setViewOffset(
      this.renderer.domElement.width,
      this.renderer.domElement.height,
      (this.renderer.domElement.width / 9) * position,
      this.renderer.domElement.height * -0.12,
      this.renderer.domElement.width,
      this.renderer.domElement.height
    )
  }

  rotateCamera(rotation) {
    const getRotation = this.root.controls.getAzimuthalAngle()
    this.root.controls.maxAzimuthAngle = getRotation
    this.root.controls.minAzimuthAngle = getRotation

    let targetRotation = (rotation + Math.PI + 0.0) % (Math.PI * 2)
    if (targetRotation > Math.PI) {
      targetRotation = targetRotation - Math.PI * 2
    }

    //clac the shortest way
    if (Math.abs(targetRotation - getRotation) > Math.PI) {
      if (targetRotation > getRotation) {
        targetRotation = targetRotation - Math.PI * 2
      } else {
        targetRotation = targetRotation + Math.PI * 2
      }
    }

    anime({
      targets: this.root.controls,
      maxAzimuthAngle: targetRotation,
      minAzimuthAngle: targetRotation,
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        this.root.controls.enabled = true
        this.root.controls.maxAzimuthAngle = +Infinity
        this.root.controls.minAzimuthAngle = -Infinity
      }
    })
  }
}
