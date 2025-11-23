import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import router from './router'
import { vTooltip } from './directives/vTooltip'
import { useBookingStore } from './stores/bookings'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('tooltip', vTooltip)

// Initialize booking store (load from localStorage)
const bookingStore = useBookingStore()
bookingStore.loadBookings()

app.mount('#app')