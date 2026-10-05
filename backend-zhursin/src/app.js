import express from 'express';
import cors from 'cors';

import categoriesRoutes from './routes/categories.js';
import recipesRoutes from './routes/recipes.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/categories', categoriesRoutes);
app.use('/recipes', recipesRoutes);
app.use('/auth', authRoutes);

export default app;