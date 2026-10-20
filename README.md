# HireBoard – Vue Frontend

A job board where employers post and manage jobs and candidates browse and apply. This is the **Vue 3 frontend**. It talks to a separate **Laravel 12 REST API** (Sanctum token auth).

> A React version of the same frontend, built against the same API, is planned.

## Screenshots

<!-- Add 2–3 screenshots here: job list, job detail, My Jobs page -->

## Features

**Everyone**
- Browse published jobs with pagination and an empty state
- View a job's details (dynamic route `/jobs/:id`)
- Log in and log out, with the session restored after a page refresh

**Candidates**
- Apply to a job with an optional cover letter (the apply form is only shown to candidates)

**Employers**
- Post a new job
- **My Jobs** page listing the employer's own jobs in every status, with a status badge, pagination, and a status filter (All / Published / Draft / Closed)
- Edit a job, using the same form component as "Post a job"
- Delete a job. The API refuses with a clear message if the job already has applications, so those jobs are closed instead

**Access control**
- Route guards with a `meta.requiresAuth` flag
- Not logged in → redirected to `/login`
- Logged in with the wrong role → redirected to `/access-denied`
- The API enforces the same rules with policies, so the frontend guards are a convenience and not the security boundary

## Tech stack

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`, single-file components)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project structure

```
src/
├── components/
│   └── JobForm.vue        # shared form for creating and editing a job
├── router/
│   └── index.js           # routes and the beforeEach guard
├── stores/
│   ├── auth.js            # user, token, login, logout, fetchUser
│   ├── jobs.js            # createJob, updateJob
│   └── applications.js    # applyToJob
├── views/
│   ├── JobList.vue
│   ├── JobDetail.vue
│   ├── Login.vue
│   ├── PostJob.vue
│   ├── EditJob.vue
│   ├── MyJobs.vue
│   └── AccessDenied.vue
├── App.vue                # navigation bar
└── main.js                # fetches the logged-in user before mounting the app
```

## Getting started

### Prerequisites

- Node.js 20 or higher
- The HireBoard Laravel API running locally (see below)

### 1. Run the API

Clone and set up the API repository (link: `<your-api-repo-url>`), then start it:

```bash
php artisan serve
```

It should be available at `http://127.0.0.1:8000`.

The API must allow requests from the Vite dev server. In the API's `config/cors.php`, `allowed_origins` should include `http://localhost:5173`.

### 2. Run the frontend

```bash
git clone <your-frontend-repo-url>
cd hireboard-vue
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173`.

## API endpoints used

| Feature | Method and path | Auth |
|---|---|---|
| List jobs (public: published only; employer: own jobs) | `GET /api/jobs?page=&status=` | Optional |
| View a job | `GET /api/jobs/{id}` | No |
| Login | `POST /api/login` | No |
| Current user | `GET /api/me` | Yes |
| Post a job | `POST /api/jobs` | Employer |
| Update a job | `PUT /api/jobs/{id}` | Owner |
| Delete a job | `DELETE /api/jobs/{id}` | Owner |
| Apply to a job | `POST /api/applications` | Candidate |

Authenticated requests send the Sanctum token as `Authorization: Bearer <token>`.

## What I learned building this

- Reactivity with `ref`, `computed` and `watch`
- Splitting a UI into components: props down, emits up, and one shared form for create and edit
- Sharing state with Pinia, including one store using another
- Routing with dynamic routes and navigation guards, and fixing a race condition by restoring the user before the app mounts
- Handling loading, error, success and empty states for every request
- Reading API errors (401, 403, 422, 500) in the browser's Network tab

## Known limitations and next steps

- The API base URL (`http://127.0.0.1:8000`) is hard-coded. It should move to a Vite environment variable (`VITE_API_URL`).
- Registration page: the API supports registration, but this frontend only has login.
- `GET /api/jobs/{id}` returns draft and closed jobs to anyone who knows the ID. It should return 404 unless the job is published or the requester owns it.
- No automated tests yet.

## License

Personal portfolio project.