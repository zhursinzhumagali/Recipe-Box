import express from 'express';
import cors from 'cors';

import categoriesRoutes from './routes/categories.js';
import recipesRoutes from './routes/recipes.js';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import limiter from './middleware/rateLimiter.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/categories', categoriesRoutes);
app.use('/recipes', recipesRoutes);
app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;