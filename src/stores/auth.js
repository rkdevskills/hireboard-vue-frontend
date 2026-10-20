import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    async function login(email, password) {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({email, password})
        })

        if(!response.ok) {
            throw new Error('login failed ' + response.status)
        }

        const data = await response.json()
        user.value = data.user
        token.value = data.token
        localStorage.setItem('token', data.token)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    async function fetchUser(params) {
        if(!token.value) return

        try {
            const response = await fetch('http://127.0.0.1:8000/api/me', {
                headers: {
                    'Authorization': 'Bearer ' + token.value,
                    'Accept': 'application/json',
                },
            })
            const data = await response.json()
            user.value = data.data
        } catch (err) {
            logout()
        }
    }

    return { user, token, login, logout, fetchUser}
})