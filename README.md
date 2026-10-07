# Tech It & Go! Backend

## About My Project

Tech It & Go! is my Per Scholas capstone project. I created it as a technology lending library for educators, makerspaces, nonprofits, and learners.

This repository contains the backend of my application. I built it with Node.js, Express, MongoDB Atlas, and Mongoose.

The backend handles the database, account registration and login, equipment information, lesson plans, and lending requests.

## What the Backend Does

My backend can:

- Connect to MongoDB
- Register a new user
- Hash passwords before saving them
- Log in a user
- Create JWT tokens
- Protect private routes
- Separate borrower and staff permissions
- Store equipment
- Store lesson plans
- Store lending requests
- Check request ownership
- Validate form information
- Return clear API responses

## Full CRUD

My project includes full CRUD for Equipment and Lending Requests.

CRUD means Create, Read, Update, and Delete.

### Equipment CRUD

Staff users can:

- Create - add new equipment
- Read - view all equipment or one equipment item
- Update - change equipment information
- Delete - remove equipment

If equipment already has lending history, the application archives it instead of deleting the history.

Routes:

```text
POST   /api/equipment
GET    /api/equipment
GET    /api/equipment/:id
PATCH  /api/equipment/:id
DELETE /api/equipment/:id
```

### Lending Request CRUD

Logged-in borrowers can:

- Create - submit a new lending request
- Read - view all of their requests or one request
- Update - edit their own pending request
- Delete - delete their own pending request

Routes:

```text
POST   /api/requests
GET    /api/requests
GET    /api/requests/:id
PATCH  /api/requests/:id
DELETE /api/requests/:id
```

A borrower can only access their own requests.

## Database Models

I created four main Mongoose models.

### User

Stores information such as:

- Name
- Email
- Password hash
- Role

### Equipment

Stores information such as:

- Name
- Category
- Description
- Quantity available
- Skill level
- Safety notes
- On-site-only status
- Archived status

### Lesson Plan

Stores:

- Equipment reference
- Title
- Objectives
- Materials
- Steps
- Skill level

### Lending Request

Stores:

- Equipment reference
- User reference
- Borrower information
- Checkout date
- Return date
- Purpose
- Request status

## Authentication and Security

I use bcrypt to hash passwords.

I use JSON Web Tokens for login authentication.

Protected routes check the token before allowing access.

The backend also checks roles so regular borrowers cannot use staff-only equipment routes.

For lending requests, the backend checks the logged-in user's ID so one borrower cannot read, edit, or delete another borrower's request.

Private information such as my MongoDB connection string and JWT secret stays in a local `.env` file and is not committed to GitHub.

## Main Authentication Routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Lesson Plan Routes

```text
GET /api/lessons
GET /api/lessons/:id
```

## How to Run the Backend

1. Open the backend folder in VS Code.
2. Open the terminal.
3. Install the packages:

```bash
npm install
```

4. Copy `.env.example` and create a new file named `.env`.
5. Add your private settings:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
CLIENT_URL=http://localhost:5173
JWT_SECRET=YOUR_PRIVATE_SECRET
```

6. Start the server:

```bash
npm run dev
```

7. Open this address in the browser:

```text
http://localhost:5000/api/health
```

A successful connection should show that the server is running and the database is connected.

## Add Sample Data

To add the starter equipment and lesson plans, run:

```bash
npm run seed
```

I only need to run the seed when I want to reset or prepare sample data.

## Create a Staff Account

I can create or update a staff account without clearing my database.

I add these values to my private `.env` file:

```env
SEED_STAFF_NAME=Dr. Chantell McDowell
SEED_STAFF_EMAIL=YOUR_EMAIL
SEED_STAFF_PASSWORD=YOUR_PRIVATE_PASSWORD
```

Then I run:

```bash
npm run create-staff
```

## Testing

I added an integration test for the backend.

I can run it with:

```bash
npm test
```

The test checks:

- Registration
- Login
- JWT authentication
- Staff permissions
- Borrower permissions
- Equipment CRUD
- Lending Request CRUD
- Request ownership
- Lesson plan reading
- MongoDB database operations

The backend also includes a GitHub Actions workflow that runs the syntax check and integration test.

## Technologies I Used

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Tokens
- dotenv
- CORS
- Supertest
- Git
- GitHub

## Deployment

The backend is prepared for Render deployment.

I included:

- `render.yaml`
- Environment variable support
- A health-check route
- MongoDB Atlas connection support
- CORS settings for local and deployed frontend URLs

Deployment instructions are in:

`DEPLOYMENT.md`

## Challenges I Faced

One of the biggest challenges I faced was connecting MongoDB correctly and understanding how the backend communicates with the database. I had to learn the difference between my MongoDB Atlas login and the database user credentials used by the application. I also had to understand environment variables and why private information such as the MongoDB connection string should never be committed to GitHub.

Authentication was another major challenge. I had to understand how bcrypt hashes passwords, how JWT tokens are created, and how protected routes check the token before allowing access.

Adding borrower and staff permissions made the project more complex. I had to make sure a regular borrower could not create, edit, or delete equipment. I also had to make sure one borrower could not read, change, or delete another borrower's lending request.

Building full CRUD correctly was another important challenge. I had to connect Create, Read, Update, and Delete operations to MongoDB for both equipment and lending requests while also validating the information being submitted.

The lending request dates also required extra validation. I needed to prevent checkout dates in the past and make sure the return date came after the checkout date.

Pagination was new for me too. Instead of sending every lending request at once, I had to understand how the backend could return smaller groups of results and include page information for the frontend.

Deployment preparation was another learning experience. I had to understand CORS, why the backend must allow the deployed frontend URL, how Render connects to MongoDB Atlas, and how environment variables are added without exposing passwords or secrets.

Testing the backend also helped me work through challenges. I added an integration test so I could check registration, login, permissions, ownership, MongoDB operations, and full CRUD together instead of testing every piece separately by hand.

## What I Learned

This backend helped me understand how a full-stack application works behind the user interface.

I learned how to:

- Create an Express server
- Connect MongoDB with Mongoose
- Build models and API routes
- Use CRUD operations
- Hash passwords
- Create JWT authentication
- Protect routes
- Use user roles
- Check data ownership
- Validate information
- Connect a React frontend to an Express backend
- Test API routes
- Prepare an application for deployment

## Author

Dr. Chantell McDowell  
Per Scholas Student
