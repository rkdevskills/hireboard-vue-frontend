<script setup>
import { ref } from 'vue'

const props = defineProps(['job', 'success', 'isSubmitting'])
const emit = defineEmits(['submit'])

const title = ref(props.job?.title ?? '')
const description = ref(props.job?.description ?? '')
const location = ref(props.job?.location ?? '')
const type = ref(props.job?.type ?? 'full-time')
const salary_min = ref(props.job?.salary_min ?? '')
const salary_max = ref(props.job?.salary_max ?? '')
const status = ref(props.job?.status ?? 'draft')

function handleSubmit() {
    emit('submit', {
        title: title.value,
        description: description.value,
        location: location.value,
        type: type.value,
        salary_min: salary_min.value,
        salary_max: salary_max.value,
        status: status.value
    })
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <!-- Title -->
        <div class="mb-5">
            <label class="mb-2 block font-semibold text-gray-600"> Job Title </label>
            <input v-model="title" type="text" placeholder="e.g. Frontend Developer" 
            class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none" />
        </div>

        <!-- Description -->
        <div class="mb-5">
            <label class="mb-2 block font-semibold text-gray-600"> Description </label>
            <textarea v-model="description" placeholder="Describe the job..." 
            class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none" rows="5"></textarea>
        </div>

        <!-- Location -->
        <div class="mb-5">
            <label class="mb-2 block font-semibold text-gray-600">Location</label>
            <input v-model="location" type="text" placeholder="e.g. London, UK" 
            class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none" />
        </div>

        <!-- Job Type -->
        <div class="mb-5">
            <label class="mb-2 block font-semibold text-gray-600">Job Type</label>
            <select v-model="type" 
            class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
            </select>
        </div>

        <!-- Salary -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label class="mb-2 block font-semibold text-gray-600">Mininum Salary</label>
                <input v-model="salary_min" type="number" placeholder="e.g. 30000" 
                class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none" />
            </div>
            <div>
                <label class="mb-2 block font-semibold text-gray-600">Maximum Salary</label>
                <input v-model="salary_max" type="number" placeholder="e.g. 50000" 
                class="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-gray-300 focus:outline-none" />
            </div>
        </div>

        <!-- Job Status -->
        <div class="mb-5">
            <label class="mb-2 block font-semibold text-gray-600">Status</label>
            <select v-model="status" 
            class="w-full rounded-lg border border-gray-200 px-4 py-2 
            focus:ring-2 focus:ring-gray-300 focus:outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
            </select>
        </div>

        <!-- Submit -->
        <button :disabled="success || isSubmitting" type="submit" 
        class="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-700">
            {{ isSubmitting ? 'Submitting...' : 'Submit Job' }}
        </button>
    </form>
</template>