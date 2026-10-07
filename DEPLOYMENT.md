# Tech It & Go! Backend Deployment Guide

This guide deploys the Express API to Render and connects it to MongoDB Atlas.

## Before You Deploy

Make sure the backend repository is on GitHub:

Drchantell/Tech_It_and_Go_Backend

The repository already includes:

- `render.yaml`
- `/api/health`
- environment variable support
- MongoDB connection code
- JWT authentication
- automated CRUD tests

## Step 1: Prepare MongoDB Atlas

1. Sign in to MongoDB Atlas.
2. Open the Tech It & Go project and cluster.
3. Make sure you have a database user for the application.
4. Give that database user read and write access to the Tech It & Go database.
5. Open Network Access.
6. Add the outbound IP addresses or network range that will be allowed to connect to Atlas.
7. In the cluster, choose Connect > Drivers.
8. Copy the Node.js connection string.
9. Replace the password placeholder with the database user's password.
10. If the password contains special URL characters, URL-encode them.

Your connection string should look similar to:

`mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/tech_it_and_go?retryWrites=true&w=majority`

Do not commit this value to GitHub.

## Step 2: Create the Render Service

The easiest route is the Blueprint already included in `render.yaml`.

1. Sign in to Render.
2. Choose New > Blueprint.
3. Connect GitHub if needed.
4. Select `Drchantell/Tech_It_and_Go_Backend`.
5. Use the `main` branch.
6. Render reads `render.yaml` and creates the Node web service.

The service is configured to use:

- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`

## Step 3: Add Render Environment Variables

When Render asks for variables, enter:

### MONGO_URI

Paste the private MongoDB Atlas connection string.

### CLIENT_URL

For the first backend deployment, you can use:

`http://localhost:5173`

After the Vercel frontend is deployed, change this to include both local and production addresses separated by a comma:

`http://localhost:5173,https://YOUR-FRONTEND.vercel.app`

### JWT_SECRET

The Blueprint is set to let Render generate this secret automatically.

Do not put JWT_SECRET or MONGO_URI in GitHub.

## Step 4: Deploy

Choose Deploy Blueprint.

When deployment finishes, Render gives the API a URL similar to:

`https://tech-it-and-go-api.onrender.com`

Open:

`https://YOUR-RENDER-URL.onrender.com/api/health`

A working deployment should return:

`{"server":"running","database":"connected"}`

## Step 5: Add Sample Data

The seed script is intended to be run once against the production database.

From a trusted local terminal with the production `MONGO_URI` in your private `.env` file, run:

`npm install`

then:

`npm run seed`

This adds the starter equipment and lesson plans.

If you want a staff account, also add these private values before running the seed:

`SEED_STAFF_NAME=Dr. Chantell McDowell`

`SEED_STAFF_EMAIL=YOUR_STAFF_EMAIL`

`SEED_STAFF_PASSWORD=YOUR_PRIVATE_PASSWORD`

Do not commit the staff password.

## Step 6: Connect the Frontend

After Vercel gives you the frontend URL:

1. Return to Render.
2. Open the Tech It & Go API service.
3. Open Environment.
4. Edit `CLIENT_URL`.
5. Set it to:

`http://localhost:5173,https://YOUR-FRONTEND.vercel.app`

6. Save the change.
7. Allow Render to redeploy.

## Backend Deployment Test

Check these after deployment:

1. `/api/health` says database connected.
2. Register a borrower account.
3. Log in.
4. Browse equipment.
5. Submit a request.
6. Refresh the dashboard and confirm the request is still present.
7. Edit the request.
8. Delete the request.
9. Log in as staff.
10. Create equipment.
11. Edit equipment.
12. Delete or archive equipment.

If all twelve work, the deployed backend and MongoDB connection are functioning.
