<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router';

const jobs = ref([])
const loading = ref(true)
const error = ref('');
const jobsCount = computed(() => {
    return jobs.value.length
})
const currentPage = ref(1)
const lastPage = ref(1)

async function loadJobs() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs?page=' + currentPage.value)

        if(!response.ok) {
            throw new Error ('Request failed with status' + response.status)
        }
        const data = await response.json()
        jobs.value = data.data
        currentPage.value = data.meta.current_page
        lastPage.value = data.meta.last_page
        
    } catch(err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

function nextPage() {
    if(currentPage.value < lastPage.value) {
        currentPage.value++
        loadJobs()
    }
}

function previousPage() {
    if(currentPage.value > 1) {
        currentPage.value--
        loadJobs()
    }
}

onMounted(() => {
    loadJobs()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="max-w-7xl px-4 pt-10 pb-6">
            <h1 class="text-4xl font-bold text-black">Job Listing</h1>
            <p class="mt-2 text-gray-500">Find your next opportunity</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-10">
            <p class="text-gray-500">Loading jobs...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mx-auto max-w-7xl px-4">
            <p class="rounded-lg border border-red-200 bg-red-100 p-3 text-red-500">Error: {{ error }}</p>
        </div>

        <!-- No jobs -->
        <div v-else-if="jobsCount === 0" class="mx-auto mt-2 max-w-7xl px-4">
            <div class="rounded-xl border border-gray-100 bg-white p-10 text-center">
            <h2 class="text-xl font-semibold text-gray-800">No jobs posted yet</h2>
            <p class="mt-2 text-gray-500">Check back later for new opportunities.</p>
            </div>
        </div>

        <!-- Jobs -->
        <div v-else class="mx-auto max-w-7xl px-4">
            <ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <li v-for="job in jobs" :key="job.id" class="rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg">
                <RouterLink :to="'/jobs/' + job.id">
                <!-- Job title -->
                <h2 class="text-xl font-bold text-black hover:underline">{{ job.title }}</h2>

                <!-- Description -->
                <p class="mt-3 line-clamp-3 text-gray-600">{{ job.description }}</p>

                <!-- Job information -->
                <div class="mt-4 flex flex-wrap gap-2">
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"> {{ job.location }} </span>
                    <span class="rounded-full bg-black px-3 py-1 text-sm text-white"> {{ job.type }} </span>
                </div>

                <!-- View job -->
                <div class="mt-6 border-t border-gray-100 pt-4 text-sm font-semibold text-black">View job →</div>
                </RouterLink>
            </li>
            </ul>

            <!-- Pagination -->
            <div class="flex items-center justify-center gap-4 py-10">
                <button @click="previousPage" :disabled="currentPage === 1" class="rounded-lg bg-gray-500 px-5 py-2 text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">Previous</button>
                <span class="text-sm text-gray-600"> Page {{ currentPage }} of {{ lastPage }} </span>
                <button @click="nextPage" :disabled="currentPage === lastPage" class="rounded-lg bg-gray-500 px-5 py-2 text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">Next</button>
            </div>
        </div>
    </div>

</template>