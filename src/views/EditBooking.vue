<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingStore } from '../stores/bookings'

const router = useRouter()
const route = useRoute()
const bookingStore = useBookingStore()

const bookingId = ref(parseInt(route.params.id))
const booking = ref(null)
const originalBooking = ref(null)

// Form fields
const bookingDate = ref('')
const timeSlot = ref('')
const numberOfPeople = ref(1)
const specialRequests = ref('')

// Validation errors
const errors = ref({})

// Time slot options
const timeSlots = ['Morning (9 AM - 12 PM)', 'Afternoon (1 PM - 5 PM)', 'Full Day (9 AM - 5 PM)']

// Load booking details function
const loadBookingDetails = () => {
  bookingId.value = parseInt(route.params.id)
  booking.value = bookingStore.getBookingById(bookingId.value)
  
  if (!booking.value) {
    alert('Booking not found')
    router.push({ name: 'dashboard' })
    return
  }
  
  // Store original for comparison
  originalBooking.value = { ...booking.value }
  
  // Populate form fields
  bookingDate.value = booking.value.date
  timeSlot.value = booking.value.timeSlot
  numberOfPeople.value = booking.value.numberOfPeople
  specialRequests.value = booking.value.specialRequests || ''
}

// Load booking details on mount
onMounted(() => {
  loadBookingDetails()
})

// Watch for route param changes and reload
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadBookingDetails()
  }
})

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!bookingDate.value) {
    errors.value.date = 'Please select a booking date'
  } else {
    const selectedDate = new Date(bookingDate.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      errors.value.date = 'Cannot book dates in the past'
    }
  }
  
  if (!timeSlot.value) {
    errors.value.timeSlot = 'Please select a time slot'
  }
  
  if (numberOfPeople.value < 1) {
    errors.value.numberOfPeople = 'Number of people must be at least 1'
  }
  
  return Object.keys(errors.value).length === 0
}

// Calculate new price based on time slot
const calculatePrice = () => {
  let multiplier = 1
  if (timeSlot.value.includes('Morning') || timeSlot.value.includes('Afternoon')) {
    multiplier = 0.6
  }
  
  // Use original price as base
  const basePrice = originalBooking.value.totalPrice / (originalBooking.value.timeSlot.includes('Full Day') ? 1 : 0.6)
  return (basePrice * multiplier).toFixed(2)
}

// Update booking
const updateBooking = () => {
  if (!validateForm()) {
    return
  }
  
  const updatedData = {
    date: bookingDate.value,
    timeSlot: timeSlot.value,
    numberOfPeople: numberOfPeople.value,
    specialRequests: specialRequests.value,
    totalPrice: parseFloat(calculatePrice())
  }
  
  const result = bookingStore.updateBooking(bookingId.value, updatedData)
  
  if (result) {
    alert('Booking updated successfully!')
    router.push({ name: 'dashboard' })
  } else {
    alert('Failed to update booking')
  }
}

const cancelEdit = () => {
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
            <button @click="router.back()" class="btn btn-link text-navy p-0 mb-2">
              ← Back to Dashboard
            </button>
            <h1 class="text-4xl font-bold text-navy mb-2 font-montserrat">Edit Booking</h1>
            <p class="text-slate font-inter">Update your booking details</p>
          </div>

          <div v-if="booking" class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <!-- Space Info (Read-only) -->
              <div class="alert alert-info mb-4">
                <h5 class="alert-heading">📍 {{ booking.spaceName }}</h5>
                <p class="mb-0 small">
                  Note: You cannot change the space. To book a different space, please cancel this booking and create a new one.
                </p>
              </div>

              <form @submit.prevent="updateBooking">
                <!-- Date Selection -->
                <div class="mb-3">
                  <label for="bookingDate" class="form-label fw-semibold text-navy">
                    Booking Date <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model="bookingDate"
                    type="date"
                    id="bookingDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.date }"
                    :min="new Date().toISOString().split('T')[0]"
                    required
                  />
                  <div v-if="errors.date" class="invalid-feedback">
                    {{ errors.date }}
                  </div>
                </div>

                <!-- Time Slot Selection -->
                <div class="mb-3">
                  <label for="timeSlot" class="form-label fw-semibold text-navy">
                    Time Slot <span class="text-danger">*</span>
                  </label>
                  <select 
                    v-model="timeSlot"
                    id="timeSlot"
                    class="form-select"
                    :class="{ 'is-invalid': errors.timeSlot }"
                    required
                  >
                    <option v-for="slot in timeSlots" :key="slot" :value="slot">
                      {{ slot }}
                    </option>
                  </select>
                  <div v-if="errors.timeSlot" class="invalid-feedback">
                    {{ errors.timeSlot }}
                  </div>
                </div>

                <!-- Number of People -->
                <div class="mb-3">
                  <label for="numberOfPeople" class="form-label fw-semibold text-navy">
                    Number of People <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model.number="numberOfPeople"
                    type="number"
                    id="numberOfPeople"
                    class="form-control"
                    :class="{ 'is-invalid': errors.numberOfPeople }"
                    min="1"
                    required
                  />
                  <div v-if="errors.numberOfPeople" class="invalid-feedback">
                    {{ errors.numberOfPeople }}
                  </div>
                </div>

                <!-- Special Requests -->
                <div class="mb-4">
                  <label for="specialRequests" class="form-label fw-semibold text-navy">
                    Special Requests (Optional)
                  </label>
                  <textarea 
                    v-model="specialRequests"
                    id="specialRequests"
                    class="form-control"
                    rows="3"
                    placeholder="Any special requirements or requests..."
                  ></textarea>
                </div>

                <!-- Price Info -->
                <div class="alert alert-light">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-slate">Updated Total Price:</span>
                    <span class="h5 text-teal mb-0">${{ calculatePrice() }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-navy text-white">
                    Save Changes
                  </button>
                  <button type="button" @click="cancelEdit" class="btn btn-outline-secondary">
                    Cancel
                  </button>
                </div>
              </form>
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
