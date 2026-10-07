require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/connection");

async function startServer() {
  const port = Number(process.env.PORT || 5000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("PORT must be a number between 1 and 65535.");
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
    server.on("error", () => {
      console.error("The server could not listen. Check whether the port is already in use.");
      process.exit(1);
    });
  } catch {
    console.error("MongoDB could not connect. Check MONGO_URI, your database password, and Atlas network access. The server has not started.");
    process.exitCode = 1;
  }
}

startServer();
