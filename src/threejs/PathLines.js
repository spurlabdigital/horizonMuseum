import * as THREE from 'three'
import SinglePath from './SinglePath'
import { useCmsStore } from '../js/cmsStore'
import Numbers from './Numbers'
import { useGlobalState } from '../js/store'
import anime from 'animejs'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

export default class PathLines extends THREE.Group {
  constructor(root) {
    super()

    this.root = root
    this.places = root.places

    this.cmsStore = useCmsStore()
    this.globalState = useGlobalState()
    this.route = useRoute()

    this.addPathLines()
    this.addNumbers()

    watch(
      () => this.route.fullPath,
      () => {
        this.handleState()
      }
    )

    this.handleState()
    this.root.scene.add(this)
  }

  handleState() {
    if (this.route.name === 'person') {
      this.highlightBiography(this.route.params.id)
    } else if (this.route.name === 'place') {
      this.higlightPlace(this.route.params.id)
    } else {
      this.fadeToNormal()
    }
  }

  higlightPlace(placeID) {
    const persons = this.cmsStore.getPlacesBySubID(placeID).persons

    this.children.forEach((child) => {
      const isInPersonList = persons.some((person) => {
        return person.id === child.name
      })

      const alpha = isInPersonList ? 1 : 0.1
      const highlight = isInPersonList ? 0.1 : 0
      const isLine = child.constructor.name === 'SinglePath' ? 1 : 0

      anime({
        targets: child,
        highlight: highlight * isLine,
        alpha: alpha,
        duration: 500,
        easing: 'easeInOutQuad'
      })
    })
  }
  fadeToNormal() {
    this.children.forEach((child) => {
      anime({
        targets: child,
        highlight: 0,
        alpha: 1,
        duration: 500,
        easing: 'easeInOutQuad'
      })
    })
  }

  highlightBiography(personID) {
    this.children.forEach((child) => {
      if (child.name.split('/').pop() === personID) {
        anime({
          targets: child,
          highlight: 1,
          alpha: 1,
          duration: 500,
          easing: 'easeInOutQuad'
        })
      } else {
        anime({
          targets: child,
          highlight: 0,
          alpha: 0.1,
          duration: 500,
          easing: 'easeInOutQuad'
        })
      }
    })
  }

  addPathLines() {
    const persons = this.cmsStore.getPersons
    persons.forEach((person) => {
      const singlePath = new SinglePath(this.root, person)
      this.add(singlePath)
    })
  }

  addNumbers() {
    const persons = this.cmsStore.getPersons
    persons.forEach((person) => {
      const numbers = new Numbers(this.root, person)
      this.add(numbers)
    })
  }
}
