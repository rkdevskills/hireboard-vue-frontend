import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import JobList from '../views/JobList.vue'
import JobDetail from "@/views/JobDetail.vue"
import PostJob from "@/views/PostJob.vue"
import { useAuthStore } from "@/stores/auth"
import AccessDenied from "@/views/AccessDenied.vue"
import MyJobs from "@/views/MyJobs.vue"
import EditJob from "@/views/EditJob.vue"
import Register from "@/views/Register.vue"

const routes = [
    { path: '/access-denied', component: AccessDenied },
    { path: '/register', component: Register, meta: { guestOnly: true } },
    { path: '/login', component: Login, meta: { guestOnly: true } },
    { path: '/', component: JobList },
    { path: '/jobs/:id', component: JobDetail },
    { path: '/post-job', component: PostJob, meta: { requiresAuth: true } },
    { path: '/my-jobs', component: MyJobs, meta: { requiresAuth: true } },
    { path: '/jobs/:id/edit', component: EditJob, meta: { requiresAuth: true } }
] 

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    const auth = useAuthStore()
    if(to.meta.requiresAuth && !auth.user) {
        return { path: '/login' }
    } else if(to.meta.requiresAuth && auth.user.role !== 'employer')
    {
        return { path: '/access-denied' }
    }

    if(to.meta.guestOnly && auth.user) {
        return { path: '/' }
    }
})

export default router