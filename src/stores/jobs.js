import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useJobsStore = defineStore('jobs', () => {
    const error = ref('')
    const updateJobError = ref('')
    
    async function createJob(fields) {
        const auth = useAuthStore()
        error.value = ''
        const response = await fetch('http://127.0.0.1:8000/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + auth.token
            },
            body: JSON.stringify(fields)
        })

        if(!response.ok) {
            const data = await response.json()
            error.value = data.message || 'Failed to create a job'
            throw new Error(error.value)
        }

        return await response.json()
    }

    async function updateJob(id, fields) {
        const auth = useAuthStore()
        updateJobError.value = ''

        const response = await fetch('http://127.0.0.1:8000/api/jobs/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization': 'Bearer ' + auth.token
            },
            body: JSON.stringify(fields)
        })

        if(!response.ok) {
            const data = await response.json()
            updateJobError.value = data.message || 'Failed to update a job'
            throw new Error(updateJobError.value)
        }
        
        return await response.json()
    }

    return { error, createJob, updateJobError, updateJob }
})