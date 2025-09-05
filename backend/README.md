# CPS Academy Backend

This is the Strapi backend for the CPS Academy Learning Platform, managing user authentication, roles, and course data.

## Setup
1. Navigate to the `backend` directory: `cd backend`.
2. Install dependencies: `npm install`.
3. Start the Strapi server: `npm run develop`.
4. Access the Strapi admin panel at `http://localhost:1337/admin` to configure roles, users, and content (e.g., courses and modules).

## Features
- User authentication and role management (Normal User, Student, Social Media Manager/Developer).
- API endpoints for courses and modules.
- Role-based access control via Strapi permissions.

## Notes
- Ensure the `Course` and `Module` content types are set up with a one-to-many relation.
- Default admin credentials can be set during initial setup if needed.