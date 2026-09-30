import express from "express";
import dotenv from "dotenv";
import pool from "./db/pool.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

app.listen(process.env.PORT, () => {
  console.log("Сервер запущен на порту " + process.env.PORT);
});