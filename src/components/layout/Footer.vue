<script setup>
import { useRouter } from 'vue-router'
import logo from '../../assets/logo1.png'

const router = useRouter()

const navigateTo = (name) => {
  router.push({ name })
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy text-white mt-auto">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img :src="logo" alt="CoBunny" class="h-16 mb-4 brightness-0 invert" />
          <p class="text-gray-300 font-inter">
            Your trusted co-working space booking platform
          </p>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4 font-poppins">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <button @click="navigateTo('home')" class="text-gray-300 hover:text-teal transition font-inter">
                Home
              </button>
            </li>
            <li>
              <button @click="navigateTo('browse')" class="text-gray-300 hover:text-teal transition font-inter">
                Browse
              </button>
            </li>
            <li>
              <button @click="navigateTo('about')" class="text-gray-300 hover:text-teal transition font-inter">
                About
              </button>
            </li>
            <li>
              <button @click="navigateTo('dashboard')" class="text-gray-300 hover:text-teal transition font-inter">
                Dashboard
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4 font-poppins">Support</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-300 hover:text-teal transition font-inter">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-teal transition font-inter">
                Help Center
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4 font-poppins">Legal</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-300 hover:text-teal transition font-inter">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-teal transition font-inter">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-slate mt-8 pt-8 text-center text-gray-300 font-inter">
        <p>&copy; {{ currentYear }} CoBunny. All rights reserved. Built with ❤️ using Vue 3 & Vite</p>
      </div>
    </div>
  </footer>
</template>