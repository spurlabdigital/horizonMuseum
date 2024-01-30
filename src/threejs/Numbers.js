import * as THREE from 'three'

export default class Numbers extends THREE.Group {
  constructor(root, person) {
    super()
    this.root = root
    this.marker = root.places.children

    this.name = person.id
    this._alpha = 0
    this.shiftValue = 0.035

    this.aktivePerson = person
    this.getStationsPositions()
  }

  get highlight() {
    return this._alpha
  }

  set highlight(value) {
    this._alpha = value
    this.traverse((child) => {
      if (child.type === 'Sprite') {
        child.material.opacity = this._alpha
      }
    })
  }

  getStationsPositions() {
    const stations = this.aktivePerson.stations
    const userData = []

    stations.forEach((station) => {
      const findStationMarker = this.marker.find((marker) => {
        return marker.name === station.location
      })
      if (findStationMarker === undefined) {
        console.error('findStationMarker', station)
      } else {
        userData.push(findStationMarker.userData)
      }
    })

    this.addNumber(userData)
  }

  addNumber(userData) {
    let history = ''

    for (let lineIndex = 0; lineIndex < userData.length; lineIndex++) {
      const startPoint = userData[lineIndex].position
      const id = userData[lineIndex].name

      const spriteMap = new THREE.TextureLoader().load(
        './' + (lineIndex + 1) + '.png'
      )
      const spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        transparent: true,
        opacity: this._alpha,
        color: new THREE.Color('#ffffff'),
        sizeAttenuation: false,
        depthWrite: false,
        depthTest: false
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.name = userData[lineIndex].id

      sprite.position.set(startPoint.x, startPoint.y, startPoint.z)

      sprite.scale.set(0.03, 0.03, 0.03)
      sprite.renderOrder = 110
      sprite.userData.shift = false
      if (history.includes(id)) {
        sprite.userData.shift = true

        const tempX = sprite.position.x
        sprite.position.x =
          tempX * Math.cos(this.shiftValue) -
          sprite.position.z * Math.sin(this.shiftValue)

        sprite.position.z =
          tempX * Math.sin(this.shiftValue) +
          sprite.position.z * Math.cos(this.shiftValue)
      }

      this.add(sprite)
      history += id + '__'
    }
  }
}
