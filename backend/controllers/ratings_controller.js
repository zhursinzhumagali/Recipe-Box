import pool from "../db/pool.js";

export async function rateRecipe(req, res, next) {
  try {
    const recipe_id = req.params.id;
    const { user_id, value } = req.body;

    if (!user_id || !value) {
        return res.status(400).json({ error: "user_id and value are required" });
    }
    if (value < 1 || value > 5) {
        return res.status(400).json({ error: "value must be between 1 and 5" });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, recipe_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, recipe_id) DO UPDATE SET value = EXCLUDED.value`,
      [user_id, recipe_id, value]
    );
    res.status(201).json({ message: "Rating saved" });
  } catch (err) {
    if (err.code === "23503") {
      return res.status(404).json({ error: "User or recipe not found" });
    }
    next(err);
  }
}