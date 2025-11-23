<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const step = ref(1)
const selectedDate = ref('')
const selectedTime = ref('')
const duration = ref(1)
const attendees = ref(1)

const spaces = ref([
  { id: 1, name: 'Downtown Creative Hub', price: 25 },
  { id: 2, name: 'Tech Valley Workspace', price: 30 },
  { id: 3, name: 'Green Garden Office', price: 20 },
  { id: 4, name: 'Startup Launch Pad', price: 35 },
  { id: 5, name: 'Artistic Studio Space', price: 28 },
  { id: 6, name: 'Executive Business Center', price: 45 }
])

const spaceId = computed(() => parseInt(route.params.id))
const space = computed(() => spaces.value.find(s => s.id === spaceId.value) || spaces.value[0])
const totalCost = computed(() => space.value.price * duration.value)

const nextStep = () => {
  if (step.value < 3) step.value++
}

const prevStep = () => {
  if (step.value > 1) step.value--
}

const confirmBooking = () => {
  alert(`Booking confirmed for ${space.value.name}!\nDate: ${selectedDate.value}\nTotal: $${totalCost.value}`)
  router.push({ name: 'dashboard' })
}

const goBack = () => {
  router.push({ name: 'space-details', params: { id: spaceId.value } })
}
</script>

<template>
  <div class="min-h-screen py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <button 
        @click="goBack"
        class="mb-6 px-4 py-2 text-primary hover:text-primary-dark transition flex items-center gap-2"
      >
        ← Back to Space Details
      </button>
      
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h1 class="text-4xl font-bold mb-2 text-gray-800">Book {{ space.name }}</h1>
        <p class="text-gray-600 mb-8">Complete your booking in 3 easy steps</p>
        
        <!-- Progress Bar -->
        <div class="flex justify-between mb-12">
          <div 
            v-for="i in 3" 
            :key="i"
            class="flex-1 relative"
          >
            <div 
              :class="step >= i ? 'bg-primary' : 'bg-gray-300'"
              class="h-2 rounded-full transition"
            ></div>
            <div 
              :class="step >= i ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold"
            >
              {{ i }}
            </div>
          </div>
        </div>
        
        <!-- Step 1: Date & Time -->
        <div v-if="step === 1">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Select Date & Time</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Date</label>
              <input 
                v-model="selectedDate"
                type="date" 
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Start Time</label>
              <input 
                v-model="selectedTime"
                type="time" 
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Duration (days)</label>
              <input 
                v-model.number="duration"
                type="number" 
                min="1"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
            </div>
          </div>
        </div>
        
        <!-- Step 2: Attendees -->
        <div v-if="step === 2">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Number of Attendees</h2>
          <div>
            <label class="block text-gray-700 font-semibold mb-2">How many people?</label>
            <input 
              v-model.number="attendees"
              type="number" 
              min="1"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
          </div>
        </div>
        
        <!-- Step 3: Review -->
        <div v-if="step === 3">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Review Your Booking</h2>
          <div class="bg-gray-50 rounded-lg p-6 space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Space:</span>
              <span class="font-semibold text-gray-800">{{ space.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Date:</span>
              <span class="font-semibold text-gray-800">{{ selectedDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Time:</span>
              <span class="font-semibold text-gray-800">{{ selectedTime }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Duration:</span>
              <span class="font-semibold text-gray-800">{{ duration }} day(s)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Attendees:</span>
              <span class="font-semibold text-gray-800">{{ attendees }} people</span>
            </div>
            <div class="border-t-2 border-gray-300 pt-3 flex justify-between">
              <span class="text-lg font-bold text-gray-800">Total Cost:</span>
              <span class="text-2xl font-bold text-primary">${{ totalCost }}</span>
            </div>
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button 
            v-if="step > 1"
            @click="prevStep"
            class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            ← Previous
          </button>
          <div v-else></div>
          
          <button 
            v-if="step < 3"
            @click="nextStep"
            class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
          >
            Next →
          </button>
          <button 
            v-else
            @click="confirmBooking"
            class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
          >
            Confirm Booking ✓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>