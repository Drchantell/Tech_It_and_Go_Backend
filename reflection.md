# Tech It & Go! Backend Reflection

Building the Tech It & Go! backend helped me understand what happens after a user clicks a button in a full-stack application. React sends a request to Express, the server checks the information, Mongoose works with MongoDB, and the server sends a response back to the frontend.

The backend now includes four main models: User, Equipment, LessonPlan, and LendingRequest. I added account registration, bcrypt password hashing, JWT login, protected routes, borrower and staff roles, equipment CRUD, lesson routes, personal request CRUD, pagination, ownership checks, validation, and starter seed data.

A major challenge was security. I needed to make sure passwords are never stored as plain text and that one user cannot edit another user's borrowing request. I also learned why private values such as the MongoDB connection string and JWT secret belong in a local .env file instead of GitHub.

Another challenge was keeping the borrowing process realistic. Submitting a request does not automatically reserve the equipment. New requests are saved as pending, and advanced approval, checkout, return tracking, and reminders can be added later.

I also added a seed script so I can quickly create sample equipment and lesson plans for testing. A staff demo account can be created from private environment variables without putting a password in the repository.

The backend JavaScript syntax check passes in GitHub Actions. A live MongoDB connection still depends on my private Atlas connection string, database access settings, and local or deployment environment variables.

This project helped me practice Express, MongoDB, Mongoose, authentication, authorization, REST APIs, validation, and full-stack data flow in one application.

Author: Dr. Chantell McDowell  
Per Scholas Student
