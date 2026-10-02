import express from "express";
import dotenv from "dotenv";
import pool from "./db/pool.js";
import recipesRoutes from "./routes/recipes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

app.use("/recipes", recipesRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});