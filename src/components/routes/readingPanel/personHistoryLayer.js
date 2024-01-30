import { useCmsStore } from '../../../js/cmsStore'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import dotIcon from './dot.png'
import { useRoute, useRouter } from 'vue-router'

export default class MapboxPersonHistory {
  constructor() {
    this.cmsStore = useCmsStore()
    this.router = useRouter()
    this.route = useRoute()
    this.geojson = {}

    this.markers = []
    this.layer = null
  }

  addLine(map, activePerson) {
    this.clearLine(map)

    this.geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      ]
    }

    const coordinates = this.geojson.features[0].geometry.coordinates
    const fullPerson = this.cmsStore.getPersonBySubID(activePerson)

    for (let station of fullPerson.stations) {
      const id = station.location.split('/').pop()
      const geoData = this.cmsStore.mappedPlaces.find((place) => {
        return place.id === id
      })
      coordinates.push([geoData.lon, geoData.lat])
    }

    this.layer = map.addLayer({
      id: 'personalRoute',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff6632',
        'line-width': 4
      }
    })

    for (const [index, location] of coordinates.entries()) {
      const el = document.createElement('div')
      el.className = 'marker personalRouteMarker'
      el.innerHTML = index + 1
      el.addEventListener('click', () => {
        const id = fullPerson.stations[index].location.split('/').pop()
        const event = new CustomEvent('gotoID', { detail: { id: id } })
        window.dispatchEvent(event)
      })

      this.markers[index] = new mapboxgl.Marker(el)
        .setLngLat({ lng: location[0], lat: location[1] })
        .addTo(map)

      // this.fitBounds(map)
    }
  }

  fitBounds(map) {
    const coordinates = this.geojson.features[0].geometry.coordinates
    const bounds = new mapboxgl.LngLatBounds()

    for (const coord of coordinates) {
      bounds.extend(coord)
    }
    map.fitBounds(bounds, { padding: 10 })
  }

  clearLine(map) {
    if (map.getLayer('personalRoute')) map.removeLayer('personalRoute')
    if (map.getSource('personalRoute')) map.removeSource('personalRoute')

    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].remove()
    }
  }

  setupMarkerVisibility(map) {
    this.router.beforeEach((to) => {
      if (to.name === 'person') {
        this.showLine(map)
      } else {
        this.hideLine(map)
      }
    })

    if (this.route.name === 'person') {
      this.showLine(map)
    } else {
      this.hideLine(map)
    }
  }

  hideLine(map) {
    let markers = document.getElementsByClassName('personalRouteMarker')
    for (let i = 0; i < markers.length; i++) {
      markers[i].style.visibility = 'hidden'
      markers[i].style.pointerEvents = 'none'
    }

    if (this.layer) {
      map.setLayoutProperty('personalRoute', 'visibility', 'none')
    }
  }

  showLine(map) {
    let markers = document.getElementsByClassName('personalRouteMarker')
    for (let i = 0; i < markers.length; i++) {
      markers[i].style.visibility = 'visible'
      markers[i].style.pointerEvents = 'all'
    }

    if (this.layer) {
      map.setLayoutProperty('personalRoute', 'visibility', 'visible')
    }
  }
}
