<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    import { useRouter } from 'vue-router'

    const jobs = ref([])
    const error = ref('')
    const loading = ref(true)
    const auth = useAuthStore()
    const router = useRouter()

    const currentPage = ref(1)
    const lastPage = ref(1)

    const jobStatus = ref('')
    
    async function getMyJobs() {
        loading.value = true
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs?page=' + currentPage.value + '&status=' + jobStatus.value, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                },
            })

            if(!response.ok) {
                throw new Error('failed to load the jobs')
            }

            const data = await response.json()
            jobs.value = data.data
            currentPage.value = data.meta.current_page
            lastPage.value = data.meta.last_page
        }
        catch (err) {
            error.value = err.message
        }
        finally {
            loading.value = false
        }
    }

    const deleteError = ref('')
    const successMessage = ref('')
    async function handleDelete(jobId) {
        if(!confirm('Are you sure you want to delete this job?')) {
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/' + jobId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                },
            })

            if(response.ok) {
                successMessage.value = 'Job has been deleted successfully';
                // Remove the deleted job from the jobs array
                jobs.value = jobs.value.filter(job => job.id !== jobId)
            } else {
                const data = await response.json()
                throw new Error(data.message || 'Failed to delete the job')
            }

        } catch (deleteErr) {
            deleteError.value = deleteErr.message
        }
    }

    function nextPage() {
        if(currentPage.value < lastPage.value) {
            currentPage.value++
            getMyJobs()
        }
    }

    function previousPage() {
        if(currentPage.value > 1) {
            currentPage.value--
            getMyJobs()
        }
    }

    watch(jobStatus, () => {
        currentPage.value = 1
        getMyJobs()
    })

    onMounted(() => {
        getMyJobs()
    })
</script>

<template>
    <div class="min-h-screen bg-gray-50 px-4 py-10">
        
        <div class="mx-auto max-w-5xl">
            <!-- Page heading -->
            <h1 class="text-3xl font-bold text-black">Manage Jobs</h1>

            <p class="mt-2 mb-8 text-gray-500">View, edit, and manage your job postings.</p>

            <!-- Job status filter -->
            <div class="mb-6 flex items-center w-2/3 gap-4">
                <label class="mr-2 text-gray-500">Filter by status:</label>
                <select v-model="jobStatus"
                class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none 
                focus:ring-2 focus:ring-gray-300">
                    <option value="">All</option>
                    <option value="published"> Published</option>
                    <option value="draft"> Draft</option>
                    <option value="closed"> Closed</option>
                </select>
            </div>

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

            <!-- detele Error -->
            <div v-else-if="deleteError" class="max-w-3xl mx-auto">
                <p class="bg-red-50 border border-red-200 text-red-600 p-2 rounded-lg">
                    Error: {{ deleteError }}
                </p>
            </div>

            <!-- Success -->
            <div v-else-if="successMessage" class="max-w-3xl mx-auto">
                <p class="rounded-lg bg-green-50 border border-green-200 p-2 text-green-600"> 
                    {{ successMessage }} 
                </p>
            </div>

            <!-- Job list -->
            <ul class="space-y-4 mt-6">
                <li v-for="job in jobs" :key="job.id" class="flex flex-col gap-4 rounded-xl border 
                border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <!-- Job information -->
                    <div>
                        <h2 class="text-xl font-semibold text-black">{{ job.title }}
                            <span class="rounded-full text-sm px-4 py-1 capitalize" :class="{
                                'text-red-600 bg-red-200': job.status === 'closed',
                                'text-green-600 bg-green-200': job.status === 'published',
                                'text-gray-600 bg-gray-200': job.status === 'draft'
                            }">
                                {{ job.status }}
                            </span>
                        </h2>

                        <p class="mt-2 text-sm text-gray-500">{{ job.location }} · {{ job.type }}</p>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex gap-3">

                        <button @click="router.push('/jobs/'+ job.id + '/edit')" class="rounded-lg bg-black px-5 py-2 
                        text-white transition hover:bg-gray-800">Edit</button>

                        <button @click="handleDelete(job.id)" class="rounded-lg bg-black px-5 py-2 
                        text-white transition hover:bg-gray-800">Delete</button>
                    </div>
                </li>
            </ul>

            <!-- Pagination -->
            <div class="flex items-center justify-center gap-4 py-10">
                <button @click="previousPage" :disabled="currentPage === 1" class="rounded-lg bg-gray-500 px-5 py-2 
                text-white transition hover:bg-gray-600 
                disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">Previous</button>
                <span class="text-sm text-gray-600"> Page {{ currentPage }} of {{ lastPage }} </span>
                <button @click="nextPage" :disabled="currentPage === lastPage" class="rounded-lg bg-gray-500 px-5 
                py-2 text-white transition hover:bg-gray-600 
                disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">Next</button>
            </div> 

            <!-- Empty state -->
            <div v-if="jobStatus !== ''" class="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
                <p class="text-gray-600">No jobs found for the selected status.</p>
            </div>
            <div v-else-if="jobs.length === 0" class="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p class="text-gray-600">You haven't posted any jobs yet.</p>
            </div>
        </div>
    </div>
</template>