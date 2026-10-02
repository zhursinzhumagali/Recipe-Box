import express from 'express';
import cors from 'cors';

import categoriesRoutes from './routes/categories.js';
import recipesRoutes from './routes/recipes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/categories', categoriesRoutes);
app.use('/recipes', recipesRoutes);

export default app;