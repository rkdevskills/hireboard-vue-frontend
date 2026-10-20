<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationStore } from '@/stores/applications'

const route = useRoute()
const job = ref([])
const loading = ref(true)
const error = ref('')

//to apply job
const auth = useAuthStore()
const application = useApplicationStore() 
const router = useRouter()
const applicationError = ref('');
const jobId = ref(route.params.id)
const coverLetter = ref('')
const applicationSuccess = ref('')
const applicationSubmitting = ref(false)

async function loadJob() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/jobs/' + route.params.id)

        if(!response.ok) {
            throw new Error('Request failed with status' + response.status)
        }
        const data = await response.json()
        job.value = data
    }
    catch (err) {
        error.value = err.message
    }
    finally {
        loading.value = false
    } 
}

async function handleApply() {
    applicationSubmitting.value = true;
    try {
        await application.applyToJob(jobId.value, coverLetter.value)
        applicationSuccess.value = "You have successfully applied for the job"
        setTimeout(() => {
            router.push('/')
        }, 2000)
    }
    catch (errOne) {
        applicationError.value = errOne.message
    } 
    finally {
        applicationSubmitting.value = false
    }
}

onMounted(() => {
    loadJob()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4">

        <!-- Loading -->
        <div v-if="loading" class="text-center">
            <p class="text-gray-500">Loading...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="max-w-3xl mx-auto">
            <p class="bg-red-50 border border-red-200 text-red-600 p-2 rounded-lg">
                Error: {{ error }}
            </p>
        </div>

        <!-- Job Details -->
        <div v-else class="max-w-3xl mx-auto">

            <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-8">

                <!-- Job title -->
                <h1 class="text-3xl font-bold text-black">
                    {{ job.title }}
                </h1>

                <!-- Job information -->
                <div class="flex flex-wrap gap-2 mt-4">

                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {{ job.location }}
                    </span>

                    <span class="bg-black text-white px-3 py-1 rounded-full text-sm">
                        {{ job.type }}
                    </span>

                </div>

                <!-- Description -->
                <div class="mt-6">
                    <h2 class="text-xl font-semibold text-black">
                        Job Description
                    </h2>

                    <p class="text-gray-600 mt-2 leading-relaxed">
                        {{ job.description }}
                    </p>
                </div>

                <!-- Salary -->
                <div class="mt-6 pt-2 border-t border-gray-200">
                    <p class="text-gray-600 mt-2">
                        £{{ job.salary_min }} - £{{ job.salary_max }}
                    </p>
                </div>

            </div>


            <!-- Application -->
            <template v-if="auth.user && auth.user.role === 'candidate'">

                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mt-6">

                    <h2 class="text-2xl font-bold text-black">
                        Apply for this job
                    </h2>

                    <p class="text-gray-500 mt-2">
                        Tell the employer why you're a good fit for this position.
                    </p>

                    <!-- Application error -->
                    <p
                        v-if="applicationError"
                        class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-4"
                    >
                        Application Error: {{ applicationError }}
                    </p>

                    <!-- Application success -->
                    <p
                        v-if="applicationSuccess"
                        class="bg-gray-100 border border-gray-200 text-gray-700 p-4 rounded-lg mt-4"
                    >
                        {{ applicationSuccess }}
                    </p>

                    <!-- Cover letter -->
                    <textarea
                        v-model="coverLetter"
                        placeholder="Write your cover letter..."
                        rows="6"
                        class="w-full border border-gray-300 rounded-lg px-4 py-3 mt-4
                               focus:outline-none focus:ring-2 focus:ring-black"
                    ></textarea>

                    <!-- Apply button -->
                    <button
                        :disabled="applicationSuccess || applicationSubmitting"
                        @click="handleApply"
                        class="w-full bg-black hover:bg-gray-800
                               disabled:bg-gray-300 disabled:cursor-not-allowed
                               text-white font-semibold py-3 rounded-lg
                               mt-4 transition"
                    >
                        {{ applicationSubmitting ? 'Applying...' : 'Apply Now' }}
                    </button>

                </div>

            </template>

        </div>
    </div>
</template>