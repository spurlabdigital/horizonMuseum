import * as THREE from 'three'

import RootPatch from './vvv/rootPatch/rootPatch.js'
import Places from './Places'
import PathLines from './PathLines'
import ThreejsStore from './threejsStore'

import Picker from './Picker'
import ShowActivePlace from './ShowActivePlace'
import PlaceDots from './PlaceDots'
import DeviceHandling from './DeviceHandling'

import Background from './background'
import CameraController from './cameraController'
import MarkerController from './MarkerController'
import Shishi from './shishi'

export default class Root extends RootPatch {
  constructor() {
    super()
    this.threejsStore = new ThreejsStore()

    this.deviceHandler = new DeviceHandling()

    this.background = new Background(this)

    this.places = new Places(this)
    this.placeDots = new PlaceDots(this)
    this.activePlace = new ShowActivePlace(this)
    this.pathLines = new PathLines(this)
    // this.picker = new Picker(this)

    this.shishi = new Shishi(this)

    this.cameraController = new CameraController(this)
    this.markerController = new MarkerController(this)
  }
}
