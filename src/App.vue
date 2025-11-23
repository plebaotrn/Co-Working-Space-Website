<script setup>
import Navigation from './components/layout/Navigation.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-inter flex items-center justify-center">
    <div class="w-full max-w-[1440px] min-h-[1024px] bg-off-white shadow-2xl overflow-y-auto relative">
      <Navigation />
      
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
      
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>