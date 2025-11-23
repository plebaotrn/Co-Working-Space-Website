<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import logo from '../../assets/logo.png'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const { isAuthenticated, currentUser, signOut } = useAuth()

const navigateTo = (name) => {
  router.push({ name })
  mobileMenuOpen.value = false
}

const handleSignOut = () => {
  signOut()
  navigateTo('home')
}
</script>

<template>
  <nav class="sticky top-0 z-50 px-4 py-4 bg-white border-b border-gray-200 shadow-sm sm:px-6">
    <div class="flex items-center justify-between mx-auto max-w-7xl">
      <!-- Logo -->
      <div 
        class="flex items-center space-x-2 transition cursor-pointer hover:opacity-90"
        @click="navigateTo('home')"
      >
        <img :src="logo" alt="CoBunny" class="h-16 sm:h-20" />
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden space-x-8 md:flex">
        <button 
          @click="navigateTo('home')"
          :class="route.name === 'home' ? 'text-navy border-b-2 border-teal' : 'text-slate hover:text-navy'"
          class="relative px-3 py-2 transition-all font-inter"
        >
          Home
        </button>
        <button 
          @click="navigateTo('browse')"
          :class="route.name === 'browse' ? 'text-navy border-b-2 border-teal' : 'text-slate hover:text-navy'"
          class="relative px-3 py-2 transition-all font-inter"
        >
          Browse
        </button>
        <button 
          @click="navigateTo('about')"
          :class="route.name === 'about' ? 'text-navy border-b-2 border-teal' : 'text-slate hover:text-navy'"
          class="relative px-3 py-2 transition-all font-inter"
        >
          About
        </button>
        <button 
          v-if="isAuthenticated"
          @click="navigateTo('dashboard')"
          :class="route.name === 'dashboard' ? 'text-navy border-b-2 border-teal' : 'text-slate hover:text-navy'"
          class="relative px-3 py-2 transition-all font-inter"
        >
          Dashboard
        </button>
      </div>
      
      <!-- Desktop Buttons -->
      <div class="items-center hidden space-x-4 md:flex">
        <template v-if="isAuthenticated">
          <div class="text-navy font-inter">
            <small class="text-slate">Welcome,</small>
            <strong class="ms-1">{{ currentUser.firstName }}</strong>
          </div>
          <button 
            @click="handleSignOut"
            class="px-5 py-2 transition-all border-2 rounded-lg shadow-md border-teal text-teal hover:bg-teal hover:text-white font-inter hover:shadow-lg"
          >
            Sign Out
          </button>
        </template>
        <template v-else>
          <button 
            @click="navigateTo('sign-in')"
            class="px-5 py-2 transition-all border-2 rounded-lg shadow-md border-teal text-teal hover:bg-teal hover:text-white font-inter hover:shadow-lg"
          >
            Sign In
          </button>
          <button 
            @click="navigateTo('browse')"
            class="px-5 py-2 text-white transition-all rounded-lg shadow-md bg-navy hover:bg-slate font-poppins hover:shadow-lg"
          >
            Book Now
          </button>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 transition rounded-lg text-navy hover:bg-gray-100"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="overflow-hidden md:hidden">
        <div class="py-4 space-y-3">
          <button 
            @click="navigateTo('home')"
            :class="route.name === 'home' ? 'bg-teal/10 text-navy' : 'text-slate hover:bg-gray-100'"
            class="block w-full px-4 py-3 text-left transition-all rounded-md font-inter"
          >
            Home
          </button>
          <button 
            @click="navigateTo('browse')"
            :class="route.name === 'browse' ? 'bg-teal/10 text-navy' : 'text-slate hover:bg-gray-100'"
            class="block w-full px-4 py-3 text-left transition-all rounded-md font-inter"
          >
            Browse
          </button>
          <button 
            @click="navigateTo('about')"
            :class="route.name === 'about' ? 'bg-teal/10 text-navy' : 'text-slate hover:bg-gray-100'"
            class="block w-full px-4 py-3 text-left transition-all rounded-md font-inter"
          >
            About
          </button>
          <button 
            v-if="isAuthenticated"
            @click="navigateTo('dashboard')"
            :class="route.name === 'dashboard' ? 'bg-teal/10 text-navy' : 'text-slate hover:bg-gray-100'"
            class="block w-full px-4 py-3 text-left transition-all rounded-md font-inter"
          >
            Dashboard
          </button>
          
          <div v-if="isAuthenticated" class="px-4 py-2">
            <p class="mb-1 text-sm text-slate">Signed in as:</p>
            <p class="font-semibold text-navy">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
          </div>
          
          <div class="pt-3 space-y-2">
            <template v-if="isAuthenticated">
              <button 
                @click="handleSignOut"
                class="w-full px-5 py-2 transition-all border-2 rounded-lg border-teal text-teal hover:bg-teal hover:text-white font-inter"
              >
                Sign Out
              </button>
            </template>
            <template v-else>
              <button 
                @click="navigateTo('sign-in')"
                class="w-full px-5 py-2 transition-all border-2 rounded-lg border-teal text-teal hover:bg-teal hover:text-white font-inter"
              >
                Sign In
              </button>
              <button 
                @click="navigateTo('browse')"
                class="w-full px-5 py-2 text-white transition-all rounded-lg bg-navy hover:bg-slate font-poppins"
              >
                Book Now
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to {
  opacity: 1;
  max-height: 500px;
}

.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}

.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>