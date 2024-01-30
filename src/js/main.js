import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router.js'
import TheApp from '../components/TheApp.vue'

const pinia = createPinia()
const app = createApp(TheApp)

app.use(pinia)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
