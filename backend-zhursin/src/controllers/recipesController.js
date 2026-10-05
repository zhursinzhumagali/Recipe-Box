import pool from '../db/pool.js';

export async function getMyRecipes(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                category_id AS "categoryId",
                ingredients,
                steps,
                cook_time_minutes AS "cookTimeMinutes",
                servings,
                image_url AS "imageUrl",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
             FROM recipes
             WHERE author_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Server error'
        });
    }
}

export async function getRecipe(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                category_id AS "categoryId",
                ingredients,
                steps,
                cook_time_minutes AS "cookTimeMinutes",
                servings,
                image_url AS "imageUrl",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
             FROM recipes
             WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Recipe not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Server error'
        });
    }
}

export async function createRecipe(req, res) {
    try {
        const {
            title,
            description,
            categoryId,
            ingredients,
            steps,
            cookTimeMinutes,
            servings,
            imageUrl
        } = req.body;

        if (!title || !ingredients || !steps) {
            return res.status(400).json({
                error: 'Title, ingredients and steps are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO recipes
            (author_id, title, description, category_id, ingredients, steps,
             cook_time_minutes, servings, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                req.user.id,
                title,
                description || null,
                categoryId || null,
                JSON.stringify(ingredients),
                JSON.stringify(steps),
                cookTimeMinutes || null,
                servings || null,
                imageUrl || null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
}
export async function updateRecipe(req, res) {
    try {
        const id = req.params.id;

        const {
            title,
            description,
            categoryId,
            ingredients,
            steps,
            cookTimeMinutes,
            servings,
            imageUrl
        } = req.body;

        const check = await pool.query(
            'SELECT * FROM recipes WHERE id = $1',
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'Recipe not found'
            });
        }

        if (check.rows[0].author_id !== req.user.id) {
            return res.status(403).json({
                error: 'Not allowed'
            });
        }

        const result = await pool.query(
            `UPDATE recipes SET
                title = $1,
                description = $2,
                category_id = $3,
                ingredients = $4,
                steps = $5,
                cook_time_minutes = $6,
                servings = $7,
                image_url = $8,
                updated_at = now()
             WHERE id = $9
             RETURNING *`,
            [
                title,
                description || null,
                categoryId || null,
                JSON.stringify(ingredients),
                JSON.stringify(steps),
                cookTimeMinutes || null,
                servings || null,
                imageUrl || null,
                id
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
}


export async function deleteRecipe(req, res) {
    try {
        const id = req.params.id;

        const check = await pool.query(
            'SELECT * FROM recipes WHERE id = $1',
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'Recipe not found'
            });
        }

        if (check.rows[0].author_id !== req.user.id) {
            return res.status(403).json({
                error: 'Not allowed'
            });
        }

        await pool.query(
            'DELETE FROM recipes WHERE id = $1',
            [id]
        );

        res.status(204).end();

    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
}