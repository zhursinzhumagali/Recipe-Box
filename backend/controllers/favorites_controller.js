import pool from "../db/pool.js";

export async function addFavorite(req, res, next) {
  try {
    const { user_id, recipe_id } = req.body;
    if (!user_id || !recipe_id) {
      return res.status(400).json({ error: "user_id and recipe_id are required" });
    }
    await pool.query(
      "INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user_id, recipe_id]
    );
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    if (err.code === "23503") {
      return res.status(404).json({ error: "User or recipe not found" });
    }
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2",
      [user_id, req.params.recipeId]
    );
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }
    const result = await pool.query(
      `SELECT r.* FROM favorites f
       JOIN recipes r ON r.id = f.recipe_id
       WHERE f.user_id = $1
       ORDER BY r.created_at DESC`,
      [user_id]
    );
    res.json({ favorites: result.rows });
  } catch (err) {
    next(err);
  }
}