import fs from 'fs';
import pool from './pool.js';

const dry = process.argv.includes('--dry');

const file = new URL('./recipes.json', import.meta.url);
const { recipes } = JSON.parse(fs.readFileSync(file, 'utf8'));

function categoryName(recipe) {
    const name = (recipe.mealType && recipe.mealType[0]) || 'Other';
    return name === 'Snacks' ? 'Snack' : name;
}

async function getCategoryId(name) {
    const found = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
    if (found.rows.length > 0) {
        return found.rows[0].id;
    }
    const created = await pool.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id',
        [name]
    );
    return created.rows[0].id;
}

async function main() {
    let added = 0;
    let skipped = 0;

    for (const recipe of recipes) {
        if (dry) {
            console.log(`${recipe.name} | ${categoryName(recipe)} | ${recipe.image}`);
            added++;
            continue;
        }

        const exists = await pool.query(
            'SELECT id FROM recipes WHERE title = $1',
            [recipe.name]
        );
        if (exists.rows.length > 0) {
            skipped++;
            continue;
        }

        const categoryId = await getCategoryId(categoryName(recipe));
        const ingredients = recipe.ingredients.map(item => ({ name: item, amount: '' }));
        const cookTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

        await pool.query(
            `INSERT INTO recipes
             (author_id, title, description, category_id, ingredients, steps,
              cook_time_minutes, servings, image_url)
             VALUES (NULL, $1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                recipe.name,
                `${recipe.cuisine} · ${recipe.difficulty}`,
                categoryId,
                JSON.stringify(ingredients),
                JSON.stringify(recipe.instructions),
                cookTime || null,
                recipe.servings || null,
                recipe.image || null
            ]
        );
        added++;
    }

    console.log(`Added: ${added}, skipped (already exist): ${skipped}`);
}

main()
    .catch(error => {
        console.error('Import failed:', error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
