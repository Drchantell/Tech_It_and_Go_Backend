require("dotenv").config();

const bcrypt = require("bcrypt");

const connectDB = require("./config/connection");
const User = require("./models/User");

async function createStaff() {
  const name = String(process.env.SEED_STAFF_NAME || "Tech It & Go Staff").trim();
  const email = String(process.env.SEED_STAFF_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.SEED_STAFF_PASSWORD || "");

  if (!email) {
    throw new Error("Add SEED_STAFF_EMAIL to your private .env file.");
  }

  if (password.length < 8) {
    throw new Error("SEED_STAFF_PASSWORD must be at least 8 characters.");
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      passwordHash,
      role: "staff",
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  console.log(`Staff account is ready for ${user.email}.`);
  process.exit(0);
}

createStaff().catch((error) => {
  console.error("Staff account setup failed:", error.message);
  process.exit(1);
});
