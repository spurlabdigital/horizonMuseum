<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalState } from '../../../js/store'
import AButton from './AButton.vue'
import { useCmsStore } from '../../../js/cmsStore'
const globalState = useGlobalState()
const cmsStore = useCmsStore()

const route = useRoute()
const router = useRouter()
const needsTrust = ref(false)

onMounted(() => {
  needsTrust.value = route.matched.some((record) => record.name === 'horizon')
})

router.beforeEach((to) => {
  needsTrust.value = to.matched.some((record) => record.name === 'horizon')
})

const showErrorMessage = ref(false)

function askForPermission() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(() => {
      DeviceOrientationEvent.requestPermission().then(() => {
        navigator.geolocation.getCurrentPosition(
          success.bind(this),
          error.bind(this),
          options
        )
      })
    })
  } else {
    globalState.isMobile = false
    navigator.geolocation.getCurrentPosition(
      success.bind(this),
      error.bind(this),
      options
    )
  }
  function success(obj) {
    globalState.setGPS(obj.coords)
    globalState.setTrusted(true)
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
    showErrorMessage.value = true
  }
}

function closeErrorMessage() {
  showErrorMessage.value = false
}

const isTrusted = computed(() => {
  return globalState.isTrusted
})

</script>

<template>
  <div
    class="Blocker"
       v-if="!isTrusted && needsTrust"
    @click="askForPermission"
  >
    <div class="textBlock">
      {{ cmsStore.de.help.headline }}
    </div>
    <ul class="iconBox">
        <li>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="25"
          viewBox="0 0 26 25"
          fill="none"
        >
          <path
            d="M1 11.8947L25 1L13.6316 24L11.1053 14.3158L1 11.8947Z"
            stroke="#767676"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span> {{ cmsStore.de.help.textA }}</span>
      </li>
      <li>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="25"
          viewBox="0 0 26 25"
          fill="none"
        >
          <path
            d="M1 11.8947L25 1L13.6316 24L11.1053 14.3158L1 11.8947Z"
            fill="#767676"
            stroke="#767676"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>{{ cmsStore.de.help.textB }}</span>
      </li>
    </ul>
    <AButton class="buttonPos" text="Weiter" />
  </div>

  <div v-if="showErrorMessage" class="Blocker right" @click="closeErrorMessage">
    <div class="headline">{{ cmsStore.de.help.headline2 }}</div>
    <div>
      <div class="list" v-html="cmsStore.de.help.textC" />

      <AButton class="buttonPosCenter" text="OK" />
    </div>
  </div>
</template>

<style scoped>
.Blocker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  overflow: clip;
  text-align: center;
  align-items: center;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.textBlock {
  margin: 2rem;
  color: #767676;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 150.023%; /* 1.87531rem */
  letter-spacing: 0.0125rem;
}

.iconBox {
  margin: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.iconBox svg {
  margin-right: 1rem;
  height: 2rem;
  width: 2.5rem;
}

.iconBox li {
  margin: 1rem;
  display: flex;
  text-align: start;
  width: 80%;
  color: #494949;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 140.523%; /* 1.22956rem */
  letter-spacing: 0.0525rem;
}

.right {
  overflow-y: auto;
  justify-self: left;
  justify-items: left;
  text-align: left;
  padding: 2rem;
  color: #494949;
  line-height: 140.523%; /* 1.22956rem */
  letter-spacing: 0.0525rem;
}

.headline {
  margin-bottom: 2rem;
}

.buttonPosCenter {
}
</style>

<style>
.list ol {
  padding: 1rem;
  list-style: decimal;
  justify-self: right;
}

.list li {
  margin: 0.5rem 0;
}
</style>
