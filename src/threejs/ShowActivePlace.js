import * as THREE from 'three'
import PickerMarker from './PickerMarker'
import { useRoute, useRouter } from 'vue-router'
import { useCmsStore } from '../js/cmsStore'
import ActivePlaceDot from './ActivePlaceDot'

export default class ShowActivePlace extends THREE.Group {
  constructor(root) {
    super()
    this.root = root
    this.places = root.places
    this.activePlaceDots = new THREE.Group()
    this.cmsStore = useCmsStore()

    this.addTextMarkers()

    this.activePlace = null
    this.route = useRoute()
    if (this.route.name === 'place') {
      this.activePlace = this.route.params.id
      this.updateDot()
    }

    // this.router = useRouter()
    // this.router.beforeEach((to) => {
    //   if (to.name === 'place') {
    //     this.activePlace = to.params.id
    //
    //     //rotate camera to place
    //     const place = this.places.children.find((place) => {
    //       return place.name.split('/').pop() === this.activePlace
    //     })
    //     this.places.rotateCamera(place.userData.rotation)
    //
    //     this.updateDot()
    //   } else {
    //     this.activePlace = null
    //     this.updateDot()
    //   }
    // })
  }

  addTextMarkers() {
    for (let i = 0; i < this.places.children.length; i++) {
      const marker = this.places.children[i]
      const textMarker = new ActivePlaceDot(marker, this.root)
      this.activePlaceDots.add(textMarker)
    }
    this.root.scene.add(this.activePlaceDots)
  }

  updateDot() {
    if (!this.activePlace) {
      this.activePlaceDots.children.forEach((dot) => {
        dot.visible = false
      })
    } else {
      this.activePlaceDots.children.forEach((dot) => {
        dot.visible = dot.name === this.activePlace
      })
    }
  }
}
