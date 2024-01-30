import { useCmsStore } from '../../../js/cmsStore'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import dotIcon from './dot.png'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalState } from '../../../js/store'

export default class MapboxPlacesLayer {
  constructor() {
    this.cmsStore = useCmsStore()
    this.globalStore = useGlobalState()
    this.router = useRouter()
    this.route = useRoute()
  }

  addMarker(map) {
    const places = this.cmsStore.getPlaces
    for (const location of places) {
      const el = document.createElement('div')
      el.className = ''
      el.innerHTML = ''
      el.style.padding = '1rem'
      el.style.transition = 'opacity 0.2s ease-in-out'
      el.innerHTML = `<div class="MapBoxDot ReadingPanelMarker" />`
      el.addEventListener('click', () => {
        const id = location.id.split('/').pop()

        const event = new CustomEvent('gotoID', { detail: { id: id } })
        window.dispatchEvent(event)
        this.router.push({ name: 'place', params: { id: id } })
      })

      new mapboxgl.Marker(el)
        .setLngLat([location.location.lon, location.location.lat])
        .addTo(map)
    }
    this.setupMarkerVisibility()
  }
  setupMarkerVisibility() {
    this.router.beforeEach((to) => {
      if (to.name === 'place') {
        this.showMarker()
      } else {
        this.hideMarkers()
      }
    })

    if (this.route.name === 'place') {
      this.showMarker()
    } else {
      this.hideMarkers()
    }
  }
  hideMarkers() {
    let markers = document.getElementsByClassName('ReadingPanelMarker')
    for (let i = 0; i < markers.length; i++) {
      markers[i].parentElement.style.visibility = 'hidden'
      markers[i].parentElement.style.pointerEvents = 'none'
    }
  }
  showMarker() {
    let markers = document.getElementsByClassName('ReadingPanelMarker')
    for (let i = 0; i < markers.length; i++) {
      markers[i].parentElement.style.visibility = 'visible'
      markers[i].parentElement.style.pointerEvents = 'all'
    }
  }
  addLayer(map) {
    this.featureCollection

    this.initFeatureCollection()
    map.loadImage(dotIcon, (error, image) => {
      if (error) throw error
      map.addImage('custom-marker', image)
      map.addSource('places', {
        type: 'geojson',
        cluster: false,

        data: this.featureCollection
      })

      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'places',
        layout: {
          'icon-image': 'custom-marker',
          'icon-allow-overlap': true
        }
      })
    })

    map.on('click', 'points', (e) => {
      console.log('User clicked on a place')
    })
  }
  initFeatureCollection() {
    const places = this.cmsStore.getPlaces

    this.featureCollection = {
      type: 'FeatureCollection',
      features: []
    }

    for (let place of places) {
      const feature = {
        type: 'Feature',
        properties: {
          description: place.name,
          icon: 'marker'
        },
        geometry: {
          type: 'Point',
          coordinates: [place.location.lon, place.location.lat]
        }
      }
      this.featureCollection.features.push(feature)
    }
  }
}
