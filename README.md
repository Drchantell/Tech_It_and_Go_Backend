# Tech It & Go! Backend

Tech It & Go! is my Per Scholas capstone project. This repository contains the Express and MongoDB backend for my technology lending library.

The backend supports account registration and login, JWT-protected routes, equipment management, lesson plans, and personal lending requests.

## Main Features

- MongoDB Atlas connection with Mongoose
- User registration with hashed passwords
- JWT login and protected routes
- Borrower and staff roles
- Full Equipment CRUD for staff
- Full Lending Request CRUD for borrowers
- Equipment search and availability filters
- Lesson plan read routes
- Ownership checks so users only manage their own requests
- Server-side pagination
- Validation and safe error messages
- Starter equipment and lesson seed data
- Safe non-destructive staff account setup
- Automated integration tests against MongoDB

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

## Create or Update a Staff Account

Add `SEED_STAFF_NAME`, `SEED_STAFF_EMAIL`, and `SEED_STAFF_PASSWORD` to your private `.env`, then run:

`npm run create-staff`

This does not wipe the database.

## Full CRUD Routes

### Equipment

- Create: `POST /api/equipment` - staff only
- Read all: `GET /api/equipment`
- Read one: `GET /api/equipment/:id`
- Update: `PATCH /api/equipment/:id` - staff only
- Delete/archive: `DELETE /api/equipment/:id` - staff only

### Lending Requests

- Create: `POST /api/requests`
- Read all owned requests: `GET /api/requests`
- Read one owned request: `GET /api/requests/:id`
- Update owned pending request: `PATCH /api/requests/:id`
- Delete owned pending request: `DELETE /api/requests/:id`

## Other API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/lessons`
- `GET /api/lessons/:id`

## Automated Test

Run:

`npm test`

The integration test connects to MongoDB and verifies registration, login, staff authorization, borrower ownership rules, equipment CRUD, lending-request CRUD, and lesson reads.

## Deployment

See `DEPLOYMENT.md` for the Render and MongoDB Atlas setup.

## Technology

Node.js, Express, MongoDB Atlas, Mongoose, bcrypt, JSON Web Tokens, dotenv, CORS, Supertest, Git, and GitHub.

## Author

Dr. Chantell McDowell  
Per Scholas Student
