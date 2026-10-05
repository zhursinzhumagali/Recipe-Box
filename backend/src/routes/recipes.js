import { Router } from 'express';

import fakeAuth from '../middleware/fakeAuth.js';

import ratingsRoutes from './ratings.js';
import commentsRoutes from './comments.js';

import {
    getRecipes,
    getMyRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipesController.js';

const router = Router();

router.get('/', getRecipes);
router.get('/mine', fakeAuth, getMyRecipes);
router.use('/:id/rating', ratingsRoutes);
router.use('/:id/comments', commentsRoutes);
router.get('/:id', getRecipe);

router.post('/', fakeAuth, createRecipe);
router.put('/:id', fakeAuth, updateRecipe);
router.delete('/:id', fakeAuth, deleteRecipe);

export default router;