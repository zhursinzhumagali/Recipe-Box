import pool from '../db/pool.js';

export async function getCategories(req, res) {
    try {
        const result = await pool.query(
            'SELECT id, name FROM categories ORDER BY name'
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
}