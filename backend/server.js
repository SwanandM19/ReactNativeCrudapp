import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "todo_app" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Todo Schema & Model
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
    });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
