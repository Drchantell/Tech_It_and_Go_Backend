require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/connection");

function safeMongoError(error) {
  const rawMessage = error?.message || "Unknown MongoDB connection error.";
  const message = rawMessage.replace(
    /mongodb(\+srv)?:\/\/[^@\s]+@/gi,
    "mongodb$1://[credentials-redacted]@"
  );

  return {
    name: error?.name || "Error",
    code: error?.code || "none",
    message,
  };
}

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

    server.on("error", (error) => {
      console.error("The server could not listen:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", safeMongoError(error));
    console.error(
      "The server has not started. Check the MongoDB error above for the exact cause."
    );
    process.exitCode = 1;
  }
}

startServer();
