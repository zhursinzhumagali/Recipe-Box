import pool from "../db/pool.js";

export async function getComments(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT c.id, c.text, c.created_at, u.name AS author
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.recipe_id = $1
       ORDER BY c.created_at DESC`,
      [req.params.id]
    );
    res.json({ comments: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req, res, next) {
  try {
    const { user_id, text } = req.body;

    if (!user_id || !text || !text.trim()) {
      return res.status(400).json({ error: "user_id and text are required" });
    }
    if (text.length > 1000) {
      return res.status(400).json({ error: "Comment is too long (max 1000 characters)" });
    }

    const result = await pool.query(
      `INSERT INTO comments (user_id, recipe_id, text)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, req.params.id, text.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23503") {
      return res.status(404).json({ error: "User or recipe not found" });
    }
    next(err);
  }
}