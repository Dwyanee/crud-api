const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const PORT = 3000;

const app = express();
app.use(express.json())
app.use(cors());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "apiTask1",
    password: "dwyane0111",
    port: 5432
});

app.get('/database', async (req, res) => {
    const result = await pool.query("SELECT * FROM task WHERE is_completed = false");
    res.send(result.rows)
})
app.get('/database/done', async (req, res) => {
    const result = await pool.query("SELECT * FROM task WHERE is_completed = true");
    res.send(result.rows)
})
app.post("/database", async (req, res) => {
  try {
    const { title, description, due_date, is_completed } = req.body;
    const result = await pool.query(
        "INSERT INTO task (title, description, due_date, is_completed) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, description, due_date, is_completed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/database/:id", async (req, res) => {
  const { title, description, due_date, is_completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE task SET title=$1, description=$2, due_date=$3, is_completed=$4 WHERE id=$5 RETURNING *",
      [title, description, due_date, is_completed, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/database/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM task WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
    console.log("Server running on http://localhost:${PORT}");
});