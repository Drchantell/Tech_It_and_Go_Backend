Tech It and Go Backend

I am building a technology lending library for my Per Scholas capstone. This first step includes an Express server and a MongoDB connection using Mongoose. Equipment, lessons, login, and borrowing requests will be added next.

To run it, download or clone this repository and open the folder in VS Code. In the terminal, run npm install. Copy .env.example into a new file named .env. Replace the MONGO_URI placeholder with your own MongoDB Atlas connection string. Keep .env private and do not upload it to GitHub.

Run npm run dev to start the server. It connects to MongoDB before it begins listening on port 5000. When the connection works, the terminal prints MongoDB connected successfully and Server is running on port 5000.

Open http://localhost:5000/api/health to check the connection. A connected database returns status 200. If the database disconnects after startup, the route returns status 503. The home route at http://localhost:5000 shows a welcome message.

The connection code is ready, but a live Atlas connection still needs my private database settings. I have not verified a live database connection yet. If startup fails, I need to check the connection string, database password, and Atlas network access.

One challenge is keeping database settings separate from the code so I can share the project without sharing my password. Another is making sure the server does not announce success before MongoDB connects.

After I graduate, I would like to add staff approvals, return tracking, reminders, and equipment condition reports.

Author Dr. Chantell McDowell PerScholas Student
