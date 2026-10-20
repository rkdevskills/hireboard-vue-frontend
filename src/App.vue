<script setup>
import { onMounted, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore()
const error = ref('')
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}

onMounted(() => {
  auth.fetchUser()
})
</script>

<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/"
          class="text-2xl font-bold text-black hover:text-gray-700">
          JobBoard
        </RouterLink>

        <!-- Navigation -->
        <div class="flex items-center gap-6">

          <RouterLink to="/"
            class="text-gray-600 hover:text-blue-600 font-medium transition">
            Jobs
          </RouterLink>

          <!-- Employer -->
          <template v-if="auth.user && auth.user.role === 'employer'">
            <RouterLink to="/post-job"
              class="text-gray-600 hover:text-blue-600 font-medium transition">
              Post Job
            </RouterLink>

            <RouterLink to="/my-jobs"
              class="text-gray-600 hover:text-blue-600 font-medium transition">
              My Jobs
            </RouterLink>
          </template>

          <!-- Logged in -->
          <template v-if="auth.user">
            <span class="text-gray-700">
              Welcome, <span class="font-semibold">{{ auth.user.name }}</span>
            </span>

            <button
              @click="handleLogout"
              class="bg-black hover:bg-gray-700 text-white
                    px-4 py-2 rounded-lg transition">
              Logout
            </button>

          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink to="/login"
              class="bg-black hover:bg-gray-700 text-white
                    px-4 py-2 rounded-lg transition">
              Login
            </RouterLink>
          </template>

        </div>
      </div>
    </div>
  </nav>

<RouterView />

</template>