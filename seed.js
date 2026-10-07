require("dotenv").config();

const bcrypt = require("bcrypt");

const connectDB = require("./config/connection");
const Equipment = require("./models/Equipment");
const LessonPlan = require("./models/LessonPlan");
const LendingRequest = require("./models/LendingRequest");
const User = require("./models/User");

const equipmentSeed = [
  {
    key: "3d-printing-kit",
    name: "3D Printing Starter Kit",
    category: "3D Printing",
    description: "A beginner-friendly kit for learning 3D design, slicing, and printing.",
    quantityAvailable: 3,
    skillLevel: "Beginner",
    safetyNotes: "Adult supervision is recommended while the printer is heating or moving.",
    onSiteOnly: false,
  },
  {
    key: "robotics-kit",
    name: "Robotics Kit",
    category: "Robotics",
    description: "Build and program simple robots while learning sensors, motors, and coding.",
    quantityAvailable: 5,
    skillLevel: "Beginner",
    safetyNotes: "Keep small parts organized and follow the kit instructions.",
    onSiteOnly: false,
  },
  {
    key: "coding-laptop",
    name: "Coding Laptop",
    category: "Computers",
    description: "A laptop prepared for coding practice, web development, and digital projects.",
    quantityAvailable: 8,
    skillLevel: "All Levels",
    safetyNotes: "Use the provided charger and keep food and drinks away from the computer.",
    onSiteOnly: false,
  },
  {
    key: "vinyl-cutter",
    name: "Vinyl Cutter",
    category: "Digital Fabrication",
    description: "Create decals, signs, labels, and simple design projects with cut vinyl.",
    quantityAvailable: 2,
    skillLevel: "Beginner",
    safetyNotes: "Keep hands away from the blade area while the machine is operating.",
    onSiteOnly: true,
  },
  {
    key: "cnc-machine",
    name: "Desktop CNC Machine",
    category: "Digital Fabrication",
    description: "Learn basic computer-controlled cutting and prototype small projects.",
    quantityAvailable: 1,
    skillLevel: "Intermediate",
    safetyNotes: "Safety glasses and staff supervision are required.",
    onSiteOnly: true,
  },
  {
    key: "entrepreneurship-kit",
    name: "Entrepreneurship Idea Kit",
    category: "Entrepreneurship",
    description: "Tools and activities for turning an idea into a simple business concept.",
    quantityAvailable: 6,
    skillLevel: "Beginner",
    safetyNotes: "No special safety requirements.",
    onSiteOnly: false,
  },
];

const lessonSeed = {
  "3d-printing-kit": {
    title: "Introduction to 3D Printing",
    objectives: ["Learn how a digital model becomes a printed object."],
    materials: ["3D printer", "Filament", "Computer", "Simple STL file"],
    steps: [
      "Review the main parts of the 3D printer.",
      "Open a simple 3D model.",
      "Prepare the model in slicing software.",
      "Review basic printer safety.",
      "Start the print with supervision.",
    ],
    skillLevel: "Beginner",
  },
  "robotics-kit": {
    title: "Build Your First Robot",
    objectives: ["Build a simple robot and understand how its basic parts work together."],
    materials: ["Robotics kit", "Computer", "USB cable"],
    steps: [
      "Identify the parts.",
      "Build the base.",
      "Connect the motor.",
      "Load a simple program.",
      "Test and improve the robot.",
    ],
    skillLevel: "Beginner",
  },
  "coding-laptop": {
    title: "Create Your First Web Page",
    objectives: ["Use HTML and CSS to create a simple web page."],
    materials: ["Laptop", "Code editor", "Web browser"],
    steps: [
      "Create an HTML file.",
      "Add a heading and paragraph.",
      "Create a CSS file.",
      "Add colors and spacing.",
      "Open the page in a browser.",
    ],
    skillLevel: "Beginner",
  },
  "vinyl-cutter": {
    title: "Vinyl Design Basics",
    objectives: ["Create and cut a simple vinyl design."],
    materials: ["Vinyl cutter", "Vinyl", "Computer", "Design software"],
    steps: [
      "Create a simple design.",
      "Size the design.",
      "Load the vinyl.",
      "Send the design to the cutter.",
      "Weed the finished design.",
    ],
    skillLevel: "Beginner",
  },
  "cnc-machine": {
    title: "CNC Introduction",
    objectives: ["Understand the basic steps used to prepare a small CNC project."],
    materials: ["Desktop CNC", "Safety glasses", "Computer", "Practice material"],
    steps: [
      "Review safety.",
      "Open the design.",
      "Choose the tool.",
      "Secure the material.",
      "Run the project with supervision.",
    ],
    skillLevel: "Intermediate",
  },
  "entrepreneurship-kit": {
    title: "Build Your Business Idea",
    objectives: ["Turn a problem or idea into a simple business concept."],
    materials: ["Idea worksheet", "Markers", "Sticky notes"],
    steps: [
      "Choose a problem.",
      "Describe the customer.",
      "Create a solution.",
      "Name the idea.",
      "Share a short pitch.",
    ],
    skillLevel: "Beginner",
  },
};

async function seed() {
  await connectDB();

  await LendingRequest.deleteMany({});
  await LessonPlan.deleteMany({});
  await Equipment.deleteMany({});

  const equipmentMap = {};

  for (const item of equipmentSeed) {
    const { key, ...equipmentData } = item;
    const created = await Equipment.create(equipmentData);
    equipmentMap[key] = created;
  }

  for (const [key, lesson] of Object.entries(lessonSeed)) {
    await LessonPlan.create({
      equipmentId: equipmentMap[key]._id,
      ...lesson,
    });
  }

  const staffEmail = String(process.env.SEED_STAFF_EMAIL || "")
    .trim()
    .toLowerCase();
  const staffPassword = String(process.env.SEED_STAFF_PASSWORD || "");

  if (staffEmail && staffPassword.length >= 8) {
    const passwordHash = await bcrypt.hash(staffPassword, 12);

    await User.findOneAndUpdate(
      { email: staffEmail },
      {
        name: process.env.SEED_STAFF_NAME || "Tech It & Go Staff",
        email: staffEmail,
        passwordHash,
        role: "staff",
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("Staff demo account created or updated from environment variables.");
  }

  console.log("Tech It & Go sample equipment and lesson plans were added.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
