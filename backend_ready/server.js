// backend_ready/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Config ----
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/airline_reservation";

// ---- DB connect ----
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ---- Routes ----
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Airline backend connected to MongoDB!" });
});

// ---- Health route to show real DB status ----
app.get("/status", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({ dbState: states[mongoose.connection.readyState] });
});
// ---- Start server only after DB connects ----
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
});
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // stops app if DB connection fails
  }
}
start();