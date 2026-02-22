# Portfolio Website

Modern portfolio site with an admin portal for live content updates.

## Tech Stack
- Frontend: React (Vite), CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- Hosting: Vercel (frontend + backend)

## Backend Deployment (Vercel)
1. Create a new Vercel project and select the `backend` folder as the root.
2. Set the environment variables:
	- `MONGO_URI`
	- `FRONTEND_URL` (your Vercel frontend URL)
3. Deploy. Vercel will use `backend/vercel.json` and `backend/api/index.js`.
4. Copy the Vercel backend URL and update the frontend `VITE_API_URL`.
