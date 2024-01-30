import * as THREE from 'three'
import { useCmsStore } from '../js/cmsStore'
import { calcAngle, calcDistance } from './vvv/geoHelper'
import { useGlobalState } from '../js/store'
import { MathUtils } from 'three'
import { useRoute, useRouter } from 'vue-router'
import router from '../js/router'

export default class Places extends THREE.Group {
  constructor(root) {
    super()
    this.root = root
    this.mainloop = root.mainloop
    this.camera = root.camera

    this.gps = this.root.deviceHandler.gps

    // this.syncGPSPositions()

    this.cmsStore = useCmsStore()
    this.globalStore = useGlobalState()

    this.userData.places = {}
    this.route = useRoute()
    this.router = useRouter()

    this.addLocations()

    this.raycaster = new THREE.Raycaster()

    this.root.output.canvas.addEventListener('touchstart', (event) => {
      const touch = event.touches[0]
      const x = (touch.clientX / window.innerWidth) * 2 - 1
      const y = -(touch.clientY / window.innerHeight) * 2 + 1

      this.handleTOuch(x, y)
    })

    this.root.output.canvas.addEventListener('click', (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      this.handleTOuch(x, y)
    })
  }

  handleTOuch(x, y) {
    this.raycaster.setFromCamera({ x, y }, this.camera)
    const intersects = this.raycaster.intersectObjects(this.children, true)

    if (intersects.length > 0) {
      const object = intersects[0].object

      if (this.route.name === 'person') {
        const stations = this.cmsStore.getPersonBySubID(
          this.globalStore.getActivePerson
        ).stations

        const isInStationList = stations.some((station) => {
          return station.location === object.name
        })

        if (isInStationList) {
          const id = object.name.split('/').pop()
          const event = new CustomEvent('gotoID', {
            detail: { id: object.name.split('/').pop() }
          })
          window.dispatchEvent(event)

          const eventMapbox = new CustomEvent('setNewMapPos', {
            detail: { id: object.name.split('/').pop() }
          })
          window.dispatchEvent(eventMapbox)

          // const element = document.getElementById('standorte/' + id)
          // if (element) {
          //   this.globalStore.listenForScroll = false
          //   setTimeout(() => {
          //     this.globalStore.listenForScroll = true
          //   }, 1000)
          //
          //   element.scrollIntoView({ behavior: 'smooth' })
          // }
        }
      } else {
        const event = new CustomEvent('gotoID', {
          detail: { id: object.name.split('/').pop() }
        })
        window.dispatchEvent(event)
        this.router.push({
          name: 'place',
          params: { id: object.name.split('/').pop() }
        })
      }
    }
  }

  addLocations() {
    const places = this.cmsStore.getPlaces

    const tempPlaceList = []

    places.forEach((place) => {
      let vector = this.GPSPositionToVector3(
        place.location.lat,
        place.location.lon
      )
      vector.rotation += Math.random() * 0.0001 - 0.00005
      const location = new THREE.Object3D()
      location.position.set(vector.x, vector.y, vector.z)
      location.lookAt(this.camera.position)
      location.name = place.id

      this.root.threejsStore.places[location.name] = false

      location.userData.name = place.name
      location.userData.id = place.id
      location.userData.longitude = place.location.lon
      location.userData.latitude = place.location.lat

      location.userData.rotation = vector.rotation
      location.userData.position = {
        x: vector.x,
        y: vector.y,
        z: vector.z
      }
      location.userData.distance = vector.distance

      tempPlaceList.push({
        id: place.id.split('/').pop(),
        name: place.name,
        distance: vector.distance,
        rotation: vector.rotation
      })
      //add sphere
      const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.0
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(0, 0, 0)
      sphere.name = place.id
      sphere.userData.rotation = vector.rotation
      location.add(sphere)

      this.add(location)
    })

    //sort the places by rotation
    tempPlaceList.sort((a, b) => {
      return a.rotation - b.rotation
    })

    this.globalStore.placeList = tempPlaceList

    this.root.scene.add(this)
  }

  GPSPositionToVector3(latitude, longitude) {
    let angle = calcAngle(
      latitude,
      longitude,
      this.gps.latitude,
      this.gps.longitude
    )

    const distance = calcDistance(
      latitude,
      longitude,
      this.gps.latitude,
      this.gps.longitude
    )

    const rotation = -MathUtils.degToRad(angle)
    let clampedDistance = MathUtils.clamp(distance, 0, 1000)
    let pseudoDistance = MathUtils.mapLinear(clampedDistance, 0, 1000, 250, 250)
    let pseudoHeight = MathUtils.mapLinear(clampedDistance, 0, 1000, 4, 10)

    const x = Math.sin(rotation) * pseudoDistance
    const y = pseudoHeight
    const z = Math.cos(rotation) * pseudoDistance

    return { x, y, z, rotation, distance }
  }

  setNoPlaces() {
    this.children.forEach((marker) => {
      this.globalStore.hidePlace(marker.name)
    })
  }
}
