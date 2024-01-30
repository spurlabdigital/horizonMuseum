import * as THREE from 'three'
import { useGlobalState } from '../js/store'
import PlaceDot from './PlaceDot'
import { useRoute } from 'vue-router'

export default class PlaceDots extends THREE.Group {
  constructor(root) {
    super()
    this.root = root
    this.places = root.places
    this.markers = {}

    this.addDots()

    this.globalStore = useGlobalState()
    this.route = useRoute()

    this.globalStore.$onAction((action) => {
      if (action.name === 'showPlace' && action.args[0]) {
        this.markers[action.args[0]].highlight =
          this.route.name === 'horizon' ? 1 : 0

        this.markers[action.args[0]].colorize =
          this.route.name === 'horizon' ? 1 : 0

        this.markers[action.args[0]].children[0].renderOrder = 100
      }
      if (action.name === 'hidePlace' && action.args[0]) {
        this.markers[action.args[0]].highlight = 0
        this.markers[action.args[0]].colorize = 0
        this.markers[action.args[0]].children[0].renderOrder = 90
      }
    })
  }

  hideAll() {
    for (let i = 0; i < this.places.children.length; i++) {
      const places = this.places.children[i]
      this.markers[places.name].highlight = 0
      this.markers[places.name].colorize = 0
      this.markers[places.name].children[0].renderOrder = 90
    }
  }

  showDot(name) {
    this.markers[name].highlight = 1
    this.markers[name].colorize = 1
    this.markers[name].children[0].renderOrder = 100
  }

  addDots() {
    for (let i = 0; i < this.places.children.length; i++) {
      const places = this.places.children[i]

      this.markers[places.name] = new PlaceDot(places)
      this.add(this.markers[places.name])
    }

    this.root.scene.add(this)
  }
}
