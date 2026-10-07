# Changing My MongoDB Atlas Database Password

**Project:** Tech It & Go!  
**Author:** Dr. Chantell McDowell  
**Database user:** `drchantellmcdowell_db_user`

This is the password used by my Tech It & Go! backend to connect to MongoDB Atlas. It is different from my normal MongoDB Atlas website login password.

## Change the Database User Password in Atlas

1. Sign in to MongoDB Atlas.
2. Open my Tech It & Go! project.
3. Open **Database & Network Access** under **Security**.
4. Choose the **Database Users** tab.
5. Find `drchantellmcdowell_db_user`.
6. Choose **Edit**.
7. Enter the new database password.
8. Choose **Update User**.

## Update My Local `.env`

After changing the password in Atlas, I update the private `MONGO_URI` in my backend `.env` file.

```env
MONGO_URI=mongodb+srv://drchantellmcdowell_db_user:MY_NEW_PASSWORD@techitgocluster.skcxpzd.mongodb.net/?appName=TechItGoCluster
MONGO_DB_NAME=TechItAndGo
```

I never put the real password in `.env.example`, README files, screenshots, class slides, or GitHub.

If the password contains special URI characters, I use a URL-safe/percent-encoded version of those characters in the connection string.

## Test the New Password

From the backend folder:

```bash
npm run dev
```

Then I open:

```text
http://localhost:5000/api/health
```

I want the response to show that the server is running and the database is connected.

## After Deployment

When the backend is deployed to Render, I also update the private `MONGO_URI` environment variable in Render with the new password and redeploy/restart the service.

## Important

Changing the Atlas database user password does not require me to commit anything to GitHub. The real password always stays private.
