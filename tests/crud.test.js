const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const request = require("supertest");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret-key";

const app = require("../app");
const connectDB = require("../config/connection");
const User = require("../models/User");
const Equipment = require("../models/Equipment");
const LessonPlan = require("../models/LessonPlan");
const LendingRequest = require("../models/LendingRequest");

function dateFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

before(async () => {
  await connectDB();

  await Promise.all([
    LendingRequest.deleteMany({}),
    LessonPlan.deleteMany({}),
    Equipment.deleteMany({}),
    User.deleteMany({}),
  ]);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("full CRUD, authentication, authorization, and ownership flow works", async () => {
  const borrowerRegistration = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Borrower Tester",
      email: "borrower@example.com",
      password: "Borrower123!",
    })
    .expect(201);

  assert.equal(borrowerRegistration.body.user.role, "borrower");
  assert.ok(borrowerRegistration.body.token);

  const borrowerToken = borrowerRegistration.body.token;

  const me = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${borrowerToken}`)
    .expect(200);

  assert.equal(me.body.user.email, "borrower@example.com");

  const borrowerLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "borrower@example.com",
      password: "Borrower123!",
    })
    .expect(200);

  assert.ok(borrowerLogin.body.token);

  const passwordHash = await bcrypt.hash("StaffPass123!", 12);

  await User.create({
    name: "Staff Tester",
    email: "staff@example.com",
    passwordHash,
    role: "staff",
  });

  const staffLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "staff@example.com",
      password: "StaffPass123!",
    })
    .expect(200);

  const staffToken = staffLogin.body.token;
  assert.equal(staffLogin.body.user.role, "staff");

  await request(app)
    .post("/api/equipment")
    .set("Authorization", `Bearer ${borrowerToken}`)
    .send({
      name: "Unauthorized Test Equipment",
      category: "Computers",
      description: "Borrowers should not be able to create equipment.",
      quantityAvailable: 1,
    })
    .expect(403);

  const createEquipment = await request(app)
    .post("/api/equipment")
    .set("Authorization", `Bearer ${staffToken}`)
    .send({
      name: "CRUD Test Robotics Kit",
      category: "Robotics",
      description: "Equipment created by the automated CRUD test.",
      quantityAvailable: 3,
      skillLevel: "Beginner",
      safetyNotes: "Follow the kit instructions.",
      onSiteOnly: false,
    })
    .expect(201);

  const equipmentId = createEquipment.body.equipment._id;

  const readEquipmentList = await request(app)
    .get("/api/equipment")
    .expect(200);

  assert.ok(
    readEquipmentList.body.equipment.some((item) => item._id === equipmentId)
  );

  const readOneEquipment = await request(app)
    .get(`/api/equipment/${equipmentId}`)
    .expect(200);

  assert.equal(readOneEquipment.body.equipment.quantityAvailable, 3);

  const updateEquipment = await request(app)
    .patch(`/api/equipment/${equipmentId}`)
    .set("Authorization", `Bearer ${staffToken}`)
    .send({
      quantityAvailable: 5,
      description: "Updated by the automated CRUD test.",
    })
    .expect(200);

  assert.equal(updateEquipment.body.equipment.quantityAvailable, 5);

  const lesson = await LessonPlan.create({
    equipmentId,
    title: "Robot Basics",
    objectives: ["Learn the main parts of a simple robot."],
    materials: ["Robotics kit"],
    steps: ["Review the parts.", "Build the robot.", "Test the robot."],
    skillLevel: "Beginner",
  });

  const readLessons = await request(app)
    .get(`/api/lessons?equipmentId=${equipmentId}`)
    .expect(200);

  assert.equal(readLessons.body.lessons.length, 1);
  assert.equal(readLessons.body.lessons[0]._id, lesson._id.toString());

  const createRequest = await request(app)
    .post("/api/requests")
    .set("Authorization", `Bearer ${borrowerToken}`)
    .send({
      equipmentId,
      checkoutDate: dateFromNow(7),
      returnDate: dateFromNow(10),
      purpose: "Practice robotics for a class project.",
    })
    .expect(201);

  const lendingRequestId = createRequest.body.request._id;
  assert.equal(createRequest.body.request.status, "pending");

  const readRequestList = await request(app)
    .get("/api/requests")
    .set("Authorization", `Bearer ${borrowerToken}`)
    .expect(200);

  assert.equal(readRequestList.body.pagination.total, 1);
  assert.equal(readRequestList.body.requests[0]._id, lendingRequestId);

  const readOneRequest = await request(app)
    .get(`/api/requests/${lendingRequestId}`)
    .set("Authorization", `Bearer ${borrowerToken}`)
    .expect(200);

  assert.equal(
    readOneRequest.body.request.purpose,
    "Practice robotics for a class project."
  );

  const secondBorrower = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Second Borrower",
      email: "second@example.com",
      password: "Second123!",
    })
    .expect(201);

  await request(app)
    .get(`/api/requests/${lendingRequestId}`)
    .set("Authorization", `Bearer ${secondBorrower.body.token}`)
    .expect(404);

  const updateRequest = await request(app)
    .patch(`/api/requests/${lendingRequestId}`)
    .set("Authorization", `Bearer ${borrowerToken}`)
    .send({
      checkoutDate: dateFromNow(8),
      returnDate: dateFromNow(12),
      purpose: "Updated robotics practice request.",
    })
    .expect(200);

  assert.equal(
    updateRequest.body.request.purpose,
    "Updated robotics practice request."
  );

  await request(app)
    .delete(`/api/requests/${lendingRequestId}`)
    .set("Authorization", `Bearer ${borrowerToken}`)
    .expect(204);

  await request(app)
    .get(`/api/requests/${lendingRequestId}`)
    .set("Authorization", `Bearer ${borrowerToken}`)
    .expect(404);

  await LessonPlan.deleteOne({ _id: lesson._id });

  await request(app)
    .delete(`/api/equipment/${equipmentId}`)
    .set("Authorization", `Bearer ${staffToken}`)
    .expect(204);

  await request(app)
    .get(`/api/equipment/${equipmentId}`)
    .expect(404);
});
