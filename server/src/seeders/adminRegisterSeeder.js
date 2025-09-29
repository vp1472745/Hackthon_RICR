// seedAdmins.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Admin from "../models/adminRegisterModel.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/HackathonDB";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

if (!MONGO_URI) {
  console.error("MONGO_URI not set. Set it in your environment.");
  process.exit(1);
}

const adminData = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "superadmin",
    email: "superadmin@example.com",
    password: "superadmin123",
    role: "superadmin",
  },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB");

    // Ensure indexes exist for the unique constraint
    await Admin.createIndexes().catch((err) => {
      // index creation might already be in progress or completed
      console.warn("createIndexes warning:", err.message || err);
    });

    for (const admin of adminData) {
      const existing = await Admin.findOne({ email: admin.email }).lean();
      if (existing) {
        console.log(`${admin.email} already exists — skipping.`);
        continue;
      }

      const hashed = await bcrypt.hash(admin.password, SALT_ROUNDS);

      const doc = new Admin({
        username: admin.username,
        email: admin.email,
        password: hashed,
        role: admin.role,
      });

      await doc.save();
      console.log(`Seeded ${admin.role}: ${admin.email}`);
    }

    console.log("Seeding complete.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admins:", err);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
};

seedAdmins();
