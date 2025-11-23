<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative h-[70vh] flex items-center justify-center">
      <div class="absolute inset-0 bg-center bg-cover" :style="heroBgStyle">
        <div class="absolute inset-0 bg-navy bg-opacity-70" :style="overlayBgStyle"></div>
      </div>

      <div class="relative max-w-4xl px-4 mx-auto text-center text-white sm:px-6">
        <h1 class="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat sm:mb-6">Find Your Perfect Workspace</h1>
        <p class="mb-6 text-base text-gray-100 sm:text-lg md:text-xl font-inter sm:mb-8">
          Discover premium coworking spaces, meeting rooms, and private offices designed for productivity and collaboration.
        </p>
        <div>
          <button @click="handleNavigate('browse')" class="px-4 py-2 transition-all duration-300 transform rounded-md shadow-lg bg-teal hover:bg-teal/90 text-navy font-poppins hover:scale-105 hover:shadow-xl">
            Book Now
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Spaces -->
    <section class="py-16 sm:py-20 lg:py-24 bg-off-white">
      <div class="px-4 mx-auto max-w-7xl sm:px-6">
        <div class="mb-12 text-center lg:mb-16">
          <div class="inline-block px-3 py-1 mb-4 rounded bg-teal/10 text-teal">Featured Spaces</div>
          <h2 class="mb-4 text-3xl sm:text-4xl lg:text-5xl font-montserrat text-navy">Discover Your Ideal Workspace</h2>
          <p class="max-w-2xl mx-auto text-lg lg:text-xl font-inter text-slate">From hot desks to private offices, we have the perfect space for every need</p>
        </div>

        <div class="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="space in featuredSpaces" 
            :key="space.id"
            @click="handleNavigate('browse')"
            class="overflow-hidden transition-all duration-300 bg-white border-0 rounded shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1"
          >
            <div class="relative h-48">
              <img 
                :src="space.image" 
                :alt="space.name"
                class="object-cover w-full h-full"
              />
              <div class="absolute px-3 py-1 text-sm rounded top-3 left-3 bg-teal text-navy font-inter">
                {{ space.type }}
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-montserrat text-navy">{{ space.name }}</h3>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span class="text-sm font-inter text-slate">{{ space.rating }}</span>
                </div>
              </div>
              
              <div class="flex items-center mb-3 space-x-2">
                <svg class="w-4 h-4 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="font-inter text-slate">{{ space.location }}</span>
              </div>
              
              <div class="flex items-center mb-4 space-x-2">
                <svg class="w-4 h-4 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-sm font-inter text-slate">{{ space.capacity }}</span>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="(amenity, idx) in space.amenities.slice(0, 3)" 
                  :key="idx"
                  class="px-2 py-1 text-xs border rounded font-inter text-slate border-slate/30"
                >
                  {{ amenity }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-2xl font-montserrat text-navy">{{ space.price }}</span>
                <button 
                  @click.stop="handleNavigate('browse')"
                  class="px-4 py-2 text-sm transition-all duration-300 rounded shadow-md bg-teal hover:bg-teal/90 text-navy font-poppins hover:shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <button @click="handleNavigate('browse')" class="px-8 py-3 transition-all duration-300 border-2 rounded border-navy text-navy hover:bg-navy hover:text-white font-poppins">
            View All Spaces
          </button>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="relative py-16 overflow-hidden bg-white sm:py-20 lg:py-24">
      <div class="relative z-10 px-4 mx-auto max-w-7xl sm:px-6">
        <div class="mb-12 text-center lg:mb-16">
          <h2 class="mb-4 text-3xl sm:text-4xl lg:text-5xl font-montserrat text-navy">Premium Amenities Included</h2>
          <p class="max-w-2xl mx-auto text-lg lg:text-xl font-inter text-slate">Everything you need to succeed, all in one place</p>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(b, i) in benefits" :key="i">
            <div class="h-full p-8 transition-all duration-300 border-0 rounded shadow-lg hover:shadow-2xl">
              <div class="flex items-center justify-center w-16 h-16 mb-6 bg-teal/10 rounded-2xl">
                <div class="text-2xl text-teal">{{ b.icon }}</div>
              </div>
              <h3 class="mb-3 text-xl font-montserrat text-navy">{{ b.title }}</h3>
              <p class="leading-relaxed font-inter text-slate">{{ b.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 text-white sm:py-20 lg:py-24 bg-navy">
      <div class="px-4 mx-auto max-w-7xl sm:px-6">
        <div class="mb-12 text-center lg:mb-16">
          <div class="inline-block px-3 py-1 mb-4 rounded bg-teal text-navy">Testimonials</div>
          <h2 class="mb-4 text-3xl sm:text-4xl lg:text-5xl font-montserrat">Loved by Professionals</h2>
          <p class="max-w-2xl mx-auto text-lg text-gray-100 lg:text-xl font-inter">See what our members have to say about their CoBunny experience</p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(t, idx) in testimonials" :key="idx">
            <div class="h-full p-6 transition-all duration-300 border-0 rounded bg-slate hover:bg-slate/80">
              <div class="flex items-center mb-4">
                <div class="flex space-x-1">
                  <span v-for="n in t.rating" :key="n" class="text-teal">★</span>
                </div>
              </div>
              <p class="mb-6 italic leading-relaxed text-white font-inter">"{{ t.quote }}"</p>
              <div class="flex items-center">
                <div class="w-12 h-12 mr-4 overflow-hidden rounded-full ring-2 ring-teal">
                  <img :src="t.image" :alt="t.name" class="object-cover w-full h-full" />
                </div>
                <div>
                  <div class="text-white font-montserrat">{{ t.name }}</div>
                  <div class="text-gray-300 font-inter">{{ t.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative py-16 overflow-hidden sm:py-20 lg:py-24 bg-off-white">
      <div class="relative z-10 max-w-4xl px-4 mx-auto text-center sm:px-6">
        <div class="mb-6 text-4xl text-center text-teal">✨</div>
        <h2 class="mb-6 text-3xl sm:text-4xl lg:text-5xl font-montserrat text-navy">Ready to Transform Your Work?</h2>
        <p class="max-w-2xl mx-auto mb-10 text-lg lg:text-xl font-inter text-slate">Join thousands of professionals who've found their perfect workspace. Book a tour today and experience the CoBunny difference.</p>

        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <button @click="handleNavigate('browse')" class="px-10 py-6 rounded shadow-xl bg-teal hover:bg-teal/90 text-navy font-poppins">Book a Space Now</button>
          <button @click="handleNavigate('about')" class="px-10 py-6 border-2 rounded border-navy text-navy hover:bg-navy hover:text-white font-poppins">Learn More</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import heroImg from '../assets/Container.png'

const router = useRouter()

const handleNavigate = (page) => {
  router.push({ name: page })
}

const heroBgStyle = {
  backgroundImage: `url(${heroImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

const overlayBgStyle = {
  backgroundImage: `url(${heroImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'multiply'
}

const featuredSpaces = [
  {
    id: '1',
    name: 'Downtown Creative Hub',
    type: 'Hot Desk',
    price: '$25/day',
    location: 'Financial District',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1626187777040-ffb7cb2c5450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    amenities: ['WiFi', 'Coffee', 'Printing'],
    capacity: '50+ desks'
  },
  {
    id: '2',
    name: 'Executive Meeting Suite',
    type: 'Meeting Room',
    price: '$150/day',
    location: 'Business District',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1639485529326-a12df10446c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    amenities: ['Video Conf', 'Whiteboard', 'Catering'],
    capacity: '12 people'
  },
  {
    id: '3',
    name: 'Modern Private Office',
    type: 'Private Office',
    price: '$800/month',
    location: 'Tech Quarter',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1596749853719-e6aa1dc2eabe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    amenities: ['24/7 Access', 'Storage', 'Receptionist'],
    capacity: '4-6 people'
  }
]

const benefits = [
  { icon: '📶', title: 'Ultra-Fast WiFi', description: '1 Gbps fiber internet with 99.9% uptime guarantee and backup connections' },
  { icon: '☕', title: 'Gourmet Cafe', description: 'Premium coffee, tea, and snacks available 24/7 from our in-house barista' },
  { icon: '👥', title: 'Private Meeting Rooms', description: 'Fully equipped conference rooms with AV systems and video conferencing' },
  { icon: '⚡', title: 'High-Speed Printing', description: 'Professional printing, scanning, and copying services included' },
  { icon: '⏰', title: '24/7 Access', description: 'Work whenever inspiration strikes with round-the-clock building access' },
  { icon: '🔒', title: 'Enterprise Security', description: 'Biometric access control and 24/7 security monitoring for peace of mind' }
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Startup Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', quote: "CoBunny has transformed the way we work. The spaces are inspiring and the community is incredible.", rating: 5 },
  { name: 'Michael Chen', role: 'Digital Nomad', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', quote: "Flexible, professional, and beautifully designed. Everything a modern professional needs.", rating: 5 },
  { name: 'Emily Rodriguez', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', quote: "The perfect blend of productivity and inspiration. I've never been more motivated to work!", rating: 5 }
]
</script>

<style scoped>
.font-montserrat { font-family: 'Montserrat', sans-serif; }
.font-inter { font-family: 'Inter', sans-serif; }
.font-poppins { font-family: 'Poppins', sans-serif; }
</style>