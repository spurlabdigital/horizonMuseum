import { useGlobalState } from './store'
import { createRouter, createWebHashHistory } from 'vue-router'
import PersonsList from '../components/routes/biographies/TheBiographies.vue'
import PlacesList from '../components/routes/places/ThePlacesList.vue'
import PlacePanel from '../components/routes/place/ThePlace.vue'
import TheIntroScreen from '../components/routes/home/TheHome.vue'
import PersonPanel from '../components/routes/biography/TheBiography.vue'
import ThePlacesMapbox from '../components/routes/map/TheMap.vue'
import InfoScreen from '../components/routes/info/TheInfo.vue'
import InfoListScreen from '../components/routes/info/TheInfoList.vue'
import TheARPerson from '../components/routes/ar/TheArPerson.vue'
import TheArPlace from '../components/routes/ar/TheArPlace.vue'
import TheArSearchBox from '../components/routes/ar/TheArSearchBox.vue'
import empty from '../components/routes/empty.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: empty
  },
  {
    path: '/horizon',
    name: 'horizon',
    component: empty
  },
  {
    path: '/biographies',
    name: 'biographies',
    component: empty
  },
  {
    path: '/biography/:id',
    name: 'person',
    component: empty
  },
  {
    path: '/map',
    name: 'map',
    component: empty
  },
  {
    path: '/places',
    name: 'places',
    component: empty
  },
  {
    path: '/place/:id',
    name: 'place',
    component: empty
  },
  {
    path: '/info',
    name: 'infoList',
    component: empty
  },
  {
    path: '/info/:id',
    name: 'info',
    component: empty
  },
  { path: '/:pathMatch(.*)*', name: '404', component: empty }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  const globalState = useGlobalState()
  globalState.activeState = to.name

  if (to.name === 'person') {
    globalState.setActivePerson(to.params.id)
  }

  if (to.name === 'place') {
    globalState.setActivePlace(to.params.id)
  }
})

export default router
