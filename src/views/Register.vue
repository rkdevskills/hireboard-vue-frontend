<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth';

    const email = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const name = ref('')
    const role = ref('')
    const error = ref('')
    const auth = useAuthStore()
    const router = useRouter()

    async function handleRegister() {
        try {
            await auth.register({
                name: name.value,
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
                role: role.value
            })
            router.push('/')
        }
        catch (err) {
            error.value = err.message
        }
    }
</script>

<template>
    <div class="min-h-screen bg-gray-200 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-3xl font-bold text-black text-center mb-6">Register</h1>
            <p v-if="error" class="bg-red-100 text-red-500 p-3 rounded-lg mb-4">Error: {{ error }}</p>
            <form @submit.prevent="handleRegister">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2"> Name </label>
                    <input v-model="name" type="text" placeholder="Name" class="w-full border 
                    border-gray-700 rounded-lg px-4 py-2 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2"> Email </label>
                    <input v-model="email" type="email" placeholder="Email" class="w-full border 
                    border-gray-700 rounded-lg px-4 py-2 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500" />
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Password </label>
                    <input v-model="password" type="password" placeholder="Password" class="w-full border 
                    border-gray-700 rounded-lg px-4 py-2 
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Password confirmation </label>
                    <input v-model="password_confirmation" type="password" placeholder="Password confirmation" 
                    class="w-full border 
                    border-gray-700 rounded-lg px-4 py-2 
                    focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2"> Role </label>
                    <select v-model="role" class="w-full border 
                    border-gray-700 rounded-lg px-4 py-2 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500">
                        <option value="employer"> Employer</option>
                        <option value="candidate"> Candidate</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-black hover:bg-gray-700 text-white transition px-4 py-2 rounded-lg mt-2">Register</button>
            </form>
        </div>
    </div>
</template>