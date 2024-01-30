import { getGPSPosition } from './vvv/geoHelper'
import EventEmitter from './vvv/globals/eventEmitter'
import { useGlobalState } from '../js/store'
import { DeviceOrientationControlsIOS } from './shared/DeviceOrientationControllsIOS'

export default class DeviceHandling extends EventEmitter {
  constructor(root) {
    super()

    this.root = root

    this.globalStore = useGlobalState()

    this.gps = {
      latitude: this.globalStore.gps.latitude,
      longitude: this.globalStore.gps.longitude,
      heading: 0,
      headingAccuracy: 360
    }

    this.gpsHistoryMode = false
    this.firstRealEvent = false
  }
}
