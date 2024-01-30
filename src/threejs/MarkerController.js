import { useGlobalState } from '../js/store'
import { useCmsStore } from '../js/cmsStore'
import { useRoute, useRouter } from 'vue-router'

export default class MarkerController {
  constructor(root) {
    this.root = root
    this.camera = root.camera
    this.mainloop = root.mainloop
    this.globalStore = useGlobalState()
    this.cmsStore = useCmsStore()
    this.route = useRoute()
    this.router = useRouter()

    this._timeout = null

    this.places = this.cmsStore.mappedPlaces

    this.userInteraction = false

    this.mainloop.on('update', () => {
      if (this.userInteraction) {
        this.checkMarkerVisibility()
      }
    })

    this.addControlsListener()
  }

  addControlsListener() {
    this.root.controls.addEventListener('start', () => {
      this.userInteraction = true
    })
    this.root.controls.addEventListener('end', () => {
      this.userInteraction = false
    })
  }

  checkMarkerVisibility() {
    function mod(n, m) {
      return ((n % m) + m) % m
    }

    this.camera.rotation.order = 'YXZ'

    const cameraRotation = mod(
      this.camera.rotation.y - this.root.scene.rotation.y,
      Math.PI * 2
    )

    let tempDistance = Infinity
    let tempMarker = null

    this.places.forEach((marker) => {
      const placeRotation = mod(marker.rotation + Math.PI, Math.PI * 2)

      let absoluteDifference = Math.abs(cameraRotation - placeRotation)

      if (absoluteDifference > Math.PI) {
        absoluteDifference = Math.PI * 2 - absoluteDifference
      }

      if (absoluteDifference < tempDistance) {
        tempDistance = absoluteDifference
        tempMarker = marker
      }
    })

    if (!tempMarker) {
      return
    }

    const isNewMarker = tempMarker.id !== this.globalStore.getActivePlace
    const isUserInteraction = this.root.controls.enabled
    const isPersonMode = this.route.name === 'person'

    if (isNewMarker && isUserInteraction && isPersonMode) {
      // const element = document.getElementById('standorte/' + tempMarker.id)
      // if (element) {
      //   this.globalStore.listenForScroll = false
      //   setTimeout(() => {
      //     this.globalStore.listenForScroll = true
      //   }, 1000)
      //
      //   element.scrollIntoView({ behavior: 'smooth' })
      // }
    }

    if (isNewMarker && isUserInteraction && !isPersonMode) {
      this.root.placeDots.hideAll()
      this.root.placeDots.showDot('standorte/' + tempMarker.id)
      this.globalStore.setActivePlace(tempMarker.id)

      if (this.route.name === 'place') {
        this.root.cameraController.disable = true
        this.router.push({ name: 'place', params: { id: tempMarker.id } })
        setTimeout(() => {
          this.root.cameraController.disable = false
        }, 1000)
      }
    }
  }
}
