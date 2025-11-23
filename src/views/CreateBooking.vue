<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useBookingStore } from '../stores/bookings'
import spacesData from '../data/spaces.json'

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()
const bookingStore = useBookingStore()

const spaceId = ref(parseInt(route.params.spaceId))
const selectedSpace = ref(null)

// Form fields
const bookingDate = ref('')
const timeSlot = ref('Morning')
const numberOfPeople = ref(1)
const specialRequests = ref('')

// Validation errors
const errors = ref({})

// Time slot options
const timeSlots = ['Morning (9 AM - 12 PM)', 'Afternoon (1 PM - 5 PM)', 'Full Day (9 AM - 5 PM)']

// Load space details
onMounted(() => {
  selectedSpace.value = spacesData.find(s => s.id === spaceId.value)
  if (!selectedSpace.value) {
    alert('Space not found')
    router.push({ name: 'browse' })
  }
  
  // Set min date to today
  const today = new Date().toISOString().split('T')[0]
  bookingDate.value = today
})

// Calculate total price
const totalPrice = computed(() => {
  if (!selectedSpace.value) return 0
  
  let multiplier = 1
  if (timeSlot.value.includes('Morning') || timeSlot.value.includes('Afternoon')) {
    multiplier = 0.6 // 60% of daily rate for half day
  }
  
  return (selectedSpace.value.price * multiplier).toFixed(2)
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
  
  if (selectedSpace.value && numberOfPeople.value > selectedSpace.value.capacity) {
    errors.value.numberOfPeople = `This space has a maximum capacity of ${selectedSpace.value.capacity}`
  }
  
  return Object.keys(errors.value).length === 0
}

// Submit booking
const submitBooking = () => {
  if (!validateForm()) {
    return
  }
  
  // Create new booking using the store
  const newBooking = bookingStore.addBooking({
    userId: currentUser.value.id,
    spaceId: selectedSpace.value.id,
    spaceName: selectedSpace.value.name,
    date: bookingDate.value,
    timeSlot: timeSlot.value,
    numberOfPeople: numberOfPeople.value,
    specialRequests: specialRequests.value,
    totalPrice: parseFloat(totalPrice.value)
  })
  
  alert('Booking created successfully!')
  router.push({ name: 'dashboard' })
}

const cancelBooking = () => {
  router.back()
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
              ← Back
            </button>
            <h1 class="text-4xl font-bold text-navy mb-2 font-montserrat">Book a Space</h1>
            <p class="text-slate font-inter">Complete the form below to create your booking</p>
          </div>

          <div class="row g-4">
            <!-- Booking Form -->
            <div class="col-12 col-md-8">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h2 class="h4 text-navy mb-4 font-poppins">Booking Details</h2>
                  
                  <form @submit.prevent="submitBooking">
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
                        :max="selectedSpace?.capacity"
                        required
                      />
                      <small class="form-text text-slate">
                        Maximum capacity: {{ selectedSpace?.capacity }} people
                      </small>
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

                    <!-- Action Buttons -->
                    <div class="d-grid gap-2">
                      <button type="submit" class="btn btn-navy text-white">
                        Confirm Booking
                      </button>
                      <button type="button" @click="cancelBooking" class="btn btn-outline-secondary">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="col-12 col-md-4">
              <div v-if="selectedSpace" class="card border-0 shadow-sm sticky-top" style="top: 20px;">
                <img 
                  :src="selectedSpace.imageUrl" 
                  :alt="selectedSpace.name"
                  class="card-img-top"
                  style="height: 200px; object-fit: cover;"
                />
                <div class="card-body">
                  <h5 class="card-title text-navy font-poppins">{{ selectedSpace.name }}</h5>
                  <p class="text-slate mb-2">
                    <small>📍 {{ selectedSpace.location }}</small>
                  </p>
                  
                  <hr />
                  
                  <div class="mb-3">
                    <h6 class="text-navy font-semibold">Booking Summary</h6>
                    <div class="small text-slate">
                      <div class="d-flex justify-content-between mb-1">
                        <span>Date:</span>
                        <strong>{{ bookingDate || 'Not selected' }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <span>Time:</span>
                        <strong>{{ timeSlot }}</strong>
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <span>People:</span>
                        <strong>{{ numberOfPeople }}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-slate">Total Price:</span>
                    <span class="h4 text-teal mb-0">${{ totalPrice }}</span>
                  </div>
                </div>
              </div>
            </div>
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
