import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useApplicationStore = defineStore('application', () => {
    const error = ref('')

    async function applyToJob(jobId, coverLetter) {
        const auth = useAuthStore()
        error.value = ''
        const response = await fetch('http://127.0.0.1:8000/api/applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth.token
            },
            body: JSON.stringify({ job_id: jobId, cover_letter: coverLetter })
        })

        if(!response.ok) {
            const data = await response.json()
            error.value = data.message || 'Failed to apply to the job'
            throw new Error(error.value)
        }

        return await response.json()
    }

    return { error, applyToJob }
})