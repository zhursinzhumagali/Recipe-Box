import pool from "../db/pool.js";

export async function getRecipes(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : "%";
    const category = req.query.category || null;

    const result = await pool.query(
      `SELECT * FROM recipes
       WHERE title ILIKE $1
       AND ($2::int IS NULL OR category_id = $2::int)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [search, category, limit, offset]
    );
    res.json({ page, limit, recipes: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT r.*, c.name AS category,
              ROUND(AVG(rt.value), 1) AS avg_rating
       FROM recipes r
       LEFT JOIN categories c ON c.id = r.category_id
       LEFT JOIN ratings rt ON rt.recipe_id = r.id
       WHERE r.id = $1
       GROUP BY r.id, c.name`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Рецепт не найден" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}