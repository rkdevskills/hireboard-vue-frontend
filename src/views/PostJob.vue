<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import JobForm from './JobForm.vue'

const error = ref('')

const router = useRouter()
const job = useJobsStore()
const success = ref('')
const isSubmitting = ref(false)

async function handleSubmit(fields) {
    isSubmitting.value = true
    try {
        await job.createJob(fields)
        success.value = 'You have successfully created a job!'
        setTimeout(() => {
             router.push('/')
        }, 2000)
    } catch (err) {
        error.value = err.message
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 px-4 py-10">
        <div class="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <!-- Heading -->
            <h1 class="mb-8 text-center text-3xl font-medium text-black">Create a job</h1>

            <!-- Error -->
            <p v-if="error" class="mb-6 rounded-lg bg-red-100 p-3 text-red-500">Error: {{ error }}</p>

            <!-- Success -->
            <p v-if="success" class="mb-6 rounded-lg bg-green-100 p-3 text-green-500">{{ success }}</p>

            <JobForm @submit="handleSubmit" :success="success" :isSubmitting="isSubmitting" />
        </div>
    </div>
</template>