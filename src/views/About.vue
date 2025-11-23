<script setup>
import { ref, computed } from 'vue'

// Reactive state
const firstName = ref('')
const lastName = ref('')
const selectedSpaceType = ref('office')

// Computed welcome message
const welcomeMessage = computed(() => {
  if (firstName.value.trim() && lastName.value.trim()) {
    return `Welcome, ${firstName.value} ${lastName.value}!`
  }
  return ''
})

// Space type images
const spaceImages = {
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
  creative: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop'
}

const currentImage = computed(() => {
  return spaceImages[selectedSpaceType.value]
})
</script>

<template>
  <div class="min-h-screen bg-off-white py-12 px-4">
    <div class="container">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="text-5xl font-bold text-navy mb-4 font-montserrat">About CoBunny</h1>
          <p class="text-xl text-slate font-inter">Your Partner in Flexible Workspace Solutions</p>
        </div>
      </div>

      <!-- Description Section -->
      <div class="row mb-5">
        <div class="col-12 col-lg-10 mx-auto">
          <div class="card border-0 shadow-sm p-4">
            <div class="card-body">
              <h2 class="h3 text-navy mb-4 font-poppins">What We Do</h2>
              <p class="text-slate font-inter mb-3" style="line-height: 1.8;">
                CoBunny is a premier co-working space booking platform that connects professionals, entrepreneurs, 
                and remote workers with the perfect workspace for their needs. Whether you're looking for a quiet 
                corner to focus, a collaborative environment to brainstorm, or a professional meeting room to 
                impress clients, we've got you covered.
              </p>
              <p class="text-slate font-inter mb-3" style="line-height: 1.8;">
                Our mission is to make flexible workspace accessible to everyone. We partner with the best 
                co-working spaces across the city to offer you a diverse range of options, from modern tech hubs 
                to cozy creative studios. With CoBunny, you can book workspaces by the hour, day, or month – 
                giving you the flexibility to work on your terms.
              </p>
              <p class="text-slate font-inter" style="line-height: 1.8;">
                <strong>Key Features:</strong> Instant booking, flexible memberships, premium amenities, 
                high-speed internet, networking opportunities, and a vibrant community of like-minded professionals. 
                Join thousands of members who trust CoBunny for their workspace needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Section -->
      <div class="row mb-5">
        <div class="col-12 col-lg-10 mx-auto">
          <div class="card border-0 shadow-sm p-4">
            <div class="card-body">
              <h2 class="h3 text-navy mb-4 font-poppins">Get to Know You</h2>
              
              <!-- Name Inputs -->
              <div class="row mb-4">
                <div class="col-12 col-md-6 mb-3 mb-md-0">
                  <label for="firstName" class="form-label text-navy font-inter fw-semibold">First Name</label>
                  <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Enter your first name"
                    aria-label="First name"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <label for="lastName" class="form-label text-navy font-inter fw-semibold">Last Name</label>
                  <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Enter your last name"
                    aria-label="Last name"
                  />
                </div>
              </div>

              <!-- Welcome Message -->
              <Transition name="fade">
                <div v-if="welcomeMessage" class="alert alert-success bg-teal text-white border-0 mb-4" role="alert">
                  <h4 class="alert-heading font-poppins">{{ welcomeMessage }}</h4>
                  <p class="mb-0">We're excited to help you find your perfect workspace!</p>
                </div>
              </Transition>

              <!-- Space Type Selection -->
              <div class="mb-4">
                <h3 class="h5 text-navy mb-3 font-inter fw-semibold">Preferred Workspace Type</h3>
                <div class="row">
                  <div class="col-12 col-md-6 mb-3 mb-md-0">
                    <div class="form-check custom-radio">
                      <input
                        id="officeSpace"
                        v-model="selectedSpaceType"
                        class="form-check-input"
                        type="radio"
                        name="spaceType"
                        value="office"
                      />
                      <label class="form-check-label text-navy font-inter" for="officeSpace">
                        <strong>Office Space</strong>
                        <p class="mb-0 text-muted small">Modern, professional environments</p>
                      </label>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="form-check custom-radio">
                      <input
                        id="creativeSpace"
                        v-model="selectedSpaceType"
                        class="form-check-input"
                        type="radio"
                        name="spaceType"
                        value="creative"
                      />
                      <label class="form-check-label text-navy font-inter" for="creativeSpace">
                        <strong>Creative Space</strong>
                        <p class="mb-0 text-muted small">Inspiring, artistic atmospheres</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dynamic Image Display -->
              <div class="row">
                <div class="col-12">
                  <h3 class="h5 text-navy mb-3 font-inter fw-semibold">Your Selected Workspace Style</h3>
                  <Transition name="image-fade" mode="out-in">
                    <div :key="selectedSpaceType" class="image-container">
                      <img
                        :src="currentImage"
                        :alt="selectedSpaceType === 'office' ? 'Modern Office Space' : 'Creative Workspace'"
                        class="img-fluid rounded shadow-sm"
                        style="width: 100%; height: 400px; object-fit: cover;"
                      />
                      <div class="image-caption mt-3 p-3 bg-light rounded">
                        <p class="mb-0 text-slate font-inter">
                          <strong v-if="selectedSpaceType === 'office'">Professional Office Spaces:</strong>
                          <strong v-else>Creative Workspaces:</strong>
                          <span v-if="selectedSpaceType === 'office'">
                            Modern, sleek environments designed for productivity and professional meetings. 
                            Perfect for consultants, lawyers, and corporate teams.
                          </span>
                          <span v-else>
                            Vibrant, inspiring spaces that fuel creativity and innovation. 
                            Ideal for designers, artists, and creative professionals.
                          </span>
                        </p>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="row">
        <div class="col-12 col-lg-8 mx-auto text-center">
          <div class="card border-0 shadow-sm bg-navy text-white p-4">
            <div class="card-body">
              <h2 class="h3 mb-3 font-poppins">Ready to Find Your Workspace?</h2>
              <p class="mb-4 font-inter">Browse our curated selection of co-working spaces and book in seconds.</p>
              <button
                @click="$router.push({ name: 'browse' })"
                class="btn btn-lg px-5 py-3 font-poppins"
                style="background-color: #5BC0BE; border-color: #5BC0BE; color: white;"
              >
                Explore Spaces
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-teal {
  background-color: #5BC0BE !important;
}

.text-navy {
  color: #1C2541;
}

.bg-navy {
  background-color: #1C2541;
}

.custom-radio .form-check-input:checked {
  background-color: #5BC0BE;
  border-color: #5BC0BE;
}

.custom-radio {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-radio:hover {
  border-color: #5BC0BE;
  background-color: #f8f9fa;
}

.custom-radio .form-check-input:checked ~ .form-check-label {
  color: #1C2541;
}

.image-container {
  animation: fadeIn 0.5s ease-in;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.4s ease;
}

.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
