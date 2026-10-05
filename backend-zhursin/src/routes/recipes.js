import { Router } from 'express';

import fakeAuth from '../middleware/fakeAuth.js';

import {
    getMyRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/recipesController.js';

const router = Router();

router.get('/mine', fakeAuth, getMyRecipes);
router.get('/:id', getRecipe);

router.post('/', fakeAuth, createRecipe);
router.put('/:id', fakeAuth, updateRecipe);
router.delete('/:id', fakeAuth, deleteRecipe);

export default router;