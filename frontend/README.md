# CPS Academy Frontend

This is the Next.js frontend for the CPS Academy Learning Platform, providing a responsive user interface with authentication and role-based views.

## Setup
1. Navigate to the `frontend` directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Ensure the Strapi backend is running (see `backend/README.md`).
4. Start the Next.js app: `npm run dev`.
5. Access the app at `http://localhost:3000`.

## Features
- User authentication and registration.
- Role-based course views (Normal User sees summaries, Student sees details).
- Responsive design for mobile, tablet, and desktop.
- Dynamic course and module data fetching from Strapi.

## Notes
- Log in with `test@example.com` (password: `password123`) to test as a Student.
- Clear `localStorage` if role updates don’t reflect.