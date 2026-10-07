Tech It and Go Backend

This repository holds the backend plan for my technology lending library capstone. I want the server to connect the React pages to MongoDB so equipment, lessons, users, and borrowing requests can be saved.

The backend application has not been added to this repository yet. The project-plan.txt file explains the planned features and routes. There is no server to run at this stage.

I plan to use Node.js, Express, MongoDB, and Mongoose. Node.js runs my JavaScript on the server. Express handles requests from the frontend. MongoDB stores the information, and Mongoose helps me organize it into models.

I also plan to use bcrypt to hash passwords and JSON Web Tokens to check login. Users should only be able to view and change their own borrowing requests. Staff will have permission to manage equipment.

The planned routes include registration and login, equipment browsing, lesson details, and creating, viewing, editing, and deleting personal requests. My full route plan is in project-plan.txt.

A planning challenge was deciding how users, equipment, lessons, and requests should connect. A borrowing request needs to point to both the person who owns it and the equipment being requested. I need to check permissions on the server rather than rely only on what buttons appear on the screen.

After I graduate, I would like to add staff approvals, return tracking, overdue reminders, and equipment condition reports. I would also like to use the project to support real nonprofit technology lending programs.

Author Dr. Chantell McDowell PerScholas Student
