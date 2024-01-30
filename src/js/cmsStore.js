import { defineStore } from 'pinia'
import { calcAngle, calcDistance } from '../threejs/vvv/geoHelper'
import { MathUtils } from 'three'

export const useCmsStore = defineStore({
  id: 'cms',
  state: () => ({
    language: 'de',
    gps: {
      latitude: 52.39166923812494,
      longitude: 13.062920385818979
    },
    loaded: false,
    de: {
      persons: null,
      places: null,
      info: null,
      startPage: null,
      help: null
    },
    mappedPlaces: []
  }),
  getters: {
    getContent: (state) => state[state.language],
    getPlaces: (state) => state[state.language].places,
    getInfoSites: (state) => state[state.language].info,
    getStartPage: (state) => state[state.language].startPage,
    getPersons: (state) => state[state.language].persons,
    getPersonByID: (state) => (id) => {
      return state[state.language].persons.find((person) => person.id === id)
    },
    getPersonBySubID: (state) => (id) => {
      return state[state.language].persons.find(
        (person) => person.id.split('/').pop() === id
      )
    },
    getPlacesByID: (state) => (id) => {
      return state[state.language].places.find((place) => place.id === id)
    },
    getPlacesBySubID: (state) => (id) => {
      return state[state.language].places.find(
        (place) => place.id.split('/').pop() === id
      )
    }
  },
  actions: {
    setLanguage(newLanguage) {
      this.language = newLanguage
    },
    addPersonsToPlaces(lng) {
      this[lng].persons.forEach((person) => {
        if (person.stations.length < 1) return
        person.stations.forEach((station) => {
          const localID = station.location
          this[lng].places.find((place) => {
            if (place.id === localID) {
              if (!place.persons) {
                place.persons = []
              }
              if (!place.persons.includes(person)) {
                place.persons.push(person)
              }
            }
          })
        })
      })
    },
    convertPlacesToCoordinates(lng) {
      let tempPlaceList = []
      this[lng].places.forEach((place) => {
        let vector = GPSPositionToVector3(
          this.gps.latitude,
          this.gps.longitude,
          place.location.lat,
          place.location.lon
        )

        vector.rotation += Math.random() * 0.0001 - 0.00005
        vector.rotation = mod(vector.rotation, Math.PI * 2)

        const output = {
          id: place.id.split('/').pop(),
          name: place.name,
          distance: vector.distance,
          rotation: vector.rotation,
          position: {
            x: vector.x,
            y: vector.y,
            z: vector.z
          },
          lon: Number(place.location.lon),
          lat: Number(place.location.lat)
        }
        tempPlaceList.push(output)
      })
      tempPlaceList.sort((a, b) => {
        return a.rotation - b.rotation
      })
      this.mappedPlaces = tempPlaceList
    },
    fetchData() {
      fetch(globalSettings.cmsURL + 'de/api/places.json')
        .then((response) => response.json())
        .then((data) => {
          data.sort((a, b) => {
            if (a.name < b.name) {
              return -1
            }
            if (a.name > b.name) {
              return 1
            }
            return 0
          })

          this.de.places = data
          if (this.de.persons) {
            this.addPersonsToPlaces('de')
          }
          this.convertPlacesToCoordinates('de')
          checkIfLoaded(this)
        })
      fetch(globalSettings.cmsURL + 'de/api/persons.json')
        .then((response) => response.json())
        .then((data) => {
          this.de.persons = data
          if (this.de.places) {
            this.addPersonsToPlaces('de')
          }
          checkIfLoaded(this)
        })
      fetch(globalSettings.cmsURL + 'de/api/info.json')
        .then((response) => response.json())
        .then((data) => {
          this.de.info = data
          checkIfLoaded(this)
        })
      fetch(globalSettings.cmsURL + 'de/api/start.json')
        .then((response) => response.json())
        .then((data) => {
          this.de.startPage = data.find((item) => {
            // console.log(item)
            return item.id === 'startseite-ausstellung'
          })
          checkIfLoaded(this)
        })
      fetch(globalSettings.cmsURL + 'de/help.json')
        .then((response) => response.json())
        .then((data) => {
          this.de.help = data[0]
          checkIfLoaded(this)
        })
    }
  }
})

function GPSPositionToVector3(rootLat, rootLong, latitude, longitude) {
  let angle = calcAngle(latitude, longitude, rootLat, rootLong)

  const distance = calcDistance(latitude, longitude, rootLat, rootLong)

  const rotation = -MathUtils.degToRad(angle)
  let clampedDistance = MathUtils.clamp(distance, 0, 1000)
  let pseudoDistance = MathUtils.mapLinear(clampedDistance, 0, 1000, 250, 250)
  let pseudoHeight = MathUtils.mapLinear(clampedDistance, 0, 1000, 4, 10)

  const x = Math.sin(rotation) * pseudoDistance
  const y = pseudoHeight
  const z = Math.cos(rotation) * pseudoDistance

  return { x, y, z, rotation, distance }
}

function mod(n, m) {
  return ((n % m) + m) % m
}
function checkIfLoaded(context) {
  if (
    context.de.info &&
    context.de.persons &&
    context.de.places &&
    context.de.startPage &&
    context.de.help
  ) {
    context.loaded = true
  }
}
