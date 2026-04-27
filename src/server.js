require("dotenv").config();

const express = require("express");
const cors = require("cors");
const initDatabase = require("../db/init");
const { pool, dbConfig } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

async function startApp() {
  await initDatabase(dbConfig);

  app.get("/api/tasks", async (req, res) => {
    const [rows] = await pool.query(
      "SELECT id, title, completed, created_at FROM tasks ORDER BY created_at DESC"
    );

    res.json(rows);
  });

  app.post("/api/tasks", async (req, res) => {
    const { title } = req.body;

    await pool.query("INSERT INTO tasks (title) VALUES (?)", [title]);

    res.status(201).json({ message: "Task created" });
  });

  app.put("/api/tasks/:id/toggle", async (req, res) => {
    await pool.query(
      "UPDATE tasks SET completed = NOT completed WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Task updated" });
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);

    res.json({ message: "Task deleted" });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startApp();