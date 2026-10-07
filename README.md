# Tech It & Go! Backend

Tech It & Go! is my Per Scholas capstone project. This repository contains the Express and MongoDB backend for my technology lending library.

The backend supports account registration and login, JWT-protected routes, equipment management, lesson plans, and personal lending requests.

## Main Features

- MongoDB Atlas connection with Mongoose
- User registration with hashed passwords
- JWT login and protected routes
- Borrower and staff roles
- Equipment CRUD for staff
- Equipment search and availability filters
- Lesson plan routes
- Personal lending request create, read, edit, and delete
- Ownership checks so users only manage their own requests
- Server-side pagination
- Validation and safe error messages
- Starter equipment and lesson seed data

## Run the Backend

1. Open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to a new file named `.env`.
4. Add your private MongoDB Atlas connection string to `MONGO_URI`.
5. Replace the JWT placeholder with a long random value.
6. Run `npm run dev`.
7. Open `http://localhost:5000/api/health` to check the server and database connection.

A successful connection returns that the server is running and the database is connected.

## Add Starter Data

Run:

`npm run seed`

This adds sample equipment and matching lesson plans.

If you also want a staff demo account, add `SEED_STAFF_EMAIL` and a password of at least 8 characters to your private `.env` file before running the seed command.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/equipment`
- `GET /api/equipment/:id`
- `POST /api/equipment` - staff only
- `PATCH /api/equipment/:id` - staff only
- `DELETE /api/equipment/:id` - staff only
- `GET /api/lessons`
- `GET /api/lessons/:id`
- `GET /api/requests`
- `POST /api/requests`
- `PATCH /api/requests/:id`
- `DELETE /api/requests/:id`

## Technology

Node.js, Express, MongoDB Atlas, Mongoose, bcrypt, JSON Web Tokens, dotenv, CORS, Git, and GitHub.

## Author

Dr. Chantell McDowell  
Per Scholas Student
