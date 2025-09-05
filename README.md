# CPS Academy Learning Platform

A role-based learning management system with authentication and dynamic content.

## Setup
1. Navigate to `backend` and run `npm install`.
2. Start Strapi with `npm run develop`.
3. Navigate to `frontend` and run `npm install`.
4. Start Next.js with `npm run dev`.
5. Access at `http://localhost:3000`.

## Features
- User authentication and registration
- Role-based course views (Normal User, Student, Social Media Manager/Developer)
- Responsive design

## Notes
- Known issue: Role-based course details (e.g., modules) are not displaying due to a "policy failed" error, likely from Strapi permissions. The frontend uses username as a role proxy, but full functionality requires further Strapi configuration.
- Open to feedback for improvement.