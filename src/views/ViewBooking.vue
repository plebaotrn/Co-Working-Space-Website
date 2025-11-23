<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '../stores/bookings'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const bookingId = ref(parseInt(route.params.id))
const booking = ref(null)

// Load booking details
onMounted(() => {
  booking.value = bookingStore.getBookingById(bookingId.value)
  
  if (!booking.value) {
    alert('Booking not found')
    router.push({ name: 'dashboard' })
  }
})

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString(undefined, options)
}

const getStatusClass = (status) => {
  const statusLower = (status || '').toLowerCase()
  switch (statusLower) {
    case 'confirmed':
      return 'bg-success text-white'
    case 'pending':
      return 'bg-warning text-dark'
    case 'cancelled':
      return 'bg-secondary text-white'
    case 'completed':
      return 'bg-info text-white'
    default:
      return 'bg-primary text-white'
  }
}

const editBooking = () => {
  router.push({ name: 'edit-booking', params: { id: bookingId.value } })
}

const backToDashboard = () => {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="min-h-screen bg-off-white py-8 px-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <!-- Header -->
          <div class="mb-4">
            <button @click="backToDashboard" class="btn btn-link text-navy p-0 mb-2">
              ← Back to Dashboard
            </button>
            <h1 class="text-4xl font-bold text-navy mb-2 font-montserrat">Booking Details</h1>
            <p class="text-slate font-inter">View your booking information</p>
          </div>

          <div v-if="booking" class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <!-- Status Badge -->
              <div class="mb-4 text-center">
                <span class="badge fs-6 px-4 py-2" :class="getStatusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>

              <!-- Booking Information -->
              <div class="row g-4">
                <!-- Space Details -->
                <div class="col-12">
                  <div class="alert alert-light">
                    <h5 class="text-navy mb-0">
                      📍 {{ booking.spaceName }}
                    </h5>
                  </div>
                </div>

                <!-- Date -->
                <div class="col-12 col-md-6">
                  <label class="form-label text-slate small fw-semibold">Booking Date</label>
                  <p class="text-navy fs-5 mb-0">{{ formatDate(booking.date) }}</p>
                </div>

                <!-- Time Slot -->
                <div class="col-12 col-md-6">
                  <label class="form-label text-slate small fw-semibold">Time Slot</label>
                  <p class="text-navy fs-5 mb-0">{{ booking.timeSlot }}</p>
                </div>

                <!-- Number of People -->
                <div class="col-12 col-md-6">
                  <label class="form-label text-slate small fw-semibold">Number of People</label>
                  <p class="text-navy fs-5 mb-0">{{ booking.numberOfPeople }} {{ booking.numberOfPeople === 1 ? 'person' : 'people' }}</p>
                </div>

                <!-- Price -->
                <div class="col-12 col-md-6">
                  <label class="form-label text-slate small fw-semibold">Total Price</label>
                  <p class="text-teal fs-4 fw-bold mb-0">${{ booking.totalPrice }}</p>
                </div>

                <!-- Special Requests -->
                <div class="col-12" v-if="booking.specialRequests">
                  <label class="form-label text-slate small fw-semibold">Special Requests</label>
                  <p class="text-navy mb-0">{{ booking.specialRequests }}</p>
                </div>

                <!-- Timestamps -->
                <div class="col-12">
                  <div class="border-top pt-3">
                    <div class="row text-center">
                      <div class="col-6">
                        <small class="text-slate d-block">Created</small>
                        <small class="text-navy">{{ formatDate(booking.createdAt) }}</small>
                      </div>
                      <div class="col-6" v-if="booking.updatedAt">
                        <small class="text-slate d-block">Last Updated</small>
                        <small class="text-navy">{{ formatDate(booking.updatedAt) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-grid gap-2 mt-4">
                <button 
                  @click="editBooking" 
                  class="btn btn-navy text-white"
                  v-if="booking.status !== 'cancelled' && booking.status !== 'Cancelled'"
                >
                  ✏️ Edit Booking
                </button>
                <button @click="backToDashboard" class="btn btn-outline-secondary">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <p class="text-slate">Loading booking details...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-navy {
  background-color: #1C2541;
  border: none;
}

.btn-navy:hover {
  background-color: #64748b;
}

.text-navy {
  color: #1C2541;
}

.text-slate {
  color: #64748b;
}

.text-teal {
  color: #5BC0BE;
}

.bg-off-white {
  background-color: #FAFAFA;
}
</style>
