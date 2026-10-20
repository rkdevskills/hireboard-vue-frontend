<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'
import JobForm from './JobForm.vue'

const route = useRoute()
const router = useRouter()
const jobStore = useJobsStore()

const job = ref(null)
const loading = ref(true)
const error = ref('')
const loadError = ref('')
const saveError = ref('')
const success = ref('')
const isSubmitting = ref(false)
const auth = useAuthStore()

async function loadJob() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/' + route.params.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth.token
            },
        })
        if(!response.ok) {
            throw new Error('Failed to load the job')
        }
        const data = await response.json()
        job.value = data
    } catch(err) {
        error.value = err.message
    } finally {
        loading.value = false
    } 
}

async function handleSubmit(fields) {
    isSubmitting.value = true
    saveError.value = ''
    try {
        await jobStore.updateJob(route.params.id, fields)
        success.value = 'Job updated successfully'

        setTimeout(() => {
            router.push('/my-jobs')
        }, 2000);
    } catch(submitErr) {
        error.value = submitErr.message
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadJob()
})

</script>

<template>
    <div class="min-h-screen bg-gray-100 px-4 py-10">
        <div class="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <!-- Heading -->
            <h1 class="mb-8 text-center text-3xl font-medium text-black">Edit job</h1>
            
            <!-- Loading -->
            <div v-if="loading" class="text-center"><p class="text-gray-500">Loading...</p>
            </div>
            
            <!-- Error -->
            <p v-else-if="error" class="mb-6 rounded-lg bg-red-100 p-3 text-red-500">Error: {{ error }}</p>

            <!-- Success -->
            <p v-else-if="success" class="mb-6 rounded-lg bg-green-100 p-3 text-green-500">{{ success }}</p>

            <JobForm v-if="job" @submit="handleSubmit" :success="success" :isSubmitting="isSubmitting" :job="job" />
        </div>
    </div>
</template>